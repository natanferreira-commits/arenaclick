import type { InstagramProfile } from "@/types";

export async function scrapeInstagram(username: string): Promise<InstagramProfile> {
  const cleanUsername = username.replace("@", "").trim();

  const res = await fetch(
    `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${cleanUsername}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Instagram API error: ${res.status}`);
  }

  const json = await res.json();
  const data = json?.data;

  if (!data) {
    throw new Error("Perfil não encontrado ou privado");
  }

  const followers: number = data.edge_followed_by?.count ?? 0;
  const following: number = data.edge_follow?.count ?? 0;
  const totalPosts: number = data.edge_owner_to_timeline_media?.count ?? 0;

  // Posts are embedded in the same response
  const edges: any[] = data.edge_owner_to_timeline_media?.edges ?? [];

  let avgLikes = 0;
  let avgComments = 0;
  let topPosts: InstagramProfile["topPosts"] = [];

  if (edges.length > 0) {
    const totalLikes = edges.reduce(
      (sum: number, e: any) => sum + (e.node?.edge_liked_by?.count ?? 0),
      0
    );
    const totalComments = edges.reduce(
      (sum: number, e: any) => sum + (e.node?.edge_media_to_comment?.count ?? 0),
      0
    );
    avgLikes = Math.round(totalLikes / edges.length);
    avgComments = Math.round(totalComments / edges.length);

    topPosts = edges.slice(0, 6).map((e: any) => ({
      url: `https://www.instagram.com/p/${e.node?.shortcode}/`,
      likes: e.node?.edge_liked_by?.count ?? 0,
      comments: e.node?.edge_media_to_comment?.count ?? 0,
      thumbnail: e.node?.thumbnail_src ?? "",
    }));
  }

  const engagementRate =
    followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;

  return {
    username: data.username ?? cleanUsername,
    fullName: data.full_name ?? cleanUsername,
    bio: data.biography ?? "",
    followers,
    following,
    posts: totalPosts,
    profilePicUrl: data.profile_pic_url_hd ?? data.profile_pic_url ?? "",
    engagementRate: Math.round(engagementRate * 100) / 100,
    avgLikes,
    avgComments,
    isVerified: data.is_verified ?? false,
    topPosts,
  };
}
