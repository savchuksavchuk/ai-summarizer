FROM node:20

WORKDIR /app

# Install build dependencies for native modules (canvas)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Increase Node.js memory limit for OCR processing
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
