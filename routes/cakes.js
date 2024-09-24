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

// 获取所有蛋糕
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (error) {
    res.status(500).send('Error fetching cakes: ' + error.message);
  }
});

module.exports = router;