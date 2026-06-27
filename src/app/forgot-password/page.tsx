"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      
      {/* Container do Dispositivo Móvel */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between p-6 relative">
        
        {/* Espaçador superior/Logo */}
        <div className="flex flex-col items-center pt-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-blue-600">📂</span>
            <span className="font-black text-xl tracking-wide text-blue-600">TicketMS</span>
          </div>
        </div>

        {/* Card do Formulário Central */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center my-auto">
          
          {/* Ícone de Cadeado */}
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-lg shadow-inner mb-4">
            🔒
          </div>

          {/* Títulos informativos */}
          <h2 className="text-base font-black text-slate-800 tracking-tight text-center">
            Recuperação de Senha
          </h2>
          <p className="text-[11px] text-slate-400 text-center leading-normal mt-2 max-w-[280px]">
            Digite seu e-mail cadastrado abaixo. Enviaremos um link para você redefinir sua senha de acesso ao sistema.
          </p>

          {/* Campos do Formulário */}
          <form className="w-full space-y-3.5 mt-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* E-mail */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                E-mail
              </label>
              <input 
                type="email" 
                placeholder="seuemail@gmail.com" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-300 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                Nova Senha
              </label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-300 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input 
                type="password" 
                placeholder="Repita a nova senha" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-300 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2 pt-2">
              <button 
                type="submit"
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100"
              >
                Redefinir Senha
              </button>
              
              <button 
                type="button"
                onClick={() => router.push("/login")}
                className="w-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs py-3.5 rounded-xl transition shadow-sm"
              >
                Voltar ao Login
              </button>
            </div>

          </form>
        </div>

        {/* Rodapé de Segurança */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pb-4">
          <span>🛡️</span>
          <p>Seus dados estão protegidos com criptografia de ponta a ponta.</p>
        </div>

      </div>
    </div>
  );
}