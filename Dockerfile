# Stage 1
FROM node:10-alpine as build-step

#RUN mkdir -p /app
WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY ./ ./

RUN npm install
#COPY . /app
RUN npm run build

# Stage 2
FROM nginx:1.17.1-alpine

COPY --from=build-step /app/build /usr/share/nginx/html
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
