# 使用官方Node镜像作为构建基础
FROM node:16-alpine as build

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=80

# 复制package.json和lock文件
COPY package.json package-lock.json* yarn.lock* ./

# 安装依赖，使用npm缓存加速构建
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm install --production=false && \
    npm cache clean --force

# 复制所有文件
COPY . .

# 构建应用
RUN npm run build

# 使用新的镜像以减小体积
FROM nginx:alpine

# 设置工作目录
WORKDIR /app

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建好的文件
COPY --from=build /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost/ || exit 1

# 暴露80端口 (微信云托管要求)
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 