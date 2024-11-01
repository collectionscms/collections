import { Locale } from '@/i18n-config';
import { getAllPosts } from '@/lib/api';
import Container from './_components/container';
import { HeroPost } from './_components/hero-post';
import { Intro } from './_components/intro';
import { MoreStories } from './_components/more-stories';

export const revalidate = 300;

export default async function Index({ params: { lang } }: { params: { lang: Locale } }) {
  const allPosts = await getAllPosts(revalidate);
  const posts = allPosts.filter(
    (post) => post.contents.filter((content) => content.language === lang).length > 0
  );
  const heroPost = posts[0];
  const heroPostContent = heroPost?.contents.find((content) => content.language === lang);
  const morePosts = posts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        {heroPostContent && (
          <HeroPost
            title={heroPostContent.title}
            coverUrl={heroPostContent.coverUrl}
            publishedAt={heroPostContent.publishedAt}
            author={heroPostContent.author}
            slug={heroPostContent.slug}
            subtitle={heroPostContent.subtitle}
            lang={lang}
          />
        )}
        {morePosts.length > 0 && <MoreStories lang={lang} posts={morePosts} />}
      </Container>
    </main>
  );
}
