import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-[#C8FF00] font-black text-xl tracking-tight">Arena</span>
          <span className="text-white/30 text-xl font-light">Click</span>
        </div>
        <Link
          href="https://www.arenaafiliados.com.br"
          className="text-sm text-white/60 hover:text-white transition border border-white/10 px-4 py-2 rounded-full"
        >
          Seja um afiliado
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative px-8 pt-20 pb-28 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-1.5 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
          Ferramentas gratuitas para criadores
        </div>

        <h1 className="text-6xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6">
          Tudo que você precisa{" "}
          <span className="font-black" style={{ color: "#C8FF00" }}>
            para crescer
          </span>
          <br />e monetizar sua audiência.
        </h1>

        <p className="text-white/50 text-xl leading-relaxed max-w-2xl mx-auto mb-14">
          Ferramentas práticas e gratuitas para criadores de qualquer nicho. Crie seu mídia kit,
          calcule sua receita e muito mais.
        </p>

        <Link
          href="/ferramentas/media-kit"
          className="inline-flex items-center gap-2 bg-[#C8FF00] text-black font-bold px-8 py-4 rounded-xl hover:brightness-110 transition text-base"
        >
          Explorar ferramentas →
        </Link>
      </section>

      {/* TOOLS GRID */}
      <section className="max-w-5xl mx-auto px-8 pb-32">
        <div className="text-center mb-14">
          <div className="text-xs font-bold tracking-widest uppercase text-[#C8FF00] mb-3">
            Ferramentas
          </div>
          <h2 className="text-4xl font-black">Escolha por onde começar.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mídia Kit — disponível */}
          <Link
            href="/ferramentas/media-kit"
            className="group bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-[#C8FF00]/40 transition-all duration-200 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#C8FF0015", border: "1px solid #C8FF0030" }}
              >
                📄
              </div>
              <span className="text-xs font-bold text-[#C8FF00] bg-[#C8FF00]/10 px-3 py-1 rounded-full">
                Disponível
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Gerador de Mídia Kit</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Crie um mídia kit profissional com seus dados do Instagram em minutos. PDF pronto
                para enviar para marcas e parceiros.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#C8FF00] text-sm font-medium mt-auto">
              Criar agora
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>
          </Link>

          {/* Calculadora — em breve */}
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 opacity-50 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#ffffff10", border: "1px solid #ffffff15" }}
              >
                💰
              </div>
              <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Calculadora de Receita</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Descubra quanto você poderia ganhar monetizando sua audiência com afiliação em
                apostas esportivas.
              </p>
            </div>
          </div>

          {/* Checklist — em breve */}
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 opacity-50 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#ffffff10", border: "1px solid #ffffff15" }}
              >
                ✅
              </div>
              <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Checklist de Monetização</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Descubra se você está pronto para monetizar sua audiência e o que falta para
                começar.
              </p>
            </div>
          </div>

          {/* Bio — em breve */}
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 opacity-50 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#ffffff10", border: "1px solid #ffffff15" }}
              >
                ✍️
              </div>
              <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Gerador de Bio</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Gere uma bio otimizada para o Instagram que converte visitantes em seguidores e
                parceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA ARENA */}
      <section
        className="mx-8 mb-20 rounded-3xl p-12 text-center max-w-5xl md:mx-auto"
        style={{ background: "#C8FF00" }}
      >
        <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
          Quer ir além das ferramentas?
        </h2>
        <p className="text-black/60 text-lg mb-8 max-w-xl mx-auto">
          Junte-se à Arena e monetize sua audiência com acordos de afiliação em apostas esportivas.
          Sem burocracia, sem exigência de nicho.
        </p>
        <Link
          href="https://www.arenaafiliados.com.br"
          className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-black/80 transition text-base"
        >
          Quero ser afiliado Arena →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8 px-8 text-center text-white/30 text-sm">
        <p>© 2025 Arena Click. Ferramentas gratuitas para criadores de conteúdo.</p>
      </footer>
    </main>
  );
}
