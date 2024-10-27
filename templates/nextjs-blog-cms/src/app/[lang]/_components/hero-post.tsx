import { Locale } from "@/i18n-config";
import { Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverUrl: string | null;
  publishedAt: string;
  subtitle: string;
  author: Author;
  slug: string;
  lang: Locale;
};

export function HeroPost({
  title,
  coverUrl,
  publishedAt,
  subtitle,
  author,
  slug,
  lang,
}: Props) {
  return (
    <section>
      {coverUrl && (
        <div className="mb-8 md:mb-16">
          <CoverImage title={title} src={coverUrl} slug={slug} lang={lang} />
        </div>
      )}
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-5xl leading-tight">
            <Link href={`${lang}/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <DateFormatter dateString={publishedAt} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{subtitle}</p>
          <Avatar name={author.name} picture={author.avatarUrl} />
        </div>
      </div>
    </section>
  );
}
