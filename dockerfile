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

FROM ubuntu:14.04

# Install Node.js
RUN apt-get update && apt-get install sudo -y
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential


COPY . /app
WORKDIR /app
# Install app dependencies
RUN npm install
EXPOSE  3001

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD ["node", "app.js"]