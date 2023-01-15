FROM node:18-alpine as build
EXPOSE 3000
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm run build
COPY . .
CMD npm run start

FROM nginx:1.23.3-alpine
COPY --from=build /app/dist/bugtracker /usr/share/nginx/html
