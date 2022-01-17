FROM docker.io/node:16-alpine

WORKDIR /usr/src/app

COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm i

COPY . .

CMD [ "npm", "start" ]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
    CMD netstat -an | grep 3000 > /dev/null; if [ 0 != $? ]; then exit 1; fi;