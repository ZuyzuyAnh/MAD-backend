# Production stage
FROM node:18-alpine

WORKDIR /app

# Cài pnpm toàn cục
RUN npm install -g pnpm

# Copy chỉ package files để cache layer
COPY package*.json ./

# Cài tất cả dependencies (dev + prod)
RUN pnpm install

# Copy mã nguồn đã build từ builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
