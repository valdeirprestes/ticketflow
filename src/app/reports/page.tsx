"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("Últimos 7 dias");
  const [reportType, setReportType] = useState("Chamados por Status");

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
            <button onClick={() => router.push("/notifications")} className="hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
          </div>
        </header>

        {/* Conteúdo Principal com Scroll */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3 px-0.5">
            <button 
              onClick={() => router.push("/")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Relatórios</h1>
          </div>

          {/* Card: Painel de Análises (Gráfico) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-xl bg-blue-50 text-blue-600 p-2 rounded-xl">📊</span>
              <div>
                <h3 className="font-extrabold text-xs text-slate-800">Painel de Análises</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Visualize métricas e tendências dos chamados</p>
              </div>
            </div>

            {/* Simulação de Gráfico de Barras */}
            <div className="bg-slate-50 rounded-xl p-4 h-32 flex items-end justify-between gap-1.5 pt-6 relative border border-slate-100">
              {[60, 40, 85, 55, 30, 75, 45, 80, 70, 50].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col justify-end h-full">
                  <div 
                    className="w-full bg-blue-600 rounded-t-sm transition-all duration-500" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div 
                    className="w-full bg-amber-600 rounded-b-sm transition-all duration-500" 
                    style={{ height: `${height * 0.3}%` }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Altere esta linha dentro do card do gráfico no seu reports/page.tsx */}
<button 
  onClick={() => router.push("/reports/dashboard")} // <-- ALTERADO AQUI
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-sm shadow-blue-100"
>
  Ver Painel Complexo
</button>
          </div>

          {/* Resumo Rápido */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 px-0.5">Resumo Rápido</h3>
            <div className="grid grid-cols-2 gap-2">
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">247</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total de Chamados</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">89%</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Taxa de Resolução</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">18</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Abertos Hoje</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/40 text-center">
                <p className="text-xl font-black text-blue-600">4.2h</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Tempo Médio</p>
              </div>

            </div>
          </div>

          {/* Formulário: Gerar Relatório */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800">Gerar Relatório</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Período</label>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm appearance-none"
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Este Mês</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tipo de Relatório</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm appearance-none"
                >
                  <option>Chamados por Status</option>
                  <option>Desempenho Técnico</option>
                  <option>Volumetria Mensal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm">
                Gerar
              </button>
              {/* Altere o botão Exportar no seu arquivo reports/page.tsx por este: */}
<button 
  type="button"
  onClick={() => router.push("/reports/export")} // <-- ADICIONADO AQUI
  className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
>
  Exportar
</button>
            </div>
          </div>

          {/* Relatórios Recentes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Relatórios Recentes</h3>
            
            <div className="space-y-2.5">
              {[
                { label: "Chamados por Status - Semanal", date: "Gerado em 10/01/2026" },
                { label: "Desempenho Mensal - Dezembro", date: "Gerado em 05/01/2026" },
                { label: "Tempo de Resolução - Q4 2025", date: "Gerado em 28/12/2025" },
                { label: "Prioridade dos Chamados - Novembro", date: "Gerado em 01/12/2025" },
              ].map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-50 last:border-none last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📄</span>
                    <div>
                      <p className="font-bold text-slate-700 leading-tight">{doc.label}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{doc.date}</p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-blue-500 transition text-xs">📥</button>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Menu de Navegação Inferior Móvel (Mantendo o padrão de 4 abas para consistência) */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">📊</span>
            <span className="text-[10px] font-bold mt-0.5">Relatórios</span>
          </button>
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}