# Prerequisites

Docker CE - https://docs.docker.com/engine/installation/ 

# Build & Run

```sh
docker-compose up
```

or, to run with rebuilding images

```sh
docker-compose up --build
```

Wait for couple minutes and check `export` directory in the root of the
project - it should contain exported data.

# Description

The solution consists of three docker containers:
- `mysql` container to run mysql server
- `updatedb` container which runs a cron job to put some data into db every
  minute (emulation of case where db is populated by some external source)
- `main` container which runs a cron job to export data from db into csv file
  and delete data from db aferwards
