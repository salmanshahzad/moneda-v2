FROM node:18.4.0
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["npm", "start"]
