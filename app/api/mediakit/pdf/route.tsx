import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { MediaKitData } from "@/types";

async function toBase64(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${ct};base64,${b64}`;
  } catch {
    return null;
  }
}

const BG   = "#0d0d0d";
const NEON = "#C8FF00";
const CARD = "#161616";
const WHITE = "#ffffff";
const GRAY  = "#555555";
const DIM   = "#2a2a2a";

const s = StyleSheet.create({
  page: { backgroundColor: BG, fontFamily: "Helvetica", position: "relative" },
  pageNum: { position: "absolute", bottom: 20, right: 36, fontSize: 9, color: "#444" },

  // ── SLIDE 1 — COVER ──────────────────────────────────────────────────────────
  coverPage: { backgroundColor: NEON, flex: 1, position: "relative" },
  coverMidiaKit: {
    position: "absolute",
    left: 80,
    top: 200,
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    color: "#0d0d0d",
  },
  coverName: {
    position: "absolute",
    left: 80,
    bottom: 80,
    fontSize: 32,
    color: "#0d0d0d",
  },
  coverHandle: {
    position: "absolute",
    left: 80,
    bottom: 52,
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
  },

  // ── SLIDE 2 — IDENTIDADE ─────────────────────────────────────────────────────
  sobre: { flex: 1, flexDirection: "row" },
  sobreLeft: { width: 230, backgroundColor: CARD, padding: 26, alignItems: "center" },
  sobreAvatar: { width: 178, height: 178, borderRadius: 12, marginBottom: 18 },
  sobreInfoRow: { width: "100%", borderTop: `1px solid ${DIM}`, paddingVertical: 12 },
  sobreInfoLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 3 },
  sobreInfoVal: { fontSize: 11, color: WHITE },
  sobreInfoValNeon: { fontSize: 11, color: NEON },
  sobreRight: { flex: 1, padding: 48, justifyContent: "center" },
  sobreSection: { fontSize: 8, color: NEON, letterSpacing: 3, marginBottom: 10 },
  sobreName: { fontSize: 38, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 10 },
  sobreBadge: {
    alignSelf: "flex-start", borderRadius: 20,
    border: `1px solid rgba(200,255,0,0.3)`,
    paddingHorizontal: 12, paddingVertical: 5,
    fontSize: 11, color: NEON, marginBottom: 18,
  },
  sobreBio: { fontSize: 13, color: "#aaaaaa", lineHeight: 1.7, marginBottom: 30 },
  sobreMetrics: { flexDirection: "row", gap: 28 },
  sobreMetricVal: { fontSize: 28, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 3 },
  sobreMetricValNeon: { fontSize: 28, fontFamily: "Helvetica-Bold", color: NEON, marginBottom: 3 },
  sobreMetricLabel: { fontSize: 8, color: GRAY, letterSpacing: 1 },

  // ── SLIDE 3 — NÚMEROS ────────────────────────────────────────────────────────
  numeros: { flex: 1, padding: 44 },
  numerosHeader: { marginBottom: 22 },
  numerosSection: { fontSize: 8, color: NEON, letterSpacing: 3, marginBottom: 8 },
  numerosTitle: { fontSize: 30, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 10 },
  numerosCopy: { fontSize: 12, color: "#888", lineHeight: 1.65, maxWidth: 560 },
  numerosCards: { flexDirection: "row", gap: 10, marginBottom: 10, marginTop: 20 },
  numerosCard: {
    flex: 1, backgroundColor: CARD, borderRadius: 10, padding: 20,
    border: `1px solid ${DIM}`,
  },
  numerosCardLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 12 },
  numerosCardNum: { fontSize: 36, fontFamily: "Helvetica-Bold", color: NEON, lineHeight: 1, marginBottom: 5 },
  numerosCardNumWhite: { fontSize: 36, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1, marginBottom: 5 },
  numerosCardSub: { fontSize: 9, color: GRAY },
  numerosBar: {
    backgroundColor: CARD, borderRadius: 8, border: `1px solid ${DIM}`,
    paddingHorizontal: 22, paddingVertical: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  numerosBarTag: { fontSize: 8, color: NEON, letterSpacing: 2, marginBottom: 4 },
  numerosBarName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 2 },
  numerosBarSub: { fontSize: 10, color: GRAY },
  numerosBarEngLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 3 },
  numerosBarEngVal: { fontSize: 26, fontFamily: "Helvetica-Bold", color: NEON },

  // ── SLIDE 4 — POSTS ──────────────────────────────────────────────────────────
  postsPage: { flex: 1, flexDirection: "row" },

  // sidebar esquerda
  postsSidebar: {
    width: 196,
    backgroundColor: CARD,
    padding: 20,
    justifyContent: "space-between",
  },
  postsSidebarTop: {},
  postsSidebarAvatar: { width: 52, height: 52, borderRadius: 26, marginBottom: 10 },
  postsSidebarHandle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 2 },
  postsSidebarName: { fontSize: 10, color: GRAY, marginBottom: 8 },
  postsSidebarBio: { fontSize: 9, color: "#888", lineHeight: 1.55, marginBottom: 8 },
  postsSidebarLink: { fontSize: 9, color: NEON },
  postsSidebarDivider: { height: 1, backgroundColor: DIM, marginVertical: 14 },
  postsSidebarMetricLabel: { fontSize: 7, color: GRAY, letterSpacing: 2, marginBottom: 5 },
  postsSidebarMetricVal: { fontSize: 26, fontFamily: "Helvetica-Bold", color: WHITE },
  postsSidebarMetricValNeon: { fontSize: 26, fontFamily: "Helvetica-Bold", color: NEON },

  // área direita
  postsRight: { flex: 1, flexDirection: "column" },

  // top row: 3 metric cards
  postsMetricRow: {
    flexDirection: "row",
    height: 88,
    borderBottom: `1px solid ${DIM}`,
  },
  postsMetricCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRight: `1px solid ${DIM}`,
    padding: 18,
    justifyContent: "flex-end",
  },
  postsMetricLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 8 },
  postsMetricNum: { fontSize: 30, fontFamily: "Helvetica-Bold", color: NEON, lineHeight: 1 },
  postsMetricNumWhite: { fontSize: 30, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1 },

  // grid de posts
  postsGrid: { flexDirection: "row", height: 420 },
  postCard: { flex: 1, borderRight: `1px solid ${DIM}`, position: "relative", overflow: "hidden" },
  postThumb: { width: "100%", height: 420, objectFit: "cover" },
  postOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.70)",
    padding: 14, flexDirection: "row", gap: 18,
  },
  postStatLabel: { fontSize: 7, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 3 },
  postStatVal: { fontSize: 16, fontFamily: "Helvetica-Bold", color: WHITE },
  postStatValNeon: { fontSize: 16, fontFamily: "Helvetica-Bold", color: NEON },

  // ── SLIDE 5 — CTA ────────────────────────────────────────────────────────────
  ctaPage: { flex: 1, flexDirection: "row" },
  ctaLeft: { flex: 55, padding: 52, justifyContent: "center" },
  ctaSection: { fontSize: 8, color: NEON, letterSpacing: 3, marginBottom: 16 },
  ctaTitle: { fontSize: 40, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.15, marginBottom: 12 },
  ctaTitleAccent: { color: NEON },
  ctaDesc: { fontSize: 13, color: GRAY, lineHeight: 1.65, marginBottom: 28 },
  ctaCard: {
    backgroundColor: CARD, borderRadius: 10, border: `1px solid ${DIM}`,
    paddingHorizontal: 18, paddingVertical: 13,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8,
  },
  ctaCardLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 4 },
  ctaCardVal: { fontSize: 13, fontFamily: "Helvetica-Bold", color: WHITE },
  ctaCardRight: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NEON },
  ctaRight: {
    flex: 45, borderLeft: `1px solid ${DIM}`,
    padding: 48, justifyContent: "center", alignItems: "center",
  },
  ctaAvatar: { width: 110, height: 110, borderRadius: 55, border: `3px solid ${NEON}`, marginBottom: 16 },
  ctaReachLabel: { fontSize: 8, color: GRAY, letterSpacing: 2, marginBottom: 5 },
  ctaReachNum: { fontSize: 58, fontFamily: "Helvetica-Bold", color: NEON, lineHeight: 1, marginBottom: 4 },
  ctaReachSub: { fontSize: 11, color: GRAY, marginBottom: 16 },
  ctaName: { fontSize: 17, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 5 },
  ctaCity: { fontSize: 10, color: GRAY, marginBottom: 10 },
  ctaBadge: {
    borderRadius: 20, border: `1px solid rgba(200,255,0,0.3)`,
    paddingHorizontal: 12, paddingVertical: 5, fontSize: 10, color: NEON,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data: MediaKitData = await req.json();
    const ig = data.instagram;

    const avatarSrc = ig?.profilePicUrl ? await toBase64(ig.profilePicUrl) : null;

    // Fetch post thumbnails as base64
    const postImages: (string | null)[] = [];
    if (ig?.topPosts) {
      for (const post of ig.topPosts.slice(0, 3)) {
        postImages.push(await toBase64(post.thumbnail));
      }
    }

    const contact = data.contactEmail || data.email;
    const hasPosts = ig && ig.topPosts.length > 0;
    const totalSlides = hasPosts ? 5 : 4;

    const pdfBuffer = await renderToBuffer(
      <Document title={`Mídia Kit — ${data.name}`} author="Arena Click">

        {/* ── SLIDE 1 — COVER ─────────────────────────────────────────── */}
        <Page size="A4" orientation="landscape" style={[s.page, s.coverPage]}>
          {/* arcos concêntricos no canto inferior direito */}
          <View style={{
            position: "absolute", width: 340, height: 340, borderRadius: 170,
            backgroundColor: "#0d0d0d", bottom: -120, right: -120,
          }} />
          <View style={{
            position: "absolute", width: 210, height: 210, borderRadius: 105,
            backgroundColor: NEON, bottom: -70, right: -70,
          }} />
          <View style={{
            position: "absolute", width: 100, height: 100, borderRadius: 50,
            backgroundColor: "#0d0d0d", bottom: -20, right: -20,
          }} />

          <Text style={s.coverMidiaKit}>Mídia kit</Text>
          <Text style={s.coverName}>{data.name}</Text>
          {ig && <Text style={s.coverHandle}>@{ig.username}</Text>}

          <Text style={[s.pageNum, { color: "rgba(0,0,0,0.25)" }]}>
            01 / {totalSlides}
          </Text>
        </Page>

        {/* ── SLIDE 2 — IDENTIDADE ────────────────────────────────────── */}
        <Page size="A4" orientation="landscape" style={s.page}>
          <View style={s.sobre}>
            <View style={s.sobreLeft}>
              {avatarSrc && <Image src={avatarSrc} style={s.sobreAvatar} />}
              {ig && (
                <View style={s.sobreInfoRow}>
                  <Text style={s.sobreInfoLabel}>INSTAGRAM</Text>
                  <Text style={s.sobreInfoValNeon}>@{ig.username}</Text>
                </View>
              )}
              {data.city ? (
                <View style={s.sobreInfoRow}>
                  <Text style={s.sobreInfoLabel}>LOCALIZAÇÃO</Text>
                  <Text style={s.sobreInfoVal}>{data.city}</Text>
                </View>
              ) : null}
              <View style={s.sobreInfoRow}>
                <Text style={s.sobreInfoLabel}>CONTATO</Text>
                <Text style={s.sobreInfoVal}>{contact}</Text>
              </View>
            </View>

            <View style={s.sobreRight}>
              <Text style={s.sobreSection}>IDENTIDADE</Text>
              <Text style={s.sobreName}>{data.name}</Text>
              {data.niche ? <Text style={s.sobreBadge}>{data.niche}</Text> : null}
              <Text style={s.sobreBio}>{data.aiDescription}</Text>
              {ig && (
                <View style={s.sobreMetrics}>
                  <View>
                    <Text style={s.sobreMetricVal}>{formatNumber(ig.followers)}</Text>
                    <Text style={s.sobreMetricLabel}>SEGUIDORES</Text>
                  </View>
                  <View>
                    <Text style={s.sobreMetricVal}>{formatNumber(ig.posts)}</Text>
                    <Text style={s.sobreMetricLabel}>POSTS TOTAIS</Text>
                  </View>
                  {data.avgStoryViews > 0 && (
                    <View>
                      <Text style={s.sobreMetricValNeon}>{formatNumber(data.avgStoryViews)}</Text>
                      <Text style={s.sobreMetricLabel}>ALCANCE/STORY</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
          <Text style={s.pageNum}>02 / {totalSlides}</Text>
        </Page>

        {/* ── SLIDE 3 — NÚMEROS ───────────────────────────────────────── */}
        {ig && (
          <Page size="A4" orientation="landscape" style={s.page}>
            <View style={s.numeros}>
              <View style={s.numerosHeader}>
                <Text style={s.numerosSection}>VISÃO GERAL</Text>
                <Text style={s.numerosTitle}>Números que importam</Text>
                <Text style={s.numerosCopy}>
                  {`Mais de ${formatNumber(ig.followers)} pessoas acompanham ${data.name} no Instagram. Com uma comunidade fiel e engajada${data.niche ? ` no nicho de ${data.niche}` : ""}, cada publicação gera ${formatNumber(ig.avgLikes)} interações em média. O alcance aqui é real e com impacto.`}
                </Text>
              </View>

              <View style={s.numerosCards}>
                <View style={s.numerosCard}>
                  <Text style={s.numerosCardLabel}>SEGUIDORES</Text>
                  <Text style={s.numerosCardNum}>{formatNumber(ig.followers)}</Text>
                  <Text style={s.numerosCardSub}>Instagram</Text>
                </View>
                <View style={s.numerosCard}>
                  <Text style={s.numerosCardLabel}>ENGAJAMENTO</Text>
                  <Text style={s.numerosCardNumWhite}>{formatPercent(ig.engagementRate)}</Text>
                  <Text style={s.numerosCardSub}>Taxa média</Text>
                </View>
                <View style={s.numerosCard}>
                  <Text style={s.numerosCardLabel}>LIKES MÉDIOS</Text>
                  <Text style={s.numerosCardNum}>{formatNumber(ig.avgLikes)}</Text>
                  <Text style={s.numerosCardSub}>Por post</Text>
                </View>
                {data.avgReelsViews > 0 && (
                  <View style={s.numerosCard}>
                    <Text style={s.numerosCardLabel}>VIEWS/REEL</Text>
                    <Text style={s.numerosCardNum}>{formatNumber(data.avgReelsViews)}</Text>
                    <Text style={s.numerosCardSub}>Por publicação</Text>
                  </View>
                )}
                {data.avgStoryViews > 0 && (
                  <View style={s.numerosCard}>
                    <Text style={s.numerosCardLabel}>ALCANCE/STORY</Text>
                    <Text style={s.numerosCardNum}>{formatNumber(data.avgStoryViews)}</Text>
                    <Text style={s.numerosCardSub}>Instagram Stories</Text>
                  </View>
                )}
              </View>

              <View style={s.numerosBar}>
                <View>
                  <Text style={s.numerosBarTag}>INSTAGRAM</Text>
                  <Text style={s.numerosBarName}>
                    {formatNumber(ig.followers)} seguidores · {formatNumber(ig.posts)} posts
                  </Text>
                  <Text style={s.numerosBarSub}>@{ig.username}{ig.isVerified ? " ✓" : ""}</Text>
                </View>
                <View>
                  <Text style={s.numerosBarEngLabel}>ENGAJAMENTO MÉDIO</Text>
                  <Text style={s.numerosBarEngVal}>{formatPercent(ig.engagementRate)}</Text>
                </View>
              </View>
            </View>
            <Text style={s.pageNum}>03 / {totalSlides}</Text>
          </Page>
        )}

        {/* ── SLIDE 4 — POSTS RECENTES ────────────────────────────────── */}
        {hasPosts && (() => {
          const ratioInfluencia = ig!.following > 0
            ? Math.round(ig!.followers / ig!.following)
            : Math.round(ig!.avgLikes > 0 ? ig!.followers / ig!.avgLikes : 0);
          return (
            <Page size="A4" orientation="landscape" style={s.page}>
              <View style={s.postsPage}>

                {/* sidebar esquerda */}
                <View style={s.postsSidebar}>
                  <View style={s.postsSidebarTop}>
                    {avatarSrc && <Image src={avatarSrc} style={s.postsSidebarAvatar} />}
                    <Text style={s.postsSidebarHandle}>
                      @{ig!.username}{ig!.isVerified ? " ✓" : ""}
                    </Text>
                    <Text style={s.postsSidebarName}>{data.name}</Text>
                    <Text style={s.postsSidebarBio}>
                      {ig!.bio.replace(/\n/g, " ").slice(0, 120)}
                    </Text>
                    {contact && <Text style={s.postsSidebarLink}>{contact}</Text>}
                  </View>

                  <View>
                    <View style={s.postsSidebarDivider} />
                    <Text style={s.postsSidebarMetricLabel}>RATIO INFLUENCIA</Text>
                    <Text style={s.postsSidebarMetricVal}>{ratioInfluencia}x</Text>

                    {data.avgReelsViews > 0 && (
                      <>
                        <View style={s.postsSidebarDivider} />
                        <Text style={s.postsSidebarMetricLabel}>VIEWS MEDIOS</Text>
                        <Text style={s.postsSidebarMetricValNeon}>
                          {formatNumber(data.avgReelsViews)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* área direita */}
                <View style={s.postsRight}>

                  {/* top: 3 métricas */}
                  <View style={s.postsMetricRow}>
                    <View style={s.postsMetricCard}>
                      <Text style={s.postsMetricLabel}>SEGUIDORES</Text>
                      <Text style={s.postsMetricNum}>{formatNumber(ig!.followers)}</Text>
                    </View>
                    <View style={s.postsMetricCard}>
                      <Text style={s.postsMetricLabel}>ENGAJAMENTO</Text>
                      <Text style={s.postsMetricNumWhite}>{formatPercent(ig!.engagementRate)}</Text>
                    </View>
                    <View style={[s.postsMetricCard, { borderRight: "none" }]}>
                      <Text style={s.postsMetricLabel}>LIKES MEDIOS</Text>
                      <Text style={s.postsMetricNum}>{formatNumber(ig!.avgLikes)}</Text>
                    </View>
                  </View>

                  {/* grid de posts */}
                  <View style={s.postsGrid}>
                    {ig!.topPosts.slice(0, 3).map((post, i) => (
                      <View key={i} style={[s.postCard, i === 2 ? { borderRight: "none" } : {}]}>
                        {postImages[i] ? (
                          <Image src={postImages[i] as string} style={s.postThumb} />
                        ) : (
                          <View style={[s.postThumb, { backgroundColor: DIM }]} />
                        )}
                        <View style={s.postOverlay}>
                          <View>
                            <Text style={s.postStatLabel}>LIKES</Text>
                            <Text style={s.postStatValNeon}>{formatNumber(post.likes)}</Text>
                          </View>
                          <View>
                            <Text style={s.postStatLabel}>COMENTARIOS</Text>
                            <Text style={s.postStatVal}>{formatNumber(post.comments)}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                </View>
              </View>
              <Text style={s.pageNum}>04 / {totalSlides}</Text>
            </Page>
          );
        })()}

        {/* ── SLIDE 5 — CTA ───────────────────────────────────────────── */}
        <Page size="A4" orientation="landscape" style={s.page}>
          <View style={s.ctaPage}>
            <View style={s.ctaLeft}>
              <Text style={s.ctaSection}>VAMOS TRABALHAR JUNTOS?</Text>
              <Text style={s.ctaTitle}>
                Pronto para{"\n"}
                <Text style={s.ctaTitleAccent}>fechar</Text> uma parceria?
              </Text>
              <Text style={s.ctaDesc}>
                {data.name} está aberto a novas colaborações e parcerias comerciais.
              </Text>
              {ig && (
                <View style={s.ctaCard}>
                  <View>
                    <Text style={s.ctaCardLabel}>INSTAGRAM</Text>
                    <Text style={s.ctaCardVal}>@{ig.username}</Text>
                  </View>
                  <Text style={s.ctaCardRight}>{formatNumber(ig.followers)} seguidores</Text>
                </View>
              )}
              <View style={s.ctaCard}>
                <View>
                  <Text style={s.ctaCardLabel}>CONTATO COMERCIAL</Text>
                  <Text style={s.ctaCardVal}>{contact}</Text>
                </View>
              </View>
              {data.whatsapp ? (
                <View style={s.ctaCard}>
                  <View>
                    <Text style={s.ctaCardLabel}>WHATSAPP</Text>
                    <Text style={s.ctaCardVal}>{data.whatsapp}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={s.ctaRight}>
              {avatarSrc && <Image src={avatarSrc} style={s.ctaAvatar} />}
              <Text style={s.ctaReachLabel}>ALCANCE TOTAL</Text>
              <Text style={s.ctaReachNum}>{ig ? formatNumber(ig.followers) : "0"}</Text>
              <Text style={s.ctaReachSub}>Instagram</Text>
              <Text style={s.ctaName}>{data.name}</Text>
              {data.city ? <Text style={s.ctaCity}>{data.city}</Text> : null}
              {data.niche ? <Text style={s.ctaBadge}>{data.niche}</Text> : null}
            </View>
          </View>
          <Text style={s.pageNum}>
            {hasPosts ? `05 / ${totalSlides}` : `04 / ${totalSlides}`}
          </Text>
        </Page>
      </Document>
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mediakit-${data.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
