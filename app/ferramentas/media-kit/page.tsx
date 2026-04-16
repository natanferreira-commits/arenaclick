"use client";

import { useState } from "react";
import MediaKitForm from "@/components/mediakit/MediaKitForm";
import MediaKitPreview from "@/components/mediakit/MediaKitPreview";
import type { MediaKitData } from "@/types";

export default function MediaKitPage() {
  const [step, setStep] = useState<"form" | "loading" | "preview">("form");
  const [data, setData] = useState<MediaKitData | null>(null);

  async function handleSubmit(formData: {
    name: string;
    email: string;
    whatsapp: string;
    instagram: string;
    niche: string;
    city: string;
    contactEmail: string;
    avgStoryViews: string;
    avgReelsViews: string;
  }) {
    setStep("loading");
    try {
      const res = await fetch("/api/mediakit/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao buscar dados");
      }

      setData(result);
      setStep("preview");
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setStep("form");
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      {step === "form" && <MediaKitForm onSubmit={handleSubmit} />}
      {step === "loading" && <LoadingState />}
      {step === "preview" && data && (
        <MediaKitPreview data={data} onReset={() => setStep("form")} />
      )}
    </main>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 rounded-full border-2 border-[#C8FF00] border-t-transparent animate-spin" />
      <div className="text-center">
        <p className="text-white font-semibold text-lg">Gerando seu mídia kit...</p>
        <p className="text-white/40 text-sm mt-1">Buscando seus dados do Instagram</p>
      </div>
    </div>
  );
}
