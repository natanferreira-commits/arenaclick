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
      const prompt = `Você é um copywriter especializado em mídia kits de criadores de conteúdo brasileiros.
Escreva uma descrição profissional para o mídia kit abaixo. Deve ter 3 a 4 frases.
Tom: confiante, direto, valorizado — como um grande creator que sabe o que vale.
Use linguagem que convença marcas e anunciantes a fechar parceria.
Destaque autoridade, consistência e conexão com a audiência.
Em português brasileiro. Sem bullet points. Sem títulos. Só o texto corrido.

Nome: ${body.name}
Nicho: ${body.niche || "conteúdo geral"}
Cidade: ${body.city || "Brasil"}
${instagram ? `Instagram: @${instagram.username} com ${instagram.followers.toLocaleString("pt-BR")} seguidores` : ""}
${instagram ? `Taxa de engajamento: ${instagram.engagementRate}%` : ""}
${instagram ? `Média de likes por post: ${instagram.avgLikes.toLocaleString("pt-BR")}` : ""}
${instagram ? `Posts publicados: ${instagram.posts.toLocaleString("pt-BR")}` : ""}
${body.niche === "Apostas" ? "Contexto: creator do nicho de apostas esportivas, referência no mercado brasileiro de tips e análises." : ""}

Responda APENAS com a descrição, sem aspas, sem títulos, sem explicações.`;

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
