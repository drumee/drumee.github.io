# Drumee documentation site: build the static Docusaurus site, serve it with nginx.
#   docker build -t drumee-docs .
#   docker run --rm -p 8080:80 drumee-docs        → http://localhost:8080

# ---- build -----------------------------------------------------------------------------------
# Node 20, as the CI workflow (.github/workflows/deploy.yml) and package.json "engines" expect.
FROM node:20.19.5-alpine3.22 AS build
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- serve -----------------------------------------------------------------------------------
FROM nginx:1.28.0-alpine3.21
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /site/build /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
