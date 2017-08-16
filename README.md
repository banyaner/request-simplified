# request-simplified

不依赖其他任何框架的简易http请求插件
支持 post、 get、jsonp请求
适用于移动端项目


## 安装

可以使用npm安装

```
npm install request-simplified
```
或直接引用index.js

## 使用

## 设置根路径

```javascript
import root from 'request-simplified'
request.root('http://postman-echo.com')
```

### get请求

```javascript
import request from 'request-simplified'
request.get('http://postman-echo.com/get', { test: 123 }, function(res) {
    console.log(res)
}, function(res) {
    console.log(res)
})
// 也可以设置根路径
request.root('http://postman-echo.com')
request.get('/get', { test: 123 }, function(res) {
    console.log(res)
}, function(res) {
    console.log(res)
})
```

### jsonp请求

```javascript
request.jsonp('http://comment.api.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/CJHB85H800308BQA/comments/newList', { limit: 15, offset: 0 }, function(res) {
    console.log(res)
})
```

### post请求

```javascript
request.post(url, formData, { 'Content-Type': 'application/x-www-form-urlencoded' }, function(res) {
    console.log(res)
}, function(res) {
    console.log(res)
})
```
