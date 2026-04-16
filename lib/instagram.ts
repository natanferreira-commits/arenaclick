import type { InstagramProfile } from "@/types";

export async function scrapeInstagram(username: string): Promise<InstagramProfile> {
  const cleanUsername = username.replace("@", "").trim();

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": process.env.RAPIDAPI_INSTAGRAM_HOST!,
    },
  };

  const res = await fetch(
    `https://${process.env.RAPIDAPI_INSTAGRAM_HOST}/v1/info?username_or_id_or_url=${cleanUsername}`,
    options
  );

  if (!res.ok) {
    throw new Error(`Instagram API error: ${res.status}`);
  }

  const json = await res.json();
  const data = json?.data;

  if (!data) {
    throw new Error("Perfil não encontrado ou privado");
  }

  const followers = data.follower_count ?? 0;
  const mediaCount = data.media_count ?? 0;

  // Buscar posts recentes para calcular engajamento
  const postsRes = await fetch(
    `https://${process.env.RAPIDAPI_INSTAGRAM_HOST}/v1/posts?username_or_id_or_url=${cleanUsername}&limit=12`,
    options
  );

  let topPosts: InstagramProfile["topPosts"] = [];
  let avgLikes = 0;
  let avgComments = 0;

  if (postsRes.ok) {
    const postsJson = await postsRes.json();
    const posts = postsJson?.data?.items ?? [];

    if (posts.length > 0) {
      const totalLikes = posts.reduce((sum: number, p: any) => sum + (p.like_count ?? 0), 0);
      const totalComments = posts.reduce(
        (sum: number, p: any) => sum + (p.comment_count ?? 0),
        0
      );
      avgLikes = Math.round(totalLikes / posts.length);
      avgComments = Math.round(totalComments / posts.length);

      topPosts = posts.slice(0, 6).map((p: any) => ({
        url: `https://www.instagram.com/p/${p.code}/`,
        likes: p.like_count ?? 0,
        comments: p.comment_count ?? 0,
        thumbnail: p.thumbnail_url ?? p.image_versions?.items?.[0]?.url ?? "",
      }));
    }
  }

  const engagementRate =
    followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;

  return {
    username: cleanUsername,
    fullName: data.full_name ?? cleanUsername,
    bio: data.biography ?? "",
    followers,
    following: data.following_count ?? 0,
    posts: mediaCount,
    profilePicUrl: data.profile_pic_url ?? "",
    engagementRate: Math.round(engagementRate * 100) / 100,
    avgLikes,
    avgComments,
    isVerified: data.is_verified ?? false,
    topPosts,
  };
}
