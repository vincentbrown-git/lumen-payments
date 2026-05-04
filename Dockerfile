FROM node:20-alpine
WORKDIR /app

# Copy package files first so Docker can cache the install layer
COPY package*.json ./
RUN npm ci --omit=dev

# Then copy the rest of the source
COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
