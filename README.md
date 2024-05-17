## 创建后端应用程序的步骤
1. 使用 `npm init` 命令创建后端项目模板
```
npm init
```
2. 添加启动应用程序的脚本命令 "node index.js"
```json
  "scripts": {
    "start": "node index.js",
    // ...
  }
```

3. 安装 Express 库，并导入项目文件（index.js）
```
npm install express
```
```js
const express = require('express')
const app = express()
```

4. 安装 nodemon 库（开发环境依赖）。避免每次修改项目都需要重新启动服务器。
```
npm install --save-dev nodemon
```
在项目模板中添加 nodemon 的启动脚本
```json
  "scripts": {
    "dev": "nodemon index.js",
    // ...
  }
```
启动服务器
```
npm run dev
```


## express 模板
```js
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id
    response.json(id)
});

app.post('/api/notes', (request, response) => {
    const note = request.body
    response.json(note)
  })

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

## **Note:**
```js
  // Node.js 本身不直接支持 JSX。需要使用 ES6 的模板字符串（反引号包裹的字符串）
  response.send(`<p>${content}</p><p>${receivedTime}</p>`);
```# FullStackOpen-2024-Phonebook-backend
