# ej-ds-prs/prs-web

### 安装依赖
```
yarn install
```

### 开发环境运行
```
yarn serve
```

### 构建生产环境代码
```
yarn build
```

### 基于xx分支构建镜像
```
<!-- 切换xx分支 -->
git checkout <分支名称>
<!-- 安装依赖 -->
yarn install
<!-- 构建镜像 -->
yarn build-image <会执行两个命令yarn build && docker build -t 192.168.93.172/ej_ds_prs/prs-web:latest ./docker>
```

### 修改镜像tag
```
docker tag 192.168.93.172/ej_ds_prs/prs-web:latest 192.168.93.172/ej_ds_prs/prs-web:<版本号>
```

### 将镜像推送到私有仓库
```
docker push 192.168.93.172/ej_ds_prs/prs-web:<版本号>
```

### 从私有仓库拉取指定版本镜像
```
docker pull 192.168.93.172/ej_ds_prs/prs-web:<版本号>
```

### 将镜像启动为容器
```
docker run --name=ej_ds_prs/prs_web --restart=always -d -p 8090:80 -e LOCATION='\/SearchCase' -e PROXY_PASS='http:\/\/192.168.93.70:8081' 192.168.93.172/ej_ds_prs/prs_web:<版本号>
```