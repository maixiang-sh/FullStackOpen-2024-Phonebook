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
```



## Express 应用程序 目录结构

```
my-express-app/
├── node_modules/
├── public/                 # 静态文件目录 (如 HTML, CSS, JS)
├── src/
│   ├── controllers/        # 控制器层
│   │   ├── userController.js
│   │   └── ...
│   ├── middlewares/        # 中间件
│   │   ├── authMiddleware.js
│   │   └── ...
│   ├── models/             # 数据模型 (如 Mongoose 模型)
│   │   ├── userModel.js
│   │   └── ...
│   ├── routes/             # 路由
│   │   ├── userRoutes.js
│   │   └── ...
│   ├── services/           # 服务层
│   │   ├── userService.js
│   │   └── ...
│   ├── utils/              # 工具函数
│   │   ├── logger.js
│   │   └── ...
│   ├── app.js              # 应用程序主文件
│   └── config.js           # 配置文件
├── .env                    # 环境变量文件
├── .gitignore
├── package.json
└── README.md
```

	•	public/: 存放静态文件（如 HTML, CSS, JavaScript 文件）。
	•	src/: 所有源代码文件都放在 src 目录中。
	•	controllers/: 控制器层，处理请求并返回响应。
	•	middlewares/: 自定义中间件文件。
	•	models/: 数据模型，通常与数据库交互。
	•	routes/: 路由定义文件，将请求路径映射到控制器方法。
	•	services/: 服务层，包含业务逻辑和操作。
	•	utils/: 工具函数和辅助功能。
	•	app.js: 应用程序主文件，配置 Express 应用。
	•	config.js: 配置文件，用于管理环境配置和其他全局设置。
	•	.env: 环境变量文件，用于存储敏感信息和配置。
	•	package.json: 项目描述文件，包含项目依赖和脚本。
	•	.gitignore: Git 忽略文件，指定不需要提交到版本控制的文件和目录。
