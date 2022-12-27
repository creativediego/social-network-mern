FROM node:14-slim as build
WORKDIR /client
COPY package.json ./
RUN npm install
COPY . .
RUN run build

FROM nginx:1.19
COPY --from=build /client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]