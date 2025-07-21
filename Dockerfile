FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY bun.lock ./

RUN npm install --include=dev

COPY . .

RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL:-https://api.gpmailer.ru}" > .env
RUN echo "VITE_COOKIE_DOMAIN=${VITE_COOKIE_DOMAIN:-.gpmailer.ru}" >> .env

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 