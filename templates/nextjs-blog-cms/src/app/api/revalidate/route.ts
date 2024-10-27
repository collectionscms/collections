import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  try {
    revalidatePath("/[lang]", "page");
    revalidatePath("/[lang]/posts/[slug]", "page");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
