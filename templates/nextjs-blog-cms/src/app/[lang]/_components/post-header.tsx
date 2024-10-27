import { Locale } from "@/i18n-config";
import { Author } from "@/interfaces/author";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "./post-title";

type Props = {
  title: string;
  coverUrl: string | null;
  date: string;
  author: Author;
  lang: Locale;
};

export function PostHeader({ title, coverUrl, date, author, lang }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.avatarUrl} />
      </div>
      {coverUrl && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={title} src={coverUrl} lang={lang} />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.avatarUrl} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  );
}
