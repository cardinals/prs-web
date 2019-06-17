# 全景搜索

### 安装依赖
```
yarn install
```

### 开发环境运行
```
yarn run serve
```

### 构建生产环境代码
```
yarn run build
```

### 构建生产环境docker镜像
```
yarn run build-image
```

### 将docker镜像启动为容器
```
docker run --name=nginx_search_personfile --restart=always -d -p 8090:80 -e LOCATION='\/SearchCase' -e PROXY_PASS='http:\/\/192.168.93.70:8081' nginx/search-personfile:latest
```