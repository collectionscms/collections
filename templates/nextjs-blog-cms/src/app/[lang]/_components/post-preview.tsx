import { type Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import { default as CoverImage } from "./cover-image";
import DateFormatter from "./date-formatter";
import { Locale } from "@/i18n-config";

type Props = {
  title: string;
  coverUrl: string | null;
  publishedAt: string;
  subtitle: string;
  author: Author;
  slug: string;
  lang: Locale;
};

export function PostPreview({
  title,
  coverUrl,
  publishedAt,
  subtitle,
  author,
  slug,
  lang,
}: Props) {
  return (
    <div>
      {coverUrl && (
        <div className="mb-5">
          <CoverImage slug={slug} title={title} src={coverUrl} lang={lang} />
        </div>
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`${lang}/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={publishedAt} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{subtitle}</p>
      <Avatar name={author.name} picture={author.avatarUrl} />
    </div>
  );
}
