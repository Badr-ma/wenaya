FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=6144" npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]