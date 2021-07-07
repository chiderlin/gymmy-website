# FROM tbaltrushaitis/ubuntu-nodejs

# FROM ubuntu:latest
# MAINTAINER Chi Lin "chiderlin36@gmail.com"
# RUN apt-get update && apt-get install sudo -y && \
# apt-get install --yes curl && \
# apt-get install -y vim && \
# # apt-get install --yes nodejs && \
# apt-get install --no-install-recommends -y
# # RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
# COPY . /app
# WORKDIR /app
# RUN npm install
# EXPOSE 3001
# CMD ["node", "app.js"]


FROM node:12.18.1
MAINTAINER Chi Lin "chiderlin36@gmail.com"

COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3001
CMD ["node", "app.js"]