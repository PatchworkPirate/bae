FROM node:22-alpine

COPY src src
COPY package.json package.json
COPY tailwind.config.ts tailwind.config.ts
COPY tsconfig.json tsconfig.json
COPY vite.config.ts vite.config.ts
COPY svelte.config.js svelte.config.js
COPY .env .env
COPY postcss.config.js postcss.config.js

RUN corepack enable

RUN pnpm i

RUN npm run build --production

EXPOSE 80
EXPOSE 443

CMD [ "node", "--env-file=.env", "build"]