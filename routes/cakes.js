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
    // 使用当前时间戳 + 原文件名作为新文件名，避免重复
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 添加一个新的蛋糕，支持图片上传
router.post('/add', upload.single('photo'), async (req, res) => {
  const { name, description, sizes } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : ''; // 获取上传的图片路径

  try {
    const newCake = new Cake({
      name,
      description,
      photo: photoPath, // 存储图片路径
      sizes: JSON.parse(sizes), // 将尺寸和价格从 JSON 字符串解析为对象
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

// 根据 ID 获取单个蛋糕
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).send('Cake not found');
    }
    res.json(cake);
  } catch (error) {
    res.status(500).send('Error fetching cake: ' + error.message);
  }
});

module.exports = router;