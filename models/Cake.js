// models/Cake.js
const mongoose = require('mongoose');

// 定义蛋糕的 Schema
const CakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String, // 存储照片的 URL 或者照片文件路径
    required: true,
  },
  sizes: [
    {
      size: {
        type: String, // 存储尺寸，例如 '6寸', '8寸'
        required: true,
      },
      price: {
        type: Number, // 存储对应尺寸的价格
        required: true,
      },
    },
  ],
  type: {
    type: String,
    enum: [
      'Hot', 'Fruit', 'Horoscope', 'Women', 'Men', 'Baby', 'Love', 'Drawing',
      'Funny', 'Congratulations', 'Simple', 'Elder', 'Beanpaste', 'Double'
    ], // 定义所有可能的类型
    default: 'Simple', // 默认为 Simple
  },
});

// 创建 Cake 模型
const Cake = mongoose.model('Cake', CakeSchema);

module.exports = Cake;