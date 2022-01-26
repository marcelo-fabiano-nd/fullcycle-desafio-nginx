# Desafio Fullcycle Nginx com Node

O desafio consiste em criar uma aplicação *NodeJS* que realiza um *print* de texto na tela com a mensagem ***Fullcycle Rocks***, mas a lista de registros de uma tabela que está armazenada em um banco de dados *MySQL*.

## Criando as imagens para a aplicação

Foi criado dentro dos diretórios: *nginx* e *node* do projeto um arquivo  `Dockerfile`  contendo o passo-a-passo (receita de bolo) de criação da imagem  _Docker_  que posteriormente será utilizada para execução da aplicação em um container.

Para a criação da imagem *nginx* foi utilizado o seguinte *Dockerfile*:

    FROM nginx:1.21.5-alpine
    
    # remove o arquivo de configuração padrão do Nginx
    RUN rm /etc/nginx/conf.d/default.conf
    
    # copia um arquivo customizado para configuração do Nginx
    COPY nginx.conf /etc/nginx/conf.d
    
    # cria um arquivo index.html para evitar erros na inicialização do Nginx
    RUN mkdir /var/www/html -p && touch /var/www/html/index.html

> Junto ao arquivo *Dockerfile* para o *Nginx* foi criado também um arquivo ***nginx.conf*** para customização e execução da aplicação *NodeJS* através do *Nginx*

Arquivo *nginx.conf*:

    server{
        listen 80;
        server_name fullcycle-nginx;
    
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
    
        charset utf-8;
    
        location / {
            proxy_set_header    Host $http_host;
            proxy_set_header    X-Real-IP $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header    X-NginX-Proxy true;
            proxy_pass          http://fullcycle-node:5000;
            proxy_cache_bypass  $http_upgrade;
            proxy_redirect      off;
        }
    }

Para a criação da imagem *node* foi utilizado o seguinte *Dockerfile*: 

    FROM node:17.4
    WORKDIR /usr/srv/app
    
    # atualiza o sitema operacional para instalação do DOCKERIZE
    RUN apt-get update && apt-get install -y wget
    
    # instala o DOCKERIZE
    ENV DOCKERIZE_VERSION v0.6.1
    RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
        && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
        && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
    
    # expõe a porta 5000
    EXPOSE 5000
    
    # inicializa o aplicativo
    CMD ["node", "index.js"]

> Para a construção do container para utilização do *MySQL* foi criado um arquivo de *script* de inicialização que contém a criação da tabela ***people*** que será utilizada na aplicação.

Arquivo init.sql:

    USE nodedb;
    CREATE TABLE IF NOT EXISTS people (id int auto_increment, name varchar(255), primary key (id));

# Docker Compose

Para criação do ambiente do desafio foi utilizado o seguinte arquivo de manifesto:

    version: '3.8'
    
    services:
      node:
        build:
          context: node
        image: nossadiretiva/fullcycle-node:v1
        container_name: fullcycle-node
        entrypoint: dockerize -wait tcp://fullcycle-mysql:3306 -timeout 10s docker-entrypoint.sh
        depends_on:
          - database
        networks:
          - fullcycle-net
        volumes:
          - ./node:/usr/srv/app
        ports:
          - 5000:5000
        tty: true
    
      nginx:
        build: 
          context: nginx
        image: nossadiretiva/fullcycle-nginx:v1
        container_name: fullcycle-nginx
        depends_on:
          - node
        networks:
          - fullcycle-net
        ports:
          - 8080:80
        tty: true
    
      database:
        image: mysql:5.7
        container_name: fullcycle-mysql
        restart: always
        command: --innodb-use-native-aio=0 --default-authentication-plugin=mysql_native_password
        tty: true
        ports:
          - 3306:3306
        volumes:
          - ./mysql/initdb:/docker-entrypoint-initdb.d
          - ./mysql/data:/var/lib/mysql
        environment:
          - MYSQL_DATABASE=nodedb
          - MYSQL_USER=nodeuser
          - MYSQL_PASSWORD=nodepwd
          - MYSQL_ROOT_PASSWORD=root
        networks:
          - fullcycle-net
    
    networks:
      fullcycle-net:
        driver: bridge
