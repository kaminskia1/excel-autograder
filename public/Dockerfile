# node image
FROM node:slim


ENV GENERATE_SOURCEMAP=false

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --fund=false; npm install @angular/cli@latest -g

# copy files
COPY . /app

EXPOSE 4200 49153

# start app
CMD ng serve --port 4200 --host 0.0.0.0 --poll 250
