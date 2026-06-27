"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Todas");

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
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 px-4 py-5 flex flex-col overflow-hidden pb-24">
          
          {/* Título com botão de voltar e Marcar como lidas */}
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/")} 
                className="text-blue-600 text-lg font-bold hover:opacity-75"
              >
                ←
              </button>
              <h1 className="text-base font-black text-slate-800">Notificações</h1>
            </div>
            <button className="text-[11px] font-bold text-blue-600 hover:underline">
              Marcar todas como lidas
            </button>
          </div>

          {/* Abas Sub-Header */}
          <div className="flex gap-4 border-b border-slate-200 px-1 mb-4 text-xs font-bold text-slate-400">
            <button 
              onClick={() => setActiveTab("Todas")}
              className={`pb-2 transition-colors relative ${activeTab === "Todas" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
            >
              Todas (5)
            </button>
            <button 
              onClick={() => setActiveTab("NaoLidas")}
              className={`pb-2 transition-colors relative ${activeTab === "NaoLidas" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
            >
              Não lidas (2)
            </button>
          </div>

          {/* Lista de Alertas com Scroll */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
            
            {/* Notificação 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-blue-500 relative flex justify-between items-start cursor-pointer hover:bg-slate-50/50 transition">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">
                    Novo comentário no ticket #1042
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Daniela Campos adicionou um comentário: O problema foi identificado no módulo de pagamento...
                </p>
                <p className="text-[10px] text-slate-400 font-medium pt-1">Há 5 minutos</p>
              </div>
              <span className="text-slate-300 text-xs self-center">▶</span>
            </div>

            {/* Notificação 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-blue-500 relative flex justify-between items-start cursor-pointer hover:bg-slate-50/50 transition">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">
                    Ticket #1033 atualizado
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  O status do ticket foi alterado para Em andamento por Marcos Oliveira.
                </p>
                <p className="text-[10px] text-slate-400 font-medium pt-1">Há 25 minutos</p>
              </div>
              <span className="text-slate-300 text-xs self-center">▶</span>
            </div>

            {/* Notificação 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-blue-500 relative flex justify-between items-start cursor-pointer hover:bg-slate-50/50 transition">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  <h3 className="font-extrabold text-xs text-slate-800 tailwind-ajuste leading-tight">
                    Ticket #1025 fechado
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Daniela Ferreira fechou o ticket.
                </p>
                <p className="text-[10px] text-slate-400 font-medium pt-1">Há 1 hora</p>
              </div>
              <span className="text-slate-300 text-xs self-center">▶</span>
            </div>

            {/* Notificação 4 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm relative flex justify-between items-start cursor-pointer hover:bg-slate-50/50 transition">
              <div className="space-y-1 pr-4">
                <h3 className="font-extrabold text-xs text-slate-800 leading-tight">
                  Arquivo anexado ao ticket #1029
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Paulo Ribeiro anexou log_erros_sistema.pdf ao ticket.
                </p>
                <p className="text-[10px] text-slate-400 font-medium pt-1">Há 3 horas</p>
              </div>
              <span className="text-slate-300 text-xs self-center">▶</span>
            </div>

            {/* Notificação 5 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm relative flex justify-between items-start cursor-pointer hover:bg-slate-50/50 transition">
              <div className="space-y-1 pr-4">
                <h3 className="font-extrabold text-xs text-slate-800 leading-tight">
                  Novo ticket atribuído #1045
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Você foi atribuído ao ticket Falha no login SSO por Carla Mendonça.
                </p>
                <p className="text-[10px] text-slate-400 font-medium pt-1">Ontem às 16:45</p>
              </div>
              <span className="text-slate-300 text-xs self-center">▶</span>
            </div>

          </div>
        </main>

        {/* Menu de Navegação Inferior Móvel de 4 botões */}
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
            <span className="text-lg">🔔</span>
            <span className="text-[10px] font-bold mt-0.5">Alertas</span>
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