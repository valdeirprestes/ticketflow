"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExportOptionsPage() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState("PDF");

  const formats = [
    { id: "PDF", title: "PDF", desc: "Documento portátil, ideal para impressões.", icon: "📄" },
    { id: "XLSX", title: "Excel (XLSX)", desc: "Planilha editável com dados estruturados.", icon: "📊" },
    { id: "CSV", title: "CSV", desc: "Texto separado por vírgulas, compatível com diversos sistemas.", icon: "🗂️" },
    { id: "DOCX", title: "Word (DOCX)", desc: "Documento de texto formatado e editável.", icon: "📝" },
    { id: "JSON", title: "JSON", desc: "Formato de dados para integração com APIs.", icon: "⚡" },
  ];

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
          
          {/* Cabeçalho da Seção */}
          <div className="flex items-center gap-3 px-0.5">
            <button 
              onClick={() => router.push("/reports")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Opções de Exportação</h1>
          </div>

          <p className="text-[11px] text-slate-400 px-0.5 leading-normal max-w-[320px]">
            Escolha o formato desejado para exportar seu relatório.
          </p>

          {/* Lista de Opções de Formato */}
          <div className="space-y-2.5">
            {formats.map((format) => {
              const isSelected = selectedFormat === format.id;
              return (
                <div 
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`bg-white p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? "border-blue-500 shadow-sm ring-1 ring-blue-500/20" 
                      : "border-slate-200/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                      isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                    }`}>
                      {format.icon}
                    </div>
                    <div className="max-w-[240px]">
                      <h3 className="font-extrabold text-xs text-slate-800 leading-tight">
                        {format.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        {format.desc}
                      </p>
                    </div>
                  </div>

                  {/* Radio Button Customizado */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de Ação Inferiores */}
          <div className="space-y-2 pt-2">
            <button 
              onClick={() => {
                alert(`Relatório exportado em formato ${selectedFormat}!`);
                router.push("/reports");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100"
            >
              Exporter Relatório
            </button>
            
            <button 
              onClick={() => router.push("/reports")}
              className="w-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs py-3.5 rounded-xl transition shadow-sm"
            >
              Cancelar
            </button>
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
        </nav>

      </div>
    </div>
  );
}