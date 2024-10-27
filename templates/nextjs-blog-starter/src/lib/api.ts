import { Content } from "@/interfaces/content";
import { Post } from "@/interfaces/post";

const apiOrigin = process.env.COLLECTIONS_API_ORIGIN;
const apiKey = process.env.COLLECTIONS_API_KEY;

export async function getContentBySlug(
  slug: string,
  revalidate: number
): Promise<Content | null> {
  const res = await fetch(`${apiOrigin}/api/v1/contents/${slug}`, {
    next: { revalidate },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const data = await res.json();
  return data?.content || null;
}

export async function getAllPosts(revalidate: number): Promise<Post[]> {
  const res = await fetch(`${apiOrigin}/api/v1/posts`, {
    next: { revalidate },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const data = await res.json();
  return data?.posts || [];
}
