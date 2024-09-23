const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();

const expressLayouts = require('express-ejs-layouts');

const app = express();

// 使用 express-ejs-layouts 中间件
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // 设置默认布局为 layout.ejs

// 设置 Express 使用静态文件夹
app.use(express.static('public'));

// 连接到 MongoDB 数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 中间件配置
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'hy6027475',
  resave: false,
  saveUninitialized: true,
}));

// 配置 Passport Auth0 策略
const strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
}, (accessToken, refreshToken, extraParams, profile, done) => {
  return done(null, profile);
});

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// 序列化用户
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// 路由配置
app.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), (req, res) => {
  res.redirect('/');
});

app.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// 原来的路由
app.use('/', require('./routes/index'));

// 路由
//app.get('/', (req, res) => {
//    res.render('index', { title: 'Home' });
//});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});