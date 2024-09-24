// routes/cakes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Cake = require('../models/Cake'); // 引入 Cake 模型

// 配置 multer，用于存储图片到 public/uploads 目录
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // 设置图片保存路径
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用时间戳和原始扩展名作为文件名
  },
});

const upload = multer({ storage: storage });

// 显示添加蛋糕的表单页面
router.get('/addcake', (req, res) => {
  res.render('addcake'); // 渲染 addcake.ejs 表单页面
});

// 处理表单提交，添加新的蛋糕
router.post('/add', upload.single('photo'), async (req, res) => {
  const { name, description, sizes, type } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newCake = new Cake({
      name,
      description,
      photo: photoPath,
      sizes: JSON.parse(sizes), // 将尺寸和价格从 JSON 字符串解析为对象
      type, // 存储蛋糕的类型
    });

    await newCake.save();
    res.status(201).send('Cake added successfully');
  } catch (error) {
    res.status(400).send('Error adding cake: ' + error.message);
  }
});

// 获取所有蛋糕，支持分页
router.get('/all', async (req, res) => {
  const type = req.query.type || 'Hot'; // 默认类型为 Hot
  const page = parseInt(req.query.page) || 1; // 获取当前页码，默认为第 1 页
  const limit = 9; // 每页显示的蛋糕数量
  let query = {};

  if (type) {
    query = { type }; // 根据类型过滤蛋糕
  }

  try {
    // 获取蛋糕总数以计算总页数
    const totalCakes = await Cake.countDocuments(query);
    const totalPages = Math.ceil(totalCakes / limit);

    // 获取当前页的蛋糕数据
    const cakes = await Cake.find(query)
      .skip((page - 1) * limit) // 跳过前面的蛋糕数据
      .limit(limit); // 限制获取的蛋糕数量

    // 确保在渲染时传递了 cakes 变量
    res.render('allcakes', { cakes, currentPage: page, totalPages, type });
  } catch (error) {
    res.status(500).send('Error fetching cakes: ' + error.message);
  }
});
// 测试路由，渲染 allcakes.ejs
//router.get('/all', (req, res) => {
//  res.render('allcakes'); // 渲染 allcakes.ejs
//});

module.exports = router;