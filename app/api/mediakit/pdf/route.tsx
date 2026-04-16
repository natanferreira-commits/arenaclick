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

// ─── fetch image → base64 data URI ──────────────────────────────────────────
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

// ─── design tokens ──────────────────────────────────────────────────────────
const BG   = "#0d0d0d";
const NEON = "#C8FF00";
const CARD = "#161616";
const WHITE = "#ffffff";
const GRAY  = "#666666";
const DIM   = "#2a2a2a";

// ─── styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: BG,
    fontFamily: "Helvetica",
    position: "relative",
  },

  pageNum: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: GRAY,
  },

  mkLabel: {
    position: "absolute",
    top: 24,
    left: 40,
    fontSize: 9,
    color: GRAY,
    letterSpacing: 2,
  },

  // ── SLIDE 1 — cover (neon green + concentric circles) ────────────────────
  coverPage: {
    backgroundColor: NEON,
    flex: 1,
    position: "relative",
  },

  // label topo esquerdo
  coverMkLabel: {
    position: "absolute",
    top: 26,
    left: 40,
    fontSize: 10,
    color: "rgba(0,0,0,0.35)",
    letterSpacing: 3,
  },

  // texto bottom-left
  coverBottom: {
    position: "absolute",
    bottom: 44,
    left: 48,
  },
  coverTitle: {
    fontSize: 13,
    color: "rgba(0,0,0,0.45)",
    letterSpacing: 2,
    marginBottom: 6,
  },
  coverName: {
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    color: "#0d0d0d",
    lineHeight: 1.05,
  },
  coverHandle: {
    fontSize: 18,
    color: "rgba(0,0,0,0.45)",
    marginTop: 6,
  },

  // botão preto com asterisco
  coverBtn: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
    // posicionado sobre o centro dos círculos
    top: 218,
    left: 626,
  },
  coverBtnText: {
    fontSize: 28,
    color: NEON,
    fontFamily: "Helvetica-Bold",
  },

  // label topo esquerdo (mantido pra compatibilidade)
  coverContactLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 5 },
  coverContactVal: { fontSize: 14, color: WHITE },

  // ── SLIDE 2 — sobre ───────────────────────────────────────────────────────
  sobre: { flex: 1, flexDirection: "row" },

  sobreLeft: {
    width: 240,
    backgroundColor: CARD,
    padding: 28,
    alignItems: "center",
  },
  sobreAvatar: {
    width: 184,
    height: 184,
    borderRadius: 14,
    marginBottom: 20,
  },
  sobreInfoRow: {
    width: "100%",
    borderTop: `1px solid ${DIM}`,
    paddingVertical: 13,
  },
  sobreInfoLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 3 },
  sobreInfoVal: { fontSize: 12, color: WHITE },
  sobreInfoValNeon: { fontSize: 12, color: NEON },

  sobreRight: { flex: 1, padding: 52, justifyContent: "center" },
  sobreSection: { fontSize: 9, color: NEON, letterSpacing: 3, marginBottom: 10 },
  sobreName: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 12,
  },
  sobreBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    border: `1px solid rgba(200,255,0,0.3)`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 12,
    color: NEON,
    marginBottom: 20,
  },
  sobreBio: { fontSize: 13, color: GRAY, lineHeight: 1.65, marginBottom: 32 },
  sobreMetrics: { flexDirection: "row", gap: 32 },
  sobreMetricVal: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 3,
  },
  sobreMetricValNeon: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: NEON,
    marginBottom: 3,
  },
  sobreMetricLabel: { fontSize: 9, color: GRAY, letterSpacing: 1 },

  // ── SLIDE 3 — números ─────────────────────────────────────────────────────
  numeros: { flex: 1, padding: 48 },
  numerosTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  numerosSection: { fontSize: 9, color: NEON, letterSpacing: 3, marginBottom: 6 },
  numerosTitle: { fontSize: 34, fontFamily: "Helvetica-Bold", color: WHITE },
  numerosCreator: { fontSize: 12, color: GRAY, paddingTop: 6 },

  numerosCards: { flexDirection: "row", gap: 10, marginBottom: 12 },
  numerosCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 22,
    border: `1px solid ${DIM}`,
  },
  numerosCardLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 14 },
  numerosCardNum: {
    fontSize: 42,
    fontFamily: "Helvetica-Bold",
    color: NEON,
    lineHeight: 1,
    marginBottom: 6,
  },
  numerosCardNumWhite: {
    fontSize: 42,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    lineHeight: 1,
    marginBottom: 6,
  },
  numerosCardSub: { fontSize: 10, color: GRAY },

  numerosBar: {
    backgroundColor: CARD,
    borderRadius: 10,
    border: `1px solid ${DIM}`,
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numerosBarTag: { fontSize: 9, color: NEON, letterSpacing: 2, marginBottom: 4 },
  numerosBarName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 2,
  },
  numerosBarSub: { fontSize: 11, color: GRAY },
  numerosBarEngLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 3 },
  numerosBarEngVal: { fontSize: 28, fontFamily: "Helvetica-Bold", color: NEON },

  // ── SLIDE 4 — CTA ─────────────────────────────────────────────────────────
  ctaPage: { flex: 1, flexDirection: "row" },

  ctaLeft: { flex: 55, padding: 56, justifyContent: "center" },
  ctaSection: { fontSize: 9, color: NEON, letterSpacing: 3, marginBottom: 16 },
  ctaTitle: {
    fontSize: 44,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    lineHeight: 1.15,
    marginBottom: 14,
  },
  ctaTitleAccent: { color: NEON },
  ctaDesc: { fontSize: 13, color: GRAY, lineHeight: 1.65, marginBottom: 30 },
  ctaCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    border: `1px solid ${DIM}`,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ctaCardLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 4 },
  ctaCardVal: { fontSize: 13, fontFamily: "Helvetica-Bold", color: WHITE },
  ctaCardRight: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NEON },

  ctaRight: {
    flex: 45,
    borderLeft: `1px solid ${DIM}`,
    padding: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    border: `3px solid ${NEON}`,
    marginBottom: 18,
  },
  ctaReachLabel: { fontSize: 9, color: GRAY, letterSpacing: 2, marginBottom: 5 },
  ctaReachNum: {
    fontSize: 64,
    fontFamily: "Helvetica-Bold",
    color: NEON,
    lineHeight: 1,
    marginBottom: 4,
  },
  ctaReachSub: { fontSize: 12, color: GRAY, marginBottom: 18 },
  ctaName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 5,
  },
  ctaCity: { fontSize: 11, color: GRAY, marginBottom: 12 },
  ctaBadge: {
    borderRadius: 20,
    border: `1px solid rgba(200,255,0,0.3)`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 11,
    color: NEON,
  },
});

