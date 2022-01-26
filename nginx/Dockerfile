FROM nginx:1.21.5-alpine

# remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# copia um arquivo customizado para configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d

# cria um arquivo index.html para evitar erros na inicialização do Nginx
RUN mkdir /var/www/html -p && touch /var/www/html/index.html
