"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { MediaKitData } from "@/types";
import LeadGateModal from "./LeadGateModal";

interface Props {
  data: MediaKitData;
  onReset: () => void;
}

export default function MediaKitPreview({ data, onReset }: Props) {
  const [showGate, setShowGate] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/mediakit/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao gerar PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mediakit-${data.instagram?.username || data.name.toLowerCase().replace(/\s/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleLeadSubmit(email: string, whatsapp: string) {
    // Salva o lead
    await fetch("/api/mediakit/save-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email,
        whatsapp,
        instagram: data.instagram?.username || "",
        niche: data.niche,
      }),
    });
    setShowGate(false);
    handleDownload();
  }

  const ig = data.instagram;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#C8FF00] font-black text-xl tracking-tight">Arena</span>
          <span className="text-white/30 text-xl font-light">Click</span>
        </Link>
        <button onClick={onReset} className="text-sm text-white/40 hover:text-white transition">
          ← Recomeçar
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] text-sm px-4 py-1.5 rounded-full mb-6">
            ✓ Mídia kit gerado com sucesso
          </div>
          <h2 className="text-3xl font-black mb-2">Pronto, {data.name.split(" ")[0]}!</h2>
          <p className="text-white/40">Confira seu mídia kit e baixe o PDF quando estiver satisfeito.</p>
        </div>

        {/* Preview Card */}
        <div className="bg-[#161616] border border-white/8 rounded-3xl overflow-hidden mb-8">
          {/* Cover */}
          <div className="bg-[#C8FF00] p-10 flex items-center justify-between">
            <div>
              <p className="text-black/50 text-sm font-medium mb-1">MÍDIA KIT</p>
              <h1 className="text-black text-4xl font-black">{data.name}</h1>
              {data.niche && (
                <p className="text-black/60 text-lg mt-1">{data.niche}</p>
              )}
              {data.city && (
                <p className="text-black/50 text-sm mt-0.5">{data.city}</p>
              )}
            </div>
            {ig?.profilePicUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/mediakit/img-proxy?url=${encodeURIComponent(ig.profilePicUrl)}`}
                alt={data.name}
                className="w-24 h-24 rounded-full border-4 border-black/10 object-cover"
              />
            )}
          </div>

          {/* Sobre */}
          <div className="p-10 border-b border-white/5">
            <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Sobre</p>
            <p className="text-white/80 text-lg leading-relaxed">{data.aiDescription}</p>
          </div>

          {/* Métricas Instagram */}
          {ig && (
            <div className="p-10 border-b border-white/5">
              <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">
                Instagram — @{ig.username}
                {ig.isVerified && <span className="ml-2 text-[#C8FF00]">✓ Verificado</span>}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Seguidores" value={`+${formatNumber(ig.followers)}`} />
                <MetricCard label="Engajamento" value={formatPercent(ig.engagementRate)} highlight />
                <MetricCard label="Média de likes" value={formatNumber(ig.avgLikes)} />
                <MetricCard label="Posts" value={formatNumber(ig.posts)} />
              </div>

              {(data.avgStoryViews > 0 || data.avgReelsViews > 0) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {data.avgStoryViews > 0 && (
                    <MetricCard label="Alcance médio por story" value={formatNumber(data.avgStoryViews)} />
                  )}
                  {data.avgReelsViews > 0 && (
                    <MetricCard label="Média de views por Reels" value={formatNumber(data.avgReelsViews)} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Contato */}
          <div className="p-10">
            <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Contato</p>
            <div className="flex flex-wrap gap-4">
              <span className="text-white/60 text-sm">{data.contactEmail || data.email}</span>
              {data.whatsapp && (
                <span className="text-white/60 text-sm">WhatsApp: {data.whatsapp}</span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Download */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowGate(true)}
            className="w-full max-w-sm bg-[#C8FF00] text-black font-bold py-4 rounded-xl hover:brightness-110 transition text-base"
          >
            {downloading ? "Gerando PDF..." : "Baixar PDF grátis →"}
          </button>
          <p className="text-white/20 text-xs">
            Ao baixar, você concorda em receber novidades da Arena.
          </p>
        </div>

        {/* CTA Arena */}
        <div className="mt-16 bg-[#161616] border border-white/8 rounded-2xl p-8 text-center">
          <p className="text-white/40 text-sm mb-2">Quer monetizar esse alcance?</p>
          <h3 className="text-2xl font-black mb-3">Junte-se à Arena</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Criadores de qualquer nicho podem ganhar dinheiro com afiliação em apostas esportivas.
            Sem burocracia.
          </p>
          <Link
            href="https://www.arenaafiliados.com.br"
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold px-6 py-3 rounded-xl hover:brightness-110 transition text-sm"
          >
            Quero ser afiliado Arena →
          </Link>
        </div>
      </div>

      {showGate && (
        <LeadGateModal
          defaultEmail={data.email}
          defaultWhatsapp={data.whatsapp}
          onConfirm={handleLeadSubmit}
          onClose={() => setShowGate(false)}
        />
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={
        highlight
          ? { background: "#C8FF0015", border: "1px solid #C8FF0030" }
          : { background: "#1f1f1f", border: "1px solid rgba(255,255,255,0.06)" }
      }
    >
      <p
        className="text-2xl font-black mb-1"
        style={{ color: highlight ? "#C8FF00" : "#ffffff" }}
      >
        {value}
      </p>
      <p className="text-white/40 text-xs">{label}</p>
    </div>
  );
}
