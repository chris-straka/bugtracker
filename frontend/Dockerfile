FROM node:18-alpine as build
EXPOSE 4200
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD npm run start

FROM nginx:1.23.3-alpine
COPY --from=build /app/dist/bugtracker /usr/share/nginx/html
