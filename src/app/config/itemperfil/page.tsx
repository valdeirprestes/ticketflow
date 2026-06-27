"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Nova interface baseada no seu JSON
interface InterPerfilItem {
  id: number;
  idperfil: number;
  nome: string;
  descricao: string;
  prioridade: number;
  estado: string;
}

export default function ItensPerfilPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [tagtite, settagtitle] = useState("");
  
  // Estado inicializado como Array da nova interface
  const [itensPerfil, setItensPerfil] = useState<InterPerfilItem[]>([]);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const funcPerfil = async () => await carregarItensPerfil(token || "", "Todos");
    funcPerfil();
  }, [router]);

  // Função auxiliar para traduzir o número da prioridade
  const getstatus = (intprioridade: number) => {
    if (intprioridade === 1) return "Baixa";
    if (intprioridade === 2) return "Média";
    return "Alta";
  };

  // Função auxiliar para definir a cor da prioridade
  const getPriorityColor = (intprioridade: number) => {
    if (intprioridade === 1) return "bg-green-100 text-green-700";
    if (intprioridade === 2) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const buscarItensPerfil = async (token: string, obj: any) => {
    try {
      let filtro: any = {};
      let { titulo, qtdpagina, pagina, status } = obj;
      
      if (titulo) filtro.titulo = titulo;
      if (qtdpagina) filtro.qtdpagina = qtdpagina;
      if (pagina) filtro.pagina = pagina;
      if (status) filtro.status = status;

      const query = new URLSearchParams(filtro).toString();
      
      // AJUSTE: URL agora aponta para /interperfil
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const dados = await response.json();
      return dados;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const carregarItensPerfil = async (token: string, statusFiltro: string) => {
    let ObjFiltro: { qtdpagina: number; pagina: number; estado?: string } = { 
      qtdpagina: 5, 
      pagina: 1 
    };
    
    if (statusFiltro === "Ativo") ObjFiltro.estado = "ATIVO";
    if (statusFiltro === "Inativo") ObjFiltro.estado = "INATIVO";

    const dadosItens = await buscarItensPerfil(token, ObjFiltro);

    if (Array.isArray(dadosItens)) {
      const meusItens = dadosItens.map((p: any) => ({
        id: p.id || 0,
        idperfil: p.idperfil || 0,
        nome: p.nome || " ",
        descricao: p.descricao || " ",
        prioridade: p.prioridade || 1,
        estado: p.estado || ''
      }));

      setItensPerfil(meusItens);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Header Superior */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-lg tracking-wide">Itens do Perfil</span>
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
            <h1 className="text-xl font-black text-slate-800">Itens de Perfil</h1>
            <button
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/config/itemperfil/novo")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">➕</span>
              <span className="font-bold text-xs text-slate-800">Novo Perfil</span>
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar itens..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              onChange={
                async (e) => {
                  settagtitle(e.target.value);
                  const token = Cookies.get('auth_token') || "";
                  await carregarItensPerfil(token, activeFilter); 
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
                    await carregarItensPerfil(token, filter);
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

          {/* Lista de Cards de Itens de Perfil */}
          <div className="space-y-3">
            {itensPerfil.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/config/interperfil/${item.id}`)}
                className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-2.5 cursor-pointer hover:border-blue-300 transition active:scale-[0.99]"
              >
                {/* ID do item, Vínculo do Perfil & Estado */}
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <div className="flex gap-2">
                    <span className="text-blue-500 font-mono">ID: {item.id}</span>
                    <span className="text-slate-400 font-mono">Perfil: #{item.idperfil}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    item.estado === "ATIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.estado}
                  </span>
                </div>

                {/* Nome e Descrição */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                    {item.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                    {item.descricao}
                  </p>
                </div>

                {/* Rodapé do Card mostrando a Prioridade calculada */}
                <div className="flex justify-end items-center pt-1 border-t border-slate-50 text-[10px] font-medium">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${getPriorityColor(item.prioridade)}`}>
                    <span>🚨</span>
                    <span>Prioridade: {getstatus(item.prioridade)}</span>
                  </div>
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
            <span className="text-lg">⚙️</span>
            <span className="text-[10px] font-bold mt-0.5">Itens</span>
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