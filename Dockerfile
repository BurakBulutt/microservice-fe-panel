FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY .env.production .env

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
