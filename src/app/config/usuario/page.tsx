"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Interface atualizada com o objeto perfil aninhado e as datas
interface InterUsuario {
  id: number;
  idperfil: number;
  nome: string;
  email: string;
  estado: string;
  created_at: string;
  updated_at: string;
  perfil: {
    id: number;
    nome: string;
  };
}

export default function UsuariosPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [tagtite, settagtitle] = useState("");
  
  // Estado inicializado como Array de Usuários
  const [usuarios, setUsuarios] = useState<InterUsuario[]>([]);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const funcUsuarios = async () => await carregarUsuarios(token || "", "Todos");
    funcUsuarios();
  }, [router]);

  // Função auxiliar para formatar a data vinda da API
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    } catch (e) {
      return "";
    }
  };

  const buscarUsuarios = async (token: string, obj: any) => {
    try {
      let filtro: any = {};
      let { titulo, qtdpagina, pagina, status } = obj;
      
      if (titulo) filtro.titulo = titulo;
      if (qtdpagina) filtro.qtdpagina = qtdpagina;
      if (pagina) filtro.pagina = pagina;
      if (status) filtro.status = status;

      const query = new URLSearchParams(filtro).toString();
      
      // AJUSTE: URL agora aponta para /usuario
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/usuario?${query}`, {
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

  const carregarUsuarios = async (token: string, statusFiltro: string) => {
    let ObjFiltro: { qtdpagina: number; pagina: number; estado?: string } = { 
      qtdpagina: 5, 
      pagina: 1 
    };
    
    if (statusFiltro === "Ativo") ObjFiltro.estado = "ATIVO";
    if (statusFiltro === "Inativo") ObjFiltro.estado = "INATIVO";

    const dadosUsuarios = await buscarUsuarios(token, ObjFiltro);

    if (Array.isArray(dadosUsuarios)) {
      const meusUsuarios = dadosUsuarios.map((u: any) => ({
        id: u.id || 0,
        idperfil: u.idperfil || 0,
        nome: u.nome || " ",
        email: u.email || " ",
        estado: u.estado || '',
        created_at: u.created_at || '',
        updated_at: u.updated_at || '',
        perfil: {
          id: u.perfil?.id || 0,
          nome: u.perfil?.nome || "Nenhum"
        }
      }));

      setUsuarios(meusUsuarios);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Header Superior */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <span className="font-bold text-lg tracking-wide">Gerenciamento de Usuários</span>
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
            <h1 className="text-xl font-black text-slate-800">Lista de Usuários</h1>
            <button
              onClick={() => router.push("/reports")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Dashboard
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuários..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              onChange={
                async (e) => {
                  settagtitle(e.target.value);
                  const token = Cookies.get('auth_token') || "";
                  await carregarUsuarios(token, activeFilter); 
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
                    await carregarUsuarios(token, filter);
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

          {/* Lista de Cards de Usuários */}
          <div className="space-y-3">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                onClick={() => router.push(`/usuario/${usuario.id}`)}
                className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-2.5 cursor-pointer hover:border-blue-300 transition active:scale-[0.99]"
              >
                {/* ID, Badge do Perfil Vinculado & Estado */}
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <div className="flex gap-2 items-center">
                    <span className="text-blue-500 font-mono">ID: {usuario.id}</span>
                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      🔑 {usuario.perfil.nome}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    usuario.estado === "ATIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {usuario.estado}
                  </span>
                </div>

                {/* Informações do Usuário (Nome e E-mail) */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                    {usuario.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    {usuario.email}
                  </p>
                </div>

                {/* Rodapé do Card com a data de criação */}
                {usuario.created_at && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <span>📅 Criado em:</span>
                      <span>{formatarData(usuario.created_at)}</span>
                    </div>
                  </div>
                )}

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
            <span className="text-lg">👥</span>
            <span className="text-[10px] font-bold mt-0.5">Usuários</span>
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