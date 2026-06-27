"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface InterPerfil {
  id: number;
  nome: string;
  desc: string;
  estado: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [tagtite, settagtitle] = useState("");
  
  // CORREÇÃO 1: Agora é um Array de InterPerfil
  const [perfils, setperfils] = useState<InterPerfil[]>([]); 

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const funcperfil = async () => await carregarPerfil(token || "", "Todos");
    funcperfil();
  }, [router]);

  const buscarPerfil = async (token: string, obj: any) => {
    try {
      let filtro: any = {};
      let { titulo, qtdpagina, pagina, status } = obj;
      
      if (titulo) filtro.titulo = titulo;
      if (qtdpagina) filtro.qtdpagina = qtdpagina;
      if (pagina) filtro.pagina = pagina;
      if (status) filtro.status = status;

      const query = new URLSearchParams(filtro).toString();
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const dados = await response_abertos.json();
      return dados;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const carregarPerfil = async (token: string, statusFiltro: string) => {
    // CORREÇÃO 4: Tipando o objeto de filtro para aceitar a propriedade 'estado'
    let ObjFiltro: { qtdpagina: number; pagina: number; estado?: string } = { 
      qtdpagina: 5, 
      pagina: 1 
    };
    
    if (statusFiltro === "Ativo") ObjFiltro.estado = "ATIVO";
    if (statusFiltro === "Inativo") ObjFiltro.estado = "INATIVO";

    const dadosPerfil = await buscarPerfil(token, ObjFiltro);

    if (Array.isArray(dadosPerfil)) {
      const meusPerfil = dadosPerfil.map((p: any) => ({
        id: p.id || 0,
        nome: p.nome || " ",
        desc: p.descricao || " ",
        estado: p.estado || ''
      }));

      setperfils(meusPerfil);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Listagem */}
        <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-24">

          {/* Cabeçalho de Seção */}
          <div className="flex justify-between items-center px-0.5">
            <button
              onClick={() => router.push("/config")}
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ⬅️
            </button>
            <h1 className="text-xl font-black text-slate-800">Lista de Perfil</h1>
            <button
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/config/perfil/novo")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">➕</span>
              <span className="font-bold text-xs text-slate-800">Novo Perfil</span>
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar perfis..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              onChange={
                async (e) => {
                  settagtitle(e.target.value);
                  const token = Cookies.get('auth_token') || "";
                  // CORREÇÃO 3: Trocado 'carregarChamados' por 'carregarPerfil'
                  await carregarPerfil(token, activeFilter); 
                }
              }
            />
            <span className="absolute right-3.5 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          {/* Filtros horizontais */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["Todos", "Ativo", "Inativo"].map((filter) => (
              <button
                key={filter}
                onClick={
                  async () => {
                    const token = Cookies.get('auth_token') || "";
                    setActiveFilter(filter);
                    await carregarPerfil(token, filter);
                  }
                }
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  activeFilter === filter
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100"
                    : "bg-white border-slate-200 text-blue-500 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Lista de Cards de Perfis */}
          <div className="space-y-3">
            {perfils.map((perfil) => (
              <div
                key={perfil.id}
                onClick={() => router.push(`/config/perfil/${perfil.id}`)}
                className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-2.5 cursor-pointer hover:border-blue-300 transition active:scale-[0.99]"
              >
                {/* ID do perfil & Status */}
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-blue-500 font-mono">ID: {perfil.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    perfil.estado === "ATIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {perfil.estado}
                  </span>
                </div>

                {/* CORREÇÃO 2: Substituído 'ticket' pelas propriedades corretas de 'perfil' */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                    {perfil.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                    {perfil.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Menu de Navegação Inferior */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-bold mt-0.5">Tickets</span>
          </button>
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}