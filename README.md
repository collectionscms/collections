# Collections CMS

<p align="center">
  <a href="https://collections.dev/">
    <img src="https://cdn.collections.dev/logo/icon-light-1024.png" width="140px" alt="Collections CMS" />
  </a>
</p>

Collections is a headless CMS with built-in multilingual support. Content created for blogs and announcements can be embedded into websites and WordPress to quickly turn them into multilingual sites.

Contents are translated into over 30 languages, and AI automatically generates multilingual SEO.

## ⭐ Why Collections Focus on multilingual?

In the era of "Ask AI," keywords are becoming less relevant. What matters most are websites that provide clear answers to consumers' questions in their native language.

Collections, a multilingual CMS, streamlines and accelerates the globalization of existing websites with greater speed and simplicity. Moving forward, it will continue to evolve as a CMS that aligns with the
advancements in AI-driven search.

<hr/>
<h4>
<a target="_blank" href="https://app.collectionsdemo.live/admin/" rel="dofollow"><strong>Try Live Demo</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://collections-nextjs-blog.vercel.app/" rel="dofollow"><strong>View Blog Demo</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://collections.dev/docs/home/" rel="dofollow"><strong>Documentation</strong></a>
</h4>
<hr/>

### Features

- 🪄 SEO by AI
- 🌐 Multilingual content
- 🖊 Notion-like editor
- 🕘️ Post versioning

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
