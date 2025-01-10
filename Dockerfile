FROM 22.13.0-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install --save -g @angular/cli
RUN npm install --save -g @angular/cdk

COPY . /app

RUN ng build --configuration=production

##########

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/order-management /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
