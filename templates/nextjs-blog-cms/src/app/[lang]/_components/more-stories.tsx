import { Locale } from "@/i18n-config";
import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

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
        {posts.map((post) =>
          post.contents[lang] ? (
            <PostPreview
              key={post.contents[lang].slug}
              title={post.contents[lang].title}
              coverUrl={post.contents[lang].coverUrl}
              publishedAt={post.contents[lang].publishedAt}
              author={post.contents[lang].author}
              slug={post.contents[lang].slug}
              subtitle={post.contents[lang].subtitle}
              lang={lang}
            />
          ) : (
            <></>
          )
        )}
      </div>
    </section>
  );
}
