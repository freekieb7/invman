FROM node:18-alpine

# For health check
RUN apk add curl

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy files to ..............
COPY next.config.js .
COPY tsconfig.json .
COPY tailwind.config.js .
COPY postcss.config.js .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us
# Start Next.js in development mode based on the preferred package manager
CMD npm run dev
