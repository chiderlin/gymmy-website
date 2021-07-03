# syntax=docker/dockerfile:1
# FROM tbaltrushaitis/ubuntu-nodejs

FROM ubuntu:latest
MAINTAINER Chi Lin "chiderlin36@gmail.com"
RUN apt-get update && \
DEBIAN_FRONTEND=noninteractive && \
apt-get install -y vim && \
apt-get install --yes nodejs \
npm && \
apt-get install --no-install-recommends -y

COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3001
CMD ["node", "app.js"]