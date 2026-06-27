"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function HomeDashboardPage() {
  const router = useRouter();

  const [nome, setnome] = useState('');
  const [idusuario, setidusuario] = useState(-1);
  const [idperfil, setidperfil] = useState(0);
  const [qtd_aberto, setqtd_aberto] = useState(0);
  const [qtd_andamento, setqtd_andamento] = useState(0);
  const [qtd_fechado, setqtd_fechado] = useState(0);
  const [mensagens, setmensagens] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const token = Cookies.get('auth_token');



    // Se não tiver token, manda de volta para o login de forma segura
    if (!token) {
      router.push("/login");
      return;
    }

    // Recupera os valores salvos nos cookies
    const nomeSalvo = Cookies.get('nome');
    const idUsuarioSalvo = Cookies.get('idusuario');
    const idPerfilSalvo = Cookies.get('idperfil');


    // Atualiza os estados para atualizar o HTML na tela
    if (nomeSalvo) setnome(nomeSalvo);
    if (idUsuarioSalvo) setidusuario(Number(idUsuarioSalvo));
    if (idPerfilSalvo) setidperfil(idPerfilSalvo*1);
    count_chamado(token, "ABERTO", setqtd_aberto);
    count_chamado(token, "ANDAMENTO", setqtd_andamento);
    count_chamado(token, "FECHADO", setqtd_fechado);

    const carregarMesagens = async (iduser: number) => {
      const dadosmgs = await ultimoTresMensagem(token, iduser);
      setmensagens(dadosmgs);
      if (Array.isArray(dadosmgs)) {
        const atividadesFormatadas = dadosmgs.map((msg: any) => ({
          id: msg.id || Math.random(), // Garante um ID único para o React
          type: "comment",             // Tipo fixo ou baseado em alguma regra sua
          title: msg.chamado.titulo || "Nova mensagem recebida",
          desc: msg.texto || "Clique para ver detalhes", // O texto da mensagem
          icon: "💬",                  // Ícone padrão para mensagens
          color: "bg-sky-50 text-sky-600"
        }));

        // Atualiza o estado das atividades recentes com os dados da API
        setRecentActivities(atividadesFormatadas);
      }
    }
    carregarMesagens(idUsuarioSalvo);

  }, []);
  const count_chamado = async (token: string, status: string, func: Function) => {
    try {
      let filtro = { status: status };
      const query = new URLSearchParams(filtro as any).toString();
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado/count?${query}`, {
        method: 'GET', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      );
      const dados = await response_abertos.json();
      func(dados.quantidade);
    } catch (e) {
      func(0);
    }
  }

  const ultimoTresMensagem = async (token: string, iduser: number) => {
    try {
      let filtro = { idusuario: iduser * 1, qtdpagina: 3, pagina: 1 };
      const query = new URLSearchParams(filtro as any).toString();
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/mensagem?${query}`, {
        method: 'GET', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      );
      const dados = await response_abertos.json();
      return dados;
    } catch (e) {
      return [];
    }
  }



  /*const [recentActivities] = useState([
    { id: 1, type: "update", title: "Ticket #1042 atualizado", desc: "Problema de rede • Há 10 min", icon: "💻", color: "bg-blue-50 text-blue-600" },
    { id: 2, type: "comment", title: "Novo comentário no #1033", desc: "Falha no sistema • Há 1 hora", icon: "💬", color: "bg-sky-50 text-sky-600" },
    { id: 3, type: "resolved", title: "Ticket #1028 resolvido", desc: "Acesso VPN • Há 3 horas", icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  ]);*/

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
              <button
                onClick={
                  () => {
                    document.cookie = "auth_token=;idperfil=;idusuario=; nome=; path=/; max-age=0; SameSite=Strict; Secure";
                    setnome("");
                    setidperfil(-1);
                    setidusuario(-1);
                    router.push("/login")
                  }
                }>
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
            <h1 className="text-xl font-bold">Olá, {nome}</h1>
            <p className="text-xs text-blue-100 mt-0.5">Bem-vindo ao painel de controle</p>
          </div>
        </header>

        {/* Conteúdo com Scroll se necessário */}
        <main className="flex-1 px-4 py-5 space-y-5 overflow-y-auto pb-24">

          {/* Grid de Botões Principais */}
          <div className="grid grid-cols-2 gap-3">

            <button
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/config/perfil")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">👤</span>
              <span className="font-bold text-xs text-slate-800">Perfil</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Cadastro de perfil de usuários</span>
            </button>

            <button
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/config/itemperfil")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">📦</span>
              <span className="font-bold text-xs text-slate-800">Item perfil</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Cadastro de serviços para o perfil</span>
            </button>

            <button
              className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center text-center transition active:scale-95"
              onClick={() => router.push("/config/usuario")}
            >
              <span className="text-xl bg-blue-50 text-blue-600 p-2.5 rounded-full mb-2">👥</span>
              <span className="font-bold text-xs text-slate-800">Usuários</span>
              <span className="text-[10px] text-slate-400 mt-0.5">dados e perfil</span>
            </button>

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