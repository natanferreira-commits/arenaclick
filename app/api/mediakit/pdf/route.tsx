import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { MediaKitData } from "@/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0d0d0d",
    fontFamily: "Helvetica",
    padding: 0,
  },

  // SLIDE 1 - COVER
  cover: {
    flex: 1,
    backgroundColor: "#C8FF00",
    padding: 60,
    justifyContent: "space-between",
  },
  coverLabel: { fontSize: 11, color: "rgba(0,0,0,0.5)", letterSpacing: 2, marginBottom: 8 },
  coverName: { fontSize: 48, fontFamily: "Helvetica-Bold", color: "#0d0d0d" },
  coverNiche: { fontSize: 20, color: "rgba(0,0,0,0.6)", marginTop: 6 },
  coverCity: { fontSize: 14, color: "rgba(0,0,0,0.4)", marginTop: 4 },
  coverDescription: {
    fontSize: 16,
    color: "rgba(0,0,0,0.7)",
    lineHeight: 1.6,
    maxWidth: 480,
    marginTop: 24,
  },
  coverFooter: { fontSize: 11, color: "rgba(0,0,0,0.4)" },

  // SLIDE 2 - MÉTRICAS
  slide: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 60,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 32,
    textTransform: "uppercase",
  },
  slideTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  slideTitleAccent: {
    color: "#C8FF00",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  metricCard: {
    width: "47%",
    backgroundColor: "#161616",
    borderRadius: 12,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  metricCardHighlight: {
    backgroundColor: "rgba(200,255,0,0.08)",
    border: "1px solid rgba(200,255,0,0.2)",
  },
  metricValue: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  metricValueHighlight: { color: "#C8FF00" },
  metricLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)" },

  // CONTATO
  contactSection: {
    marginTop: 40,
    backgroundColor: "#161616",
    borderRadius: 12,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  contactLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  contactText: { fontSize: 14, color: "rgba(255,255,255,0.7)" },

  // SLIDE ARENA CTA
  ctaSlide: {
    flex: 1,
    backgroundColor: "#C8FF00",
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#0d0d0d",
    textAlign: "center",
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 32,
  },
  ctaUrl: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0d0d0d",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data: MediaKitData = await req.json();
    const ig = data.instagram;

    const pdfBuffer = await renderToBuffer(
      <Document title={`Mídia Kit — ${data.name}`} author="Arena Click">
        {/* SLIDE 1 — COVER */}
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.cover}>
            <View>
              <Text style={styles.coverLabel}>MÍDIA KIT</Text>
              <Text style={styles.coverName}>{data.name}</Text>
              {data.niche ? <Text style={styles.coverNiche}>{data.niche}</Text> : null}
              {data.city ? <Text style={styles.coverCity}>{data.city}</Text> : null}
              <Text style={styles.coverDescription}>{data.aiDescription}</Text>
            </View>
            <Text style={styles.coverFooter}>arenaafiliados.com.br</Text>
          </View>
        </Page>

        {/* SLIDE 2 — MÉTRICAS INSTAGRAM */}
        {ig && (
          <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.slide}>
              <Text style={styles.sectionLabel}>Instagram — @{ig.username}</Text>
              <Text style={styles.slideTitle}>
                Alcance & Engajamento
              </Text>

              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>+{formatNumber(ig.followers)}</Text>
                  <Text style={styles.metricLabel}>Seguidores</Text>
                </View>
                <View style={[styles.metricCard, styles.metricCardHighlight]}>
                  <Text style={[styles.metricValue, styles.metricValueHighlight]}>
                    {formatPercent(ig.engagementRate)}
                  </Text>
                  <Text style={styles.metricLabel}>Taxa de engajamento</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{formatNumber(ig.avgLikes)}</Text>
                  <Text style={styles.metricLabel}>Média de likes por post</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{formatNumber(ig.posts)}</Text>
                  <Text style={styles.metricLabel}>Posts publicados</Text>
                </View>
                {data.avgStoryViews > 0 && (
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{formatNumber(data.avgStoryViews)}</Text>
                    <Text style={styles.metricLabel}>Alcance médio por story</Text>
                  </View>
                )}
                {data.avgReelsViews > 0 && (
                  <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>{formatNumber(data.avgReelsViews)}</Text>
                    <Text style={styles.metricLabel}>Média de views por Reels</Text>
                  </View>
                )}
              </View>
            </View>
          </Page>
        )}

        {/* SLIDE 3 — CONTATO */}
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.slide}>
            <Text style={styles.sectionLabel}>Vamos trabalhar juntos</Text>
            <Text style={styles.slideTitle}>Contato Comercial</Text>

            <View style={[styles.contactSection, { marginTop: 32 }]}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactText}>{data.contactEmail || data.email}</Text>
            </View>

            {data.whatsapp ? (
              <View style={styles.contactSection}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactText}>{data.whatsapp}</Text>
              </View>
            ) : null}

            {ig ? (
              <View style={styles.contactSection}>
                <Text style={styles.contactLabel}>Instagram</Text>
                <Text style={styles.contactText}>@{ig.username}</Text>
              </View>
            ) : null}
          </View>
        </Page>

        {/* SLIDE 4 — CTA ARENA */}
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.ctaSlide}>
            <Text style={styles.ctaTitle}>Feito com Arena Click</Text>
            <Text style={styles.ctaSubtitle}>
              Criadores de qualquer nicho monetizando sua audiência com afiliação em apostas esportivas.
            </Text>
            <Text style={styles.ctaUrl}>arenaafiliados.com.br</Text>
          </View>
        </Page>
      </Document>
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mediakit-${data.name.toLowerCase().replace(/\s/g, "-")}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
