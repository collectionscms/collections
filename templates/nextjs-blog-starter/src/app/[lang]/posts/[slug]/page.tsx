import React from 'react';
import { Locale } from '@/i18n-config';
import { getAllPosts, getContentBySlug } from '@/lib/api';
import { CMS_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '../../_components/container';
import Header from '../../_components/header';
import { PostBody } from '../../_components/post-body';
import { PostHeader } from '../../_components/post-header';

type Params = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export const revalidate = 300;

export default async function Post({ params }: Params) {
  const content = await getContentBySlug(params.slug, revalidate);

  if (!content) {
    return notFound();
  }

  return (
    <main>
      <Container>
        <Header lang={params.lang} />
        <article className="mb-32">
          <PostHeader
            title={content.title}
            coverUrl={content.coverUrl}
            date={content.publishedAt}
            author={content.author}
            lang={params.lang}
          />
          <PostBody content={content.bodyHtml} />
        </article>
      </Container>
    </main>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const content = await getContentBySlug(params.slug, revalidate);

  if (!content) {
    return notFound();
  }

  const title = `${content.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: content.coverUrl ? [content.coverUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts(revalidate);
  const contents = posts.flatMap((post) => Object.values(post.contents));

  return contents.map((post) => ({
    slug: post.slug,
  }));
}
