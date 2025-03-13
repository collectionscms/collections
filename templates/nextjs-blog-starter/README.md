# A multilingual statically generated blog example using Next.js and Collections

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) feature using [Collections](https://collections.dev/) as the data source.

## Demo

[https://collections-nextjs-blog.vercel.app/](https://collections-nextjs-blog.vercel.app/)

## Deploy your own

Using the Deploy button below and connect to the Collections project after adding environment variables.

| Variable               | Description                             | Example                               |
| :--------------------- | :-------------------------------------- | :------------------------------------ |
| COLLECTIONS_API_ORIGIN | Enter your Collections project origin.  | https://my-project.collectionscms.com |
| COLLECTIONS_API_KEY    | Enter your Collections project API key. | a6a9da5a-...                          |

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/collectionscms/collections/tree/main/templates/nextjs-blog-starter&repository-name=collections-nextjs-blog&env=COLLECTIONS_API_ORIGIN,COLLECTIONS_API_KEY&envDescription=Required%20to%20connect%20the%20app%20with%20Collections&envLink=https://github.com/collectionscms/collections/tree/main/templates/nextjs-blog-starter)

## How to use

Follow the steps below to spin up a local dev environment:

1. Clone the repo
2. Run `yarn install`
3. Run `cp .env.example .env` and fill out all ENV variables as shown
4. Run `yarn dev` to start up the dev server

## Notes

`nextjs-blog-starter` uses [Tailwind CSS](https://tailwindcss.com) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3).
