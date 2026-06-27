"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DetailedDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      {/* Container do Dispositivo Móvel */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button className="hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
          </div>
        </header>

        {/* Conteúdo Principal com Scroll */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          {/* Cabeçalho de Navegação */}
          <div className="flex items-center gap-3 px-0.5">
            <button 
              onClick={() => router.push("/reports")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <div>
              <h1 className="text-base font-black text-slate-800 leading-tight">Painel de Análises</h1>
              <p className="text-[9px] text-slate-400 mt-0.5">Atualizado em 14 Jun 2026, 21:30</p>
            </div>
          </div>

          {/* 1. Resumo Geral (Grid de 4 Cards) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">Resumo Geral</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-blue-600">347</p>
                <p className="text-[9px] text-slate-400 font-semibold">Total de Tickets</p>
              </div>
              <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-amber-600">42</p>
                <p className="text-[9px] text-slate-400 font-semibold">Em aberto</p>
              </div>
              <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-emerald-600">289</p>
                <p className="text-[9px] text-slate-400 font-semibold">Resolvidos</p>
              </div>
              <div className="bg-rose-50/40 border border-rose-100/60 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-rose-600">16</p>
                <p className="text-[9px] text-slate-400 font-semibold">Cancelados</p>
              </div>
            </div>
          </div>

          {/* 2. Gráfico: Tickets por Mês */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tickets por Mês</h3>
            <div className="bg-slate-50 rounded-xl p-3 h-28 flex items-end justify-between gap-1.5 pt-4 border border-slate-100">
              {[45, 30, 65, 55, 35, 75, 50, 85, 70].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                  <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${height}%` }}></div>
                  <div className="w-full bg-amber-500 rounded-b-sm" style={{ height: `${height * 0.25}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Gráfico: Distribuição por Categoria (Pizza) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Distribuição por Categoria</h3>
            <div className="flex flex-col items-center py-2 space-y-4">
              {/* Círculo simulando gráfico de pizza */}
              <div className="w-24 h-24 rounded-full border-8 border-blue-500 relative flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:rounded-full before:border-8 before:border-amber-500 before:clip-path-custom">
                <span className="text-[10px] font-black text-slate-700">Categorias</span>
              </div>
              {/* Legendas */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px] font-bold text-slate-600 w-full px-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Infraestrutura (55%)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Software (27%)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Redes (10%)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Outros (8%)
                </div>
              </div>
            </div>
          </div>

          {/* 4. Gráfico: Tempo Médio de Resolução (Linhas) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tempo Médio de Resolução</h3>
            <div className="bg-slate-50 rounded-xl p-3 h-28 flex items-center justify-center border border-slate-100 relative overflow-hidden">
              {/* Linhas cruzadas simulando gráfico vetorial */}
              <svg className="w-full h-full stroke-blue-500" viewBox="0 0 100 50" fill="none">
                <path d="M0,40 Q25,20 50,35 T100,10" strokeWidth="2" />
                <path d="M0,45 Q25,35 50,20 T100,30" strokeWidth="1.5" className="stroke-amber-500" />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold px-1">
              <div>
                <p className="text-blue-600 text-sm font-black">4.2h</p>
                <p className="text-slate-400 text-[9px] font-medium">Média Atual</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-500 text-sm font-black">3.8h</p>
                <p className="text-slate-400 text-[9px] font-medium">Meta</p>
              </div>
              <div className="text-right">
                <p className="text-amber-500 text-sm font-black">5.1h</p>
                <p className="text-slate-400 text-[9px] font-medium">Mês Anterior</p>
              </div>
            </div>
          </div>

          {/* 5. Top Agentes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Agentes</h3>
            <div className="space-y-2.5">
              {[
                { name: "Renata Medeiros", count: "112 Resolvidos", pct: "96%" },
                { name: "Carlos Ferreira", count: "98 Resolvidos", pct: "92%" },
                { name: "Amanda Oliveira", count: "84 Resolvidos", pct: "90%" },
                { name: "Diego Lopes", count: "76 Resolvidos", pct: "85%" },
              ].map((agent, index) => (
                <div key={index} className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                      {agent.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 leading-tight">{agent.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{agent.count}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px]">{agent.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Tickets por Prioridade */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tickets por Prioridade</h3>
            <div className="space-y-2.5 pt-1">
              {[
                { label: "Crítica", color: "bg-red-500", w: "w-[85%]", val: "112" },
                { label: "Alta", color: "bg-orange-500", w: "w-[60%]", val: "84" },
                { label: "Média", color: "bg-blue-500", w: "w-[45%]", val: "120" },
                { label: "Baixa", color: "bg-emerald-500", w: "w-[25%]", val: "31" },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{item.label}</span>
                    <span>{item.val}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full ${item.w} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Menu de Navegação Inferior Móvel */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button onClick={() => router.push("/reports")} className="flex flex-col items-center text-blue-600">
            <span className="text-lg">📊</span>
            <span className="text-[10px] font-bold mt-0.5">Relatórios</span>
          </button>
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center text-slate-400">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}