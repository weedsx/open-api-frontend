# 介绍
提供 API 接口供开发者调用的平台，基于 Spring Boot 后端 + React 前端的全栈微服务项目。管理员可以接入并发布接口、统计分析各接口调用情况；用户可以注册登绿并开通接口调用权限、浏览接口、在线调试，还能使用客户端 SDK 轻松在代码中调用接口。

# 技术难点

## 前端根据后端自动生成请求

基于 openapi 的规范，后端的接口文档可以整理成一个 JSON ，前端可以用插件根据这个 JSON 生成请求方法

<img src="README.assets\1689067124322-eb82ea0b-b2a7-4363-9b2d-3d2538a1e848.png" alt="img"  />

<img src="README.assets\1689067470124-4e189b43-7f28-4aa0-95c9-8df9b2290f40.png" alt="img"  />

## setState 的一个天坑

如果你发现调用了状态更新函数`setXxx(...)`后，**随后**读取对应状态值并没有改变，并且你使用状态更新函数的姿势也没问题，那么就是因为 setState 的这个天坑：**异步更新**

React 可能会对状态更新进行异步处理，所以状态更新并不会立即反映在下一行代码。这是为了性能优化，React 可能会在某个时间点合并多个状态更新，然后再进行一次重新渲染。这种情况下，你在状态更新函数之后立即读取状态值可能不会得到预期结果。

那如何随后就可以读取到新的状态呢？

1. 要么**使用**`useEffect`**监测状态的变化**，但是这种做法不灵活
2. **使用**`setXxx()`**的回调**：

```typescript
setXxx(newState);
// preState 就是最新的值
setXxx((preState) => {
  // 需要使用最新值的操作
  collectRequestParam(preState);
  return preState;
});
```

# 技术栈

- React 18
- Ant Design Pro 5.x 脚手架
- Ant Design & Procomponents 组件库
- Umi 4 前端框架
- OpenAPI 前端代码生成
- react-json-view