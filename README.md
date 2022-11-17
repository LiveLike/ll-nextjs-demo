This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Setup:

##### 1. Install dependencies:

```sh
npm install
```

##### 2. Install [nvm](https://github.com/nvm-sh/nvm#about)

Nvm is needed to locally link @livelike/engagement-api and install its dependencies.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Add below lines in your .bashrc or .zshrc file

```sh

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Check nvm available in CLI and install node `v18.12.1`

```sh
nvm install v18.12.1
```

##### 3. Clone websdk repo branch with engagement-api changes and link engagement-api

Inside cloned repo with proper checked out branch

```sh
cd release/engagement-api
```

This globally links @livelike/engagement-api package

```sh
npm link
```

##### 4. Add @livelike/engagement-api dependencies

```json
dependencies: {
    "@livelike/engagement-api": "0.0.0",
}
```

##### 5. Locally link @livelike/engagement-api

```sh
npm run link-api
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/chat/6c5577e7-95cf-40ff-9a29-a6f57d0da322](http://localhost:3000/6c5577e7-95cf-40ff-9a29-a6f57d0da322) with your browser to see the chat message.
**You can replace url chatroom Id with any other chat room id**

You can start editing the page by modifying `pages/chatroom/[roomId].tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
