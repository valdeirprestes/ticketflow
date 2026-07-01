"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [nome,setnome] = useState('');
  const [telefone,settelefone] = useState('');
  const [email, setemail] = useState('');
  const [perfil, setperfil] = useState('');
  const [criado, setcriado] = useState('')


  const carregar = async () => {
    try{
      const token = Cookies.get("auth_token");
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API}/usuario${params.id}`, {
        method: 'GET', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const usuario = await resp.json();
      if(usuario){
        setnome(usuario.nome || "");
        settelefone(usuario.telefone || "");
        setemail(usuario.email || "");
        setperfil("teste" || "");
        setcriado(usuario.created_at || "");

      }
    }catch(e){
      console.log(e);
    }
  }

  useEffect(()=>{
    const rodar = async () => carregar();
    rodar();
  },[])

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
        </header>

        {/* Conteúdo Principal com Scroll */}
        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">
          
          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/")} 
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Perfil do Usuário</h1>
          </div>

          {/* Top Card Identidade */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-md shadow-blue-600/10">
              RCS
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 mt-3 tracking-tight">{nome}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">{perfil}</p>
          </div>

          {/* Informações Pessoais */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Informações Pessoais</h3>
            
            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="text-slate-400">Nome completo</span>
              <span className="font-bold text-slate-700">Ricardo Cesar de Souza</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="text-slate-400">E-mail</span>
              <span className="font-bold text-slate-700">ricardo.souza@empresa.com</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="text-slate-400">Telefone</span>
              <span className="font-bold text-slate-700">+55 (44) 98822-4411</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
              <span className="text-slate-400">Departamento</span>
              <span className="font-bold text-slate-700">TI - Desenvolvimento</span>
            </div>

            <div className="flex justify-between items-center text-xs pt-0.5">
              <span className="text-slate-400">Membro desde</span>
              <span className="font-bold text-slate-700">12/05/2026</span>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 mb-3 px-0.5">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2">
                <p className="text-lg font-black text-blue-600">47</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Chamados abertos</p>
              </div>
              <div className="p-2 border-x border-slate-100">
                <p className="text-lg font-black text-emerald-500">38</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Resolvidos</p>
              </div>
              <div className="p-2">
                <p className="text-lg font-black text-amber-500">9</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Pendentes</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-2.5 pt-1">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100">
              Editar Perfil
            </button>
            <button className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-3.5 rounded-xl transition shadow-sm">
              Alterar Senha
            </button>
          </div>

        </main>

        {/* Menu de Navegação Inferior Fixo */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-bold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}