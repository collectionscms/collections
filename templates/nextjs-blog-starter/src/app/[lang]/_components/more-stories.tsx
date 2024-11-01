import { Locale } from '@/i18n-config';
import { Post } from '@/interfaces/post';
import { PostPreview } from './post-preview';

type Props = {
  lang: Locale;
  posts: Post[];
};

export function MoreStories({ lang, posts }: Props) {
  return (
    <section>
      <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
        More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => {
          const languageContent = post.contents.find((content) => content.language === lang);

          return languageContent ? (
            <PostPreview
              key={languageContent.slug}
              title={languageContent.title}
              coverUrl={languageContent.coverUrl}
              publishedAt={languageContent.publishedAt}
              author={languageContent.author}
              slug={languageContent.slug}
              subtitle={languageContent.subtitle}
              lang={lang}
            />
          ) : (
            <></>
          );
        })}
      </div>
    </section>
  );
}
