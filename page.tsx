"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeDashboardPage() {
  const router = useRouter();
  const [recentActivities] = useState([
    { id: 1, type: "update", title: "Ticket #1042 atualizado", desc: "Problema de rede • Há 10 min", icon: "💻", color: "bg-blue-50 text-blue-600" },
    { id: 2, type: "comment", title: "Novo comentário no #1033", desc: "Falha no sistema • Há 1 hora", icon: "💬", color: "bg-sky-50 text-sky-600" },
    { id: 3, type: "resolved", title: "Ticket #1028 resolvido", desc: "Acesso VPN • Há 3 horas", icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      {/* Container simulando o dispositivo móvel da imagem */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header Azul Superior */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎫</span>
              <span className="font-bold text-lg tracking-wide">TicketMS</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <button className="relative hover:opacity-80" onClick={() => router.push("/notifications")}>🔔</button>
              <button   onClick={() => router.push("/login")}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transform translate-y-[-0.5px]"                    >
                      {/* O arco circular aberto no topo */}
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />

                      {/* A linha vertical central */}
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg></button>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">Olá, Ricardo Cesar</h1>
            <p className="text-xs text-blue-100 mt-0.5">Bem-vindo ao painel de controle</p>
          </div>
        </header>

        {/* Conteúdo com Scroll se necessário */}
        <main className="flex-1 px-4 py-5 space-y-5 overflow-y-auto pb-24">
          
          {/* Grid de Botões Principais */}
          <div className="grid grid-cols-2 gap-3">
            
            <button 
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/tickets")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">📋</span>
              <span className="font-bold text-xs text-slate-800">Meus Chamados</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Ver todos na listagem</span>
            </button>

            <button 
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/tickets/new-tickets")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">➕</span>
              <span className="font-bold text-xs text-slate-800">Novo Chamado</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Abrir um ticket</span>
            </button>

            <button 
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/notifications")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">🔔</span>
              <span className="font-bold text-xs text-slate-800">Notificações</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Central de avisos</span>
            </button>

            <button 
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/profile")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">👤</span>
              <span className="font-bold text-xs text-slate-800">Meu Perfil</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Dados pessoais</span>
            </button>

          </div>

          {/* Barra Horizontal de Relatórios */}
          <button 
  onClick={() => router.push("/reports")} // <-- ATUALIZADO AQUI
  className="w-full bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between transition active:scale-[0.98]"
>
  <div className="flex items-center gap-3">
    <span className="text-xl bg-blue-50 text-blue-600 p-2 rounded-xl">📊</span>
    <div className="text-left">
      <span className="font-bold text-xs text-slate-800 block">Relatórios</span>
      <span className="text-[10px] text-slate-400 block mt-0.5">Análises e exportações</span>
    </div>
  </div>
  <span className="text-slate-300 text-xs">▶</span>
</button>

          {/* Seção Resumo Rápido */}
          <div>
            <h2 className="font-bold text-sm text-slate-800 mb-2.5 px-0.5">Resumo Rápido</h2>
            <div className="grid grid-cols-3 gap-3">
              
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm text-center">
                <p className="text-lg font-black text-blue-600">12</p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Abertos</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm text-center">
                <p className="text-lg font-black text-amber-500">5</p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Pendentes</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm text-center">
                <p className="text-lg font-black text-emerald-500">28</p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Resolvidos</p>
              </div>

            </div>
          </div>

          {/* Seção Atividade Recente */}
          <div>
            <h2 className="font-bold text-sm text-slate-800 mb-2.5 px-0.5">Atividade Recente</h2>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-base p-2 rounded-xl ${activity.color}`}>
                      {activity.icon}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{activity.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activity.desc}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 text-xs">▶</span>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Menu de Navegação Inferior Fixo */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-bold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
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