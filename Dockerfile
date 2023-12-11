# db container
FROM mysql:8.0.32 as db
ENV MYSQL_ROOT_PASSWORD=password \
    MYSQL_DATABASE=default
COPY db/initialise_db.sql /docker-entrypoint-initdb.d/initialise_db.sql

# server and web containers
FROM node:18.15.0-alpine as package_json_files
WORKDIR /app
COPY package*.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/server/package.json ./packages/server/package.json
COPY packages/web/package.json ./packages/web/package.json

FROM package_json_files as deps_installed
RUN npm ci
COPY tsconfig.json .eslintrc .eslintignore ./

FROM deps_installed as server_build
COPY packages/core /app/packages/core
COPY packages/server /app/packages/server
WORKDIR /app/packages/server
RUN npm run build

FROM deps_installed as web_build
COPY packages/core packages/core
COPY packages/server /app/packages/server
COPY packages/web /app/packages/web
WORKDIR /app/packages/web
RUN npm run build

FROM package_json_files as server
# Don't install dev dependancies
RUN npm ci --omit=dev
COPY packages/server/tsconfig-paths-bootstrap.js /app/packages/server/tsconfig-paths-bootstrap.js
COPY --from=server_build /app/packages/server/build /app/packages/server/build
WORKDIR /app/packages/server
CMD [ "node", "-r", "./tsconfig-paths-bootstrap.js", "." ]

FROM nginx:1.23.4-alpine as web
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web_build /app/packages/web/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
