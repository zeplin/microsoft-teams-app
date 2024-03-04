FROM node:16.13.0
RUN apt-get update && apt-get install tini
RUN npm install pm2 -g

ENV APP_HOME="/usr/src/app"

WORKDIR ${APP_HOME}

COPY . ${APP_HOME}/

ENTRYPOINT ["tini", "--"]

CMD ["pm2-runtime", "pm2.json"]
