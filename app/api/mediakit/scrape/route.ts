import { NextRequest, NextResponse } from "next/server";
import { scrapeInstagram } from "@/lib/instagram";
import Anthropic from "@anthropic-ai/sdk";
import type { MediaKitData, FormInput } from "@/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body: FormInput = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 });
    }

    // Scrape Instagram se @ foi fornecido
    let instagram = null;
    if (body.instagram) {
      instagram = await scrapeInstagram(body.instagram);
    }

    // Gerar descrição com IA
    let aiDescription = "";
    try {
      const prompt = `Você é um copywriter especializado em criadores de conteúdo brasileiros.
Crie uma descrição profissional curta (2-3 frases) para o mídia kit do criador abaixo.
Tom: confiante, direto, profissional. Em português brasileiro.

Nome: ${body.name}
Nicho: ${body.niche || "conteúdo geral"}
Cidade: ${body.city || "Brasil"}
${instagram ? `Instagram: @${instagram.username} com ${instagram.followers.toLocaleString("pt-BR")} seguidores` : ""}
${instagram ? `Taxa de engajamento: ${instagram.engagementRate}%` : ""}

Responda APENAS com a descrição, sem títulos ou explicações.`;

      const message = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      });

      aiDescription =
        message.content[0].type === "text" ? message.content[0].text : "";
    } catch {
      aiDescription = `${body.name} é um criador de conteúdo${body.niche ? ` de ${body.niche}` : ""} com presença nas redes sociais.`;
    }

    const result: MediaKitData = {
      name: body.name,
      email: body.email,
      whatsapp: body.whatsapp,
      niche: body.niche,
      city: body.city,
      contactEmail: body.contactEmail || body.email,
      avgStoryViews: Number(body.avgStoryViews) || 0,
      avgReelsViews: Number(body.avgReelsViews) || 0,
      instagram,
      aiDescription,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
