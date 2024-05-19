// 引入 Mongoose 库
const mongoose = require('mongoose')

// 检查命令行参数是否包含密码
// 必须传入 3 或 5 个参数：
// 1. 仅密码，用于查看所有联系人
// 2. 密码、姓名和电话号码，用于添加新联系人
if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log("Invalid input. Please enter the following command:");
  console.log(
    " 1. Add a new phone number, enter: node mongo.js <password> <name> <number>"
  );
  console.log(" 2. View all phone number, enter: node mongo.js <password>");
  process.exit(1);
}

// 从命令行参数中获取密码
const password = process.argv[2];

// 构建 MongoDB 连接字符串
const url = `mongodb+srv://maixiang:${password}@cluster0.be9nkgs.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`;

// 设置 Mongoose 选项，禁用严格查询模式
mongoose.set("strictQuery", false);

// 连接到 MongoDB 数据库
mongoose.connect(url);

// 定义 Person 模型的 Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// 创建 Person 模型
const Person = mongoose.model("Person", personSchema);

// 添加新联系人
const addNewPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  });

  // 保存联系人到数据库，并在成功后关闭连接
  person.save().then((savedPerson) => {
    console.log(`added ${savedPerson.name} ${savedPerson.number} to phonebook`);
    mongoose.connection.close();
  });
};

// 显示数据库中所有的条目
const getAll = () => {
  // 查找所有联系人，并在成功后关闭连接
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(0);
  });
};

// 根据命令行参数判断要执行的动作
if (process.argv.length === 3) {
  // 查看数据库所有条目
  getAll();
}

if (process.argv.length === 5) {
  // 新增条目到数据库
  const name = process.argv[3];
  const number = process.argv[4];
  addNewPerson(name, number);
}
