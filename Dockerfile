FROM node:18.12.0

WORKDIR /usr/local/bin/app

#src to working dir
COPY . .

RUN npm install --prefix server
RUN npm run build --prefix server
RUN npm install --prefix client
RUN npm run build --prefix client


EXPOSE 5500
EXPOSE 3000

CMD ["npm" , "start"]