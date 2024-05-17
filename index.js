const express = require("express");
const app = express();

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
 * 用于生成 Person 实例的 id
 */
const generateId = () => {
  const existingIds = new Set(persons.map((p) => p.id));
  const randomId = Math.floor(Math.random() * 100000);

  let newId;
  do {
    const newId = Math.floor(Math.random() * 100000);
  } while (existingIds.has(newId));

  return newId;
};

// 用于解析请求体（body）中的 JSON 数据
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const receivedTime = new Date();
  const numberOfPhonebook = persons.length;
  const content = `Phonebook has info for ${numberOfPhonebook} people`;
  // Node.js 本身不直接支持 JSX。需要使用 ES6 的模板字符串（反引号包裹的字符串）
  response.send(`<p>${content}</p><p>${receivedTime.toString()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    return response.json(person);
  } else {
    response.status(404).end(`Person ${request.params.id} not found`);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // 如果 name 或 number 参数缺失
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // 如果 name 或 number 参数值为空
  if (body.name.trim().length === 0 || !body.number.trim().length === 0) {
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

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

// 监听 3001 端口
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
