# Vue 3 + TypeScript + Vite

# Vue3 Admin Template

# Api Template

http://39.98.123.211:8510/swagger-ui.html
http://139.198.104.58:8212/swagger-ui.html
http://139.198.104.58:8209/swagger-ui.html

http://sph-api.atguigu.cn

# Project Package

1. 修改配置文件线上环境 .env.production VITE_APP_BASE_API 为线上环境
2. pnpm run build
3. generate files : dist folder
4. 将 dist folder 上传至服务器
5. 服务器安装配置 nginx 代理
   - yum install nginx
   - nginx 配置文件 nginx.conf
   - 修改 nginx.conf 文件 ( server -> location -> root /root/xxx/dist; && index index.html index.html;)，将 (user nginx; 改为user root;)
   - 重启nginx服务（ systemctl restart nginx.service）
