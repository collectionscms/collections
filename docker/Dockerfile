FROM node:20.14.0

WORKDIR .

ARG TIPTAP_PRO_TOKEN
ENV TIPTAP_PRO_TOKEN=${TIPTAP_PRO_TOKEN}

COPY package.json yarn.lock ./

COPY .npmrc .npmrc

RUN yarn install

RUN rm -f .npmrc

COPY . .

COPY env.prd .env

RUN npx prisma generate

RUN yarn build

ENV PORT=4000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]