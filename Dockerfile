# Dockerfile

FROM node:22-alpine

# Tạo thư mục app
WORKDIR /app

# Copy các file
COPY package*.json ./
RUN npm install

COPY . .

# Build app NestJS
RUN npm run build

# Expose port (ví dụ app chạy ở port 3000)
EXPOSE 3000

# Start app
CMD ["node", "dist/main"]
