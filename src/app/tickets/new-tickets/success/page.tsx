"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function TicketSuccessPage() {
  const router = useRouter();

  // Dados fictícios simulando o chamado que acabou de ser criado com base na imagem
  const ticketSummary = {
    protocol: "#TK983248327",
    title: "Erro no módulo financeiro",
    priority: "Alta",
    priorityColor: "text-rose-600 bg-rose-50",
    date: "10 de janeiro de 2026",
    status: "Aberto",
    statusColor: "text-blue-600 bg-blue-50"
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      {/* Container do Dispositivo Móvel */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between relative">
        
        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Conteúdo Central */}
        <main className="flex-1 px-5 py-6 flex flex-col items-center justify-center my-auto space-y-6">
          
          {/* Ícone de Sucesso Animado / Estilizado */}
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow-inner border border-blue-100/50">
            ✓
          </div>

          {/* Textos Principais */}
          <div className="text-center space-y-2">
            <h2 className="text-base font-black text-slate-800 tracking-tight px-4 leading-tight">
              Ação realizada com sucesso!
            </h2>
            <p className="text-[11px] text-slate-400 leading-normal max-w-[290px] mx-auto">
              Seu chamado foi enviado e registrado em nosso sistema. Nossa equipe de suporte irá analisá-lo em breve.
            </p>
          </div>

          {/* Protocolo */}
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Protocolo</span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md mt-1 inline-block">
              {ticketSummary.protocol}
            </span>
          </div>

          {/* Card: Resumo do Chamado */}
          <div className="w-full bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 text-[11px]">
            
            <div className="flex justify-between items-center py-0.5">
              <span className="font-bold text-slate-400">Chamado</span>
              <span className="font-extrabold text-blue-600 text-right max-w-[200px] truncate">
                {ticketSummary.title}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-t border-slate-50">
              <span className="font-bold text-slate-400">Prioridade</span>
              <span className={`font-extrabold px-2 py-0.5 rounded-md ${ticketSummary.priorityColor}`}>
                {ticketSummary.priority}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-t border-slate-50">
              <span className="font-bold text-slate-400">Data de envio</span>
              <span className="font-bold text-slate-700">
                {ticketSummary.date}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-t border-slate-50">
              <span className="font-bold text-slate-400">Status</span>
              <span className={`font-extrabold px-2 py-0.5 rounded-md ${ticketSummary.statusColor}`}>
                {ticketSummary.status}
              </span>
            </div>

          </div>

          {/* Botões de Ação */}
          <div className="w-full space-y-2 pt-2">
            <button 
              onClick={() => router.push("/reports")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100"
            >
              Voltar ao Dashboard
            </button>
            
            <button 
              onClick={() => router.push("/tickets")}
              className="w-full bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 font-bold text-xs py-3.5 rounded-xl transition shadow-sm"
            >
              Ver meus chamados
            </button>
          </div>

        </main>

        {/* Menu de Navegação Inferior Móvel */}
        <nav className="h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 rounded-t-xl z-10 w-full">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-blue-600">
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