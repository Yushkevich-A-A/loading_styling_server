const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const Router = require('koa-router');
const json = require('koa-json');
const router = new Router();
const uuid = require('uuid');
const slow = require('koa-slow');
const { db } = require('./DB/db');

app.use( koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(json());

app.use(slow({
  url: /getdata$/i,
  delay: 10000,
}))

app.use( async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    console.log('! OPTIONS');
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

router.get('/getdata', (ctx) => {
  console.log('запрос получен')
  ctx.response.status = 404;
  console.log('запрос отправлен')
})

router.get('/getnews', (ctx) => {
  const randomValue = Math.round(Math.random() * 10);
  if (randomValue > 5) {
    ctx.response.body = db.getNews();
    return;
  }
  ctx.response.status = 500;
})


app.use(router.routes()).use(router.allowedMethods());

server.listen(port);