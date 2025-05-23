# Nebula BYOD
Discord Bot + Caddy Ask Server

## Setup
```sh
$ git clone https://github.com/nebualservices/nebula-byod.git
$ cd nebula-byod
$ pnpm i
$ pnpm build
# See below for .env configuration
$ pnpm bot # BYOD bot
$ pnpm ask # Ask server
```

## Configuration
```
TOKEN=
GUILD_ID=
ASK_PORT=
```
```sh
echo '{"users":{}, "domains":[]}' > db.json
```