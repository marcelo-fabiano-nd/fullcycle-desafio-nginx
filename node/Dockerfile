FROM node:17.4
WORKDIR /usr/src/app

# atualiza o sitema operacional para instalação do DOCKERIZE
RUN apt-get update && apt-get install -y wget

# instala o DOCKERIZE
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# expõe a porta 5000
EXPOSE 5000