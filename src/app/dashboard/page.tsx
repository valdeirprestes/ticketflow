"use client";

import { useState } from "react";

export default function DashboardPage() {
  // Dados fictícios para popular o painel de tickets
  const [metrics] = useState({
    open: 12,
    inProgress: 5,
    resolved: 48,
  });

  const [recentTickets] = useState([
    { id: "TK-1042", title: "Erro ao acessar banco de dados", status: "Aberto", priority: "Alta", date: "Há 10 min" },
    { id: "TK-1041", title: "Instalação de software homologado", status: "Em Progresso", priority: "Média", date: "Há 1 hora" },
    { id: "TK-1040", title: "Redefinição de senha de e-mail", status: "Resolvido", priority: "Baixa", date: "Há 3 horas" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Barra de Navegação Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            <span className="font-bold text-xl tracking-tight text-slate-900">TicketFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Olá, Ricardo</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              R
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título da Seção */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Painel Geral</h1>
          <p className="text-sm text-slate-500">Acompanhe o status e andamento dos chamados de suporte.</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Chamados Abertos</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{metrics.open}</h3>
            </div>
            <span className="text-2xl bg-amber-50 p-3 rounded-xl text-amber-600">⚠️</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Em Atendimento</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{metrics.inProgress}</h3>
            </div>
            <span className="text-2xl bg-blue-50 p-3 rounded-xl text-blue-600">⚙️</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Resolvidos</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{metrics.resolved}</h3>
            </div>
            <span className="text-2xl bg-emerald-50 p-3 rounded-xl text-emerald-600">✅</span>
          </div>

        </div>

        {/* Tabela de Chamados Recentes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Atividades Recentes</h2>
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              + Novo Chamado
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <th className="p-4">ID</th>
                  <th className="p-4">Assunto</th>
                  <th className="p-4">Prioridade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Atualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-medium text-slate-600">{ticket.id}</td>
                    <td className="p-4 font-medium text-slate-900">{ticket.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${ticket.priority === "Alta" ? "bg-rose-50 text-rose-700" : ""}
                        ${ticket.priority === "Média" ? "bg-amber-50 text-amber-700" : ""}
                        ${ticket.priority === "Baixa" ? "bg-slate-100 text-slate-700" : ""}
                      `}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${ticket.status === "Aberto" ? "bg-amber-100 text-amber-800" : ""}
                        ${ticket.status === "Em Progresso" ? "bg-blue-100 text-blue-800" : ""}
                        ${ticket.status === "Resolvido" ? "bg-emerald-100 text-emerald-800" : ""}
                      `}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}