# Collections CMS

Collections is a headless CMS designed for AI searches such as AI Overviews, ChatGPT, and Perplexity.

It enables you to create optimized content using SEO(Google E-E-A-T, structured data), multilingual support, and AI-powered editing.

<hr/>
<h4>
<a target="_blank" href="https://app.collectionsdemo.live/admin/" rel="dofollow"><strong>Try Live Demo</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://collections-nextjs-blog.vercel.app/" rel="dofollow"><strong>View Blog Demo</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://collections.dev/docs/home/" rel="dofollow"><strong>Documentation</strong></a>
</h4>
<hr/>

## Features

- 🔎 Google E-E-A-T
- 🪄 Editing & SEO by AI
- 🌐 Multilingual support
- 🖊 Notion-like editor
- 🏢 Multitenancy

## 📚 Usage & Documentation

Extended documentation is available on our website.

- [English](https://collections.dev)
- [日本語](https://collections.dev/ja)

## 🚀 Installation

How to start using Collections on localhost.

```sh
// clone
git clone git@github.com:collectionscms/collections.git
cd collections

// env
cp .env.sample .env
vi .env - make it your environment

// install direnv
brew install direnv
vi ~/.zshrc - add `eval "$(direnv hook zsh)"`
source ~/.zshrc
direnv allow .

// init
yarn install
yarn db:refresh
yarn dev
```

Add the following lines to the `/etc/hosts`

```sh
127.0.0.1   app.test.com
127.0.0.1   en.test.com
127.0.0.1   ja.test.com
```

Open [http://app.test.com:4000/admin](http://app.test.com:4000/admin) to view your running app.
When you're ready for production, run `yarn build` then `yarn start`.

## 💬 Community

To chat with other community members you can join the [Collections Discord](https://discord.gg/a6FYDkV3Vk).

## 💚 Tech Stack

- DB - PostgreSQL
- Backend - Node.js, Express
- Frontend - React, MUI

Enjoy!!!

## 🗒️ License

See the [LICENSE](https://github.com/collectionscms/collections/blob/main/LICENSE) file for licensing information.
