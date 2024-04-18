# Build Stage
FROM node:18-alpine AS builder
WORKDIR /my-space

COPY package.json ./
RUN npm i --emit=env
COPY . .
RUN npm run build


# Production Stage
FROM node:18-alpine AS runner
WORKDIR /my-space
COPY --from=builder /my-space/package.json .
COPY --from=builder /my-space/package-lock.json .
COPY --from=builder /my-space/next.config.js ./
COPY --from=builder /my-space/postcss.config.js ./
COPY --from=builder /my-space/tailwind.config.js ./
COPY --from=builder /my-space/public ./public
COPY --from=builder /my-space/.next/standalone ./
COPY --from=builder /my-space/.next/static ./.next/static
EXPOSE 3000
CMD ["npm", "start"]