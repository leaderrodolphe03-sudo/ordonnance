FROM node:24-alpine
ENV NODE_ENV=production TZ=Africa/Porto-Novo DATA_DIR=/data
RUN apk add --no-cache tzdata
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p /data && chown node:node /data
VOLUME /data
EXPOSE 3000
USER node
CMD ["node", "server.js"]
