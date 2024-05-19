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
  Person.countDocuments((err, count) => {
    if (err) {
      res.status(500).send("Error fetching person count");
    } else {
      const receivedTime = new Date(); // 当前时间
      const content = `Phonebook has info for ${count} people`; // 信息内容
      // 返回包含联系人数量和当前时间的 HTML 内容
      response.send(`<p>${content}</p><p>${receivedTime.toString()}</p>`);
    }
  });
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
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// 添加新的联系人
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  // 验证由 mongoose 完成
  Person.findOneAndUpdate(
    { name: body.name }, // 查询条件
    { name: body.name, number: body.number }, // 更新的内容
    {
      new: true, // 返回更新后的文档
      upsert: true, // 如果不存在则创建新文档
      runValidators: true, // 启用 Schema 验证器
    }
  )
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

// 更新联系人
app.put("/api/persons/:id", (request, response, next) => {
  const note = {
    name: request.body.content,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, note, {
    new: true,
    upsert: true,
    runValidators: true,
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// 错误处理的中间件
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

// 启动服务器，监听指定端口
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
