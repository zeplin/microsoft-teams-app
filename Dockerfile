FROM node:16.13.0
RUN apt-get update && apt-get install tini
RUN npm install pm2 -g

ENV APP_HOME="/usr/src/app"

WORKDIR ${APP_HOME}

COPY node_modules ${APP_HOME}/node_modules
COPY package.json ${APP_HOME}/package.json
COPY pm2.json ${APP_HOME}/pm2.json
COPY dist ${APP_HOME}/dist

ENTRYPOINT ["tini", "--"]

CMD ["pm2-runtime", "pm2.json"]