// ─── route handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: MediaKitData = await req.json();
    const ig = data.instagram;

    // Fetch avatar as base64 so it renders in PDF
    const avatarSrc = ig?.profilePicUrl ? await toBase64(ig.profilePicUrl) : null;

    const contact = data.contactEmail || data.email;
    const totalSlides = 4;

    const pdfBuffer = await renderToBuffer(
      <Document title={`Mídia Kit — ${data.name}`} author="Arena Click">

        {/* ── SLIDE 1 — COVER (neon green + concentric circles) ──────────── */}
        <Page size="A4" orientation="landscape" style={[s.page, s.coverPage]}>

          {/* label topo esquerdo */}
          <Text style={s.coverMkLabel}>MÍDIA KIT</Text>

          {/* ── círculos concêntricos (centro: 658, 250) ── */}
          {[500, 420, 340, 260, 180, 100].map((size, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: size / 2,
                border: "1.5px solid rgba(0,0,0,0.10)",
                top: 250 - size / 2,
                left: 658 - size / 2,
              }}
            />
          ))}

          {/* ── botão preto com asterisco ── */}
          <View style={s.coverBtn}>
            <Text style={s.coverBtnText}>*</Text>
          </View>

          {/* ── texto bottom-left ── */}
          <View style={s.coverBottom}>
            <Text style={s.coverTitle}>MÍDIA KIT</Text>
            <Text style={s.coverName}>{data.name}</Text>
            {ig && <Text style={s.coverHandle}>@{ig.username}</Text>}
          </View>

          <Text style={[s.pageNum, { color: "rgba(0,0,0,0.3)" }]}>
            01 / {totalSlides}
          </Text>
        </Page>

        {/* ── SLIDE 2 — SOBRE ─────────────────────────────────────────────── */}
        <Page size="A4" orientation="landscape" style={s.page}>
          <View style={s.sobre}>
            {/* sidebar esquerda */}
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

            {/* conteúdo direito */}
            <View style={s.sobreRight}>
              <Text style={s.sobreSection}>SOBRE</Text>
              <Text style={s.sobreName}>{data.name}</Text>
              {data.niche ? (
                <Text style={s.sobreBadge}>{data.niche}</Text>
              ) : null}
              <Text style={s.sobreBio}>{data.aiDescription}</Text>

              {ig && (
                <View style={s.sobreMetrics}>
                  <View>
                    <Text style={s.sobreMetricVal}>{formatNumber(ig.followers)}</Text>
                    <Text style={s.sobreMetricLabel}>SEGUIDORES IG</Text>
                  </View>
                  <View>
                    <Text style={s.sobreMetricVal}>{formatNumber(ig.posts)}</Text>
                    <Text style={s.sobreMetricLabel}>POSTS TOTAIS</Text>
                  </View>
                  {data.avgStoryViews > 0 && (
                    <View>
                      <Text style={s.sobreMetricValNeon}>
                        {formatNumber(data.avgStoryViews)}
                      </Text>
                      <Text style={s.sobreMetricLabel}>ALCANCE/STORY</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          <Text style={s.pageNum}>02 / {totalSlides}</Text>
        </Page>

        {/* ── SLIDE 3 — NÚMEROS QUE IMPORTAM ──────────────────────────────── */}
        {ig && (
          <Page size="A4" orientation="landscape" style={s.page}>
            <View style={s.numeros}>
              {/* header */}
              <View style={s.numerosTop}>
                <View>
                  <Text style={s.numerosSection}>VISÃO GERAL</Text>
                  <Text style={s.numerosTitle}>Números que importam</Text>
                </View>
                <Text style={s.numerosCreator}>{data.name}</Text>
              </View>

              {/* cards */}
              <View style={s.numerosCards}>
                <View style={s.numerosCard}>
                  <Text style={s.numerosCardLabel}>TOTAL DE SEGUIDORES</Text>
                  <Text style={s.numerosCardNum}>{formatNumber(ig.followers)}</Text>
                  <Text style={s.numerosCardSub}>Instagram</Text>
                </View>

                {data.avgReelsViews > 0 && (
                  <View style={s.numerosCard}>
                    <Text style={s.numerosCardLabel}>VIEWS MÉDIOS POR REEL</Text>
                    <Text style={s.numerosCardNum}>{formatNumber(data.avgReelsViews)}</Text>
                    <Text style={s.numerosCardSub}>Por publicação</Text>
                  </View>
                )}

                {data.avgStoryViews > 0 && (
                  <View style={s.numerosCard}>
                    <Text style={s.numerosCardLabel}>ALCANCE POR STORY</Text>
                    <Text style={s.numerosCardNumWhite}>
                      {formatNumber(data.avgStoryViews)}
                    </Text>
                    <Text style={s.numerosCardSub}>Instagram Stories</Text>
                  </View>
                )}

                <View style={s.numerosCard}>
                  <Text style={s.numerosCardLabel}>LIKES MÉDIOS</Text>
                  <Text style={s.numerosCardNum}>{formatNumber(ig.avgLikes)}</Text>
                  <Text style={s.numerosCardSub}>Por post</Text>
                </View>
              </View>

              {/* summary bar */}
              <View style={s.numerosBar}>
                <View>
                  <Text style={s.numerosBarTag}>INSTAGRAM</Text>
                  <Text style={s.numerosBarName}>
                    {formatNumber(ig.followers)} seguidores · {formatNumber(ig.posts)} posts
                  </Text>
                  <Text style={s.numerosBarSub}>@{ig.username}</Text>
                </View>
                <View>
                  <Text style={s.numerosBarEngLabel}>ENGAJAMENTO</Text>
                  <Text style={s.numerosBarEngVal}>{formatPercent(ig.engagementRate)}</Text>
                </View>
              </View>
            </View>

            <Text style={s.pageNum}>03 / {totalSlides}</Text>
          </Page>
        )}

        {/* ── SLIDE 4 — CTA ────────────────────────────────────────────────── */}
        <Page size="A4" orientation="landscape" style={s.page}>
          <View style={s.ctaPage}>
            {/* esquerda */}
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

            {/* direita */}
            <View style={s.ctaRight}>
              {avatarSrc && <Image src={avatarSrc} style={s.ctaAvatar} />}
              <Text style={s.ctaReachLabel}>ALCANCE TOTAL</Text>
              <Text style={s.ctaReachNum}>
                {ig ? formatNumber(ig.followers) : "—"}
              </Text>
              <Text style={s.ctaReachSub}>Instagram</Text>
              <Text style={s.ctaName}>{data.name}</Text>
              {data.city ? (
                <Text style={s.ctaCity}>{data.city}</Text>
              ) : null}
              {data.niche ? (
                <Text style={s.ctaBadge}>{data.niche}</Text>
              ) : null}
            </View>
          </View>

          <Text style={s.pageNum}>
            {ig ? `04 / ${totalSlides}` : `03 / ${totalSlides - 1}`}
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
