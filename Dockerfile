FROM node:20.10.0-alpine AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM deps AS builder

WORKDIR /app
ARG REACT_APP_API_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG REACT_APP_API_WS
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL
ENV REACT_APP_API_WS=$REACT_APP_API_WS

COPY . .
RUN yarn build

FROM node:20.10.0-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

EXPOSE 3000

CMD ["yarn", "start"]
