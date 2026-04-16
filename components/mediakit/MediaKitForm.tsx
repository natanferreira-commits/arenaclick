"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormInput } from "@/types";

const NICHES = [
  "Esportes", "Humor", "Lifestyle", "Games", "Educação",
  "Moda & Beleza", "Gastronomia", "Entretenimento", "Negócios", "Apostas",
];

interface Props {
  onSubmit: (data: FormInput) => void;
}

export default function MediaKitForm({ onSubmit }: Props) {
  const [form, setForm] = useState<FormInput>({
    name: "", email: "", whatsapp: "", instagram: "",
    niche: "", city: "", contactEmail: "", avgStoryViews: "", avgReelsViews: "",
  });

  function set(key: keyof FormInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSubmit(form);
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#C8FF00] font-black text-xl tracking-tight">Arena</span>
          <span className="text-white/30 text-xl font-light">Click</span>
        </Link>
        <span className="text-white/40 text-sm">Gerador de Mídia Kit</span>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
            Gratuito e sem cadastro complicado
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4">
            Seu mídia kit{" "}
            <span className="font-black" style={{ color: "#C8FF00" }}>profissional,</span>
            <br />pronto em minutos.
          </h1>
          <p className="text-white/40 text-lg">
            Preencha os campos abaixo. Buscamos seus dados do Instagram automaticamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Dados obrigatórios */}
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 flex flex-col gap-5">
            <div className="text-xs font-bold tracking-widest uppercase text-white/30">
              Informações obrigatórias
            </div>

            <Field label="Nome completo *">
              <input
                required
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Email *">
              <input
                required
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp">
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="@Instagram">
              <div className="flex items-center bg-[#1f1f1f] border border-white/8 rounded-xl px-4 py-3 focus-within:border-[#C8FF00]/40 transition">
                <span className="text-white/30 mr-1">@</span>
                <input
                  type="text"
                  placeholder="seuarroba"
                  value={form.instagram}
                  onChange={(e) => set("instagram", e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/20 focus:outline-none text-sm"
                />
              </div>
            </Field>
          </div>

          {/* Dados do perfil */}
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 flex flex-col gap-5">
            <div className="text-xs font-bold tracking-widest uppercase text-white/30">
              Sobre o seu perfil{" "}
              <span className="normal-case font-normal">(opcional, mas melhora o kit)</span>
            </div>

            <Field label="Nicho de conteúdo">
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("niche", form.niche === n ? "" : n)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border transition"
                    style={
                      form.niche === n
                        ? { background: "#C8FF00", color: "#0d0d0d", borderColor: "#C8FF00" }
                        : { background: "#1f1f1f", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.08)" }
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Cidade / Estado">
                <input
                  type="text"
                  placeholder="ex: São Paulo, SP"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email comercial">
                <input
                  type="email"
                  placeholder="contato@email.com"
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Alcance médio por story">
                <input
                  type="number"
                  placeholder="ex: 3000"
                  value={form.avgStoryViews}
                  onChange={(e) => set("avgStoryViews", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Média de views por Reels">
                <input
                  type="number"
                  placeholder="ex: 20000"
                  value={form.avgReelsViews}
                  onChange={(e) => set("avgReelsViews", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C8FF00] text-black font-bold py-4 rounded-xl hover:brightness-110 transition text-base"
          >
            Gerar meu mídia kit grátis →
          </button>

          <p className="text-white/20 text-xs text-center">
            Funciona com contas públicas do Instagram
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/60 text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#1f1f1f] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/40 transition text-sm";
