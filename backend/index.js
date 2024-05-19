// 引入所需模块
require("dotenv").config(); // 加载环境变量
const express = require("express"); // Express 框架
const app = express(); // 创建一个 Express 应用实例
const Person = require("./models/person");
const morgan = require("morgan"); // HTTP 请求日志记录中间件
const cors = require("cors"); // 处理跨域请求的中间件

// 初始数据：模拟的联系人列表
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

/**
 * 生成唯一 ID 的函数
 * 避免重复 ID
 */
const generateId = () => {
  const existingIds = new Set(persons.map((p) => p.id)); // 创建一个包含所有现有 ID 的集合

  let newId;
  do {
    newId = Math.floor(Math.random() * 100000); // 生成一个随机 ID
  } while (existingIds.has(newId)); // 确保 ID 不重复

  return newId;
};

// 解决浏览器的同源策略问题
app.use(cors());

// 提供静态文件服务
// Express 在收到 HTTP GET 请求时，会首先检查 dist 目录是否包含与请求地址对应的文件。如果找到，返回该文件。
app.use(express.static("dist"));

// 用于解析请求体（body）中的 JSON 数据
app.use(express.json());

// 创建自定义的 morgan token，用于记录请求体
morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : null; // 仅记录 POST 请求的请求体
});

// 使用 morgan 中间件，记录简洁的请求日志
// 格式：POST /api/persons 200 33 - 3.261 ms {"name":"Diu Diu","number":"110"}
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// 根路径路由处理
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>"); // 返回 Hello World
});

// 获取所有联系人信息
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => response.json(result));
});

// 信息页面
app.get("/info", (request, response) => {
  const receivedTime = new Date(); // 当前时间
  const numberOfPhonebook = persons.length; // 联系人数量
  const content = `Phonebook has info for ${numberOfPhonebook} people`; // 信息内容
  // 返回包含联系人数量和当前时间的 HTML 内容
  response.send(`<p>${content}</p><p>${receivedTime.toString()}</p>`);
});

// 获取特定 ID 的联系人信息
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

// 删除特定 ID 的联系人
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); // 从 URL 参数中获取 ID
  persons = persons.filter((p) => p.id !== id); // 过滤掉该 ID 的联系人
  response.status(204).end(); // 返回 204 无内容
});

// 添加新的联系人
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // 如果 name 或 number 参数缺失
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // 如果 name 或 number 参数值为空
  if (body.name.trim().length === 0 || body.number.trim().length === 0) {
    return response.status(400).json({
      error: "name or number cannot be empty",
    });
  }

  // 如果 name 已存在
  if (persons.some((p) => p.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  // 创建新的联系人对象
  const newPerson = new Person({
    name: body.name, // 联系人姓名
    number: body.number, // 联系人号码
  });

  // 添加到联系人列表
  newPerson.save().then((savedPerson) => {
    response.json(newPerson); // 返回新的联系人信息的 JSON
  });
});

// 启动服务器，监听指定端口
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
