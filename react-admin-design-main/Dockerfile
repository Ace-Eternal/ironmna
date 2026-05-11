FROM node:20-alpine AS build

WORKDIR /app
ENV HUSKY=0

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /etc/nginx/conf.d

EXPOSE 8080

USER nginx
