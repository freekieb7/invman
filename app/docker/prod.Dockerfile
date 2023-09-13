FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --link package.json package-lock.json* ./
# Omit --production flag for TypeScript devDependencies
RUN npm ci

COPY --link src ./src
COPY --link public ./public
COPY --link next.config.js .
COPY --link tsconfig.json .
COPY --link tailwind.config.js .
COPY --link postcss.config.js .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN npm run build

# Note: Don't expose ports here, Compose will handle that for us
# Start Next.js based on the preferred package manager
CMD npm run start