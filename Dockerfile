FROM node:18-alpine AS build
WORKDIR /app
COPY . . 
RUN npm install --omit=dev
RUN npm run build

FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]