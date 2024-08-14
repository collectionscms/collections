## ⭐ What is Collections

Collections is an open source headless CMS that makes multilingual content delivery easy with AI. We provide the comfortable writing and developer experience for global websites.

<hr/>
<h4>
<a target="_blank" href="https://app.collections.dev/admin/" rel="dofollow"><strong>Try Live Demo</strong></a>
</h4>
<hr/>

### Features

- 🌐 Multilingual content by AI
- 🖊 Notion-like editor
- 🛡 Fine-grained permission
- 🔒 Multi-tenancy project

## 📚 Usage & Documentation

Extended documentation is available on our website.

- [English](https://collections.dev)
- [日本語](https://collections.dev/ja)

## 🚀 Installation

Easiest way to start using Collections on a local host.

```sh
git clone git@github.com:collectionscms/collections.git
cd collections
cp .env.sample .env
vi .env - make it your environment
brew install direnv
vi ~/.zshrc - add `eval "$(direnv hook zsh)"`
source ~/.zshrc
direnv allow .
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

- Self-hosted - know where your data is stored!
- DB - PostgreSQL
- Backend - Node.js, Express
- Admin - React, MUI

Enjoy!!!

## 🗒️ License

See the [LICENSE](https://github.com/collectionscms/collections/blob/main/LICENSE) file for licensing information.
