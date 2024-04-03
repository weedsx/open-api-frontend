# 第一阶段：构建
FROM node:lts-alpine as builder
WORKDIR /open-api-frontend
COPY package.json .
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
RUN npm run build

# 第二阶段：运行
FROM nginx:alpine
COPY --from=builder /open-api-frontend/dist /usr/share/nginx/html
EXPOSE 80
