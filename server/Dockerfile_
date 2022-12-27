FROM node:14-slim as build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=build /app/build ./build
COPY .env ./
COPY . .
EXPOSE 5000
CMD ["npm", "start"]