FROM node:14

COPY ../../.. /app

RUN cd /app && \
    npm install --production && \
    chmod +x /app/start.js
CMD ["node", "/app/start.js"]
