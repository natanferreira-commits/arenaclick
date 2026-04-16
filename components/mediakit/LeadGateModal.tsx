"use client";

import { useState } from "react";

interface Props {
  defaultEmail: string;
  defaultWhatsapp: string;
  onConfirm: (email: string, whatsapp: string) => void;
  onClose: () => void;
}

export default function LeadGateModal({ defaultEmail, defaultWhatsapp, onConfirm, onClose }: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [whatsapp, setWhatsapp] = useState(defaultWhatsapp);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onConfirm(email, whatsapp);
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
    >
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">📥</div>
          <h3 className="text-xl font-black mb-2">Quase lá!</h3>
          <p className="text-white/50 text-sm">
            Confirme seus dados para baixar o PDF gratuitamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-sm">Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-white/8 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8FF00]/40 transition text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-sm">WhatsApp</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8FF00]/40 transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8FF00] text-black font-bold py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Gerando..." : "Baixar PDF grátis →"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-white/30 text-sm hover:text-white/60 transition text-center"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
