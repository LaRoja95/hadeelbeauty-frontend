FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html product.html thank-you.html arencia.html style.css app.js product.js arencia.js thank-you.js tracking.js config.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
