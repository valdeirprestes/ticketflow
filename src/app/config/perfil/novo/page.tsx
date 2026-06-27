"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function NewProfilePage() {
  const router = useRouter();
  
  // Estados para o formulário de perfil
  const [nomeState, setNomeState] = useState('');
  const [descricaoState, setDescricaoState] = useState('');

  interface PopupConfig {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }

  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const [meulink, setMeulink] = useState('');

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (meulink) {
      window.location.href = meulink;
    }
  };

  const criarPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');

      if (nomeState.trim() === "") {
        setPopup({
          isOpen: true,
          title: "Erro!",
          message: "Preencha o campo Nome",
          type: "error",
        });
        return;
      }

      if (descricaoState.trim() === "") {
        setPopup({
          isOpen: true,
          title: "Erro!",
          message: "Preencha o campo Descrição",
          type: "error",
        });
        return;
      }

      // Monta o objeto exatamente como solicitado
      let dadosParaEnviar = {
        nome: nomeState,
        descricao: descricaoState
      };

      console.log(dadosParaEnviar);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (response.status !== 201 && response.status !== 200) {
        console.log(response);
        setPopup({
          isOpen: true,
          title: `Erro: status ${response.status}`,
          message: "Não foi possível criar o perfil.",
          type: "error",
        });
        return;
      }

      const dados = await response.json();
      
      setPopup({
        isOpen: true,
        title: "Perfil criado com sucesso!",
        message: `O perfil "${nomeState}" foi gerado corretamente.`,
        type: "success",
      });
      
      // Ajuste o link de redirecionamento se necessário
      setMeulink(`/config/perfil`); 

    } catch (e) {
      console.log(e);
      setPopup({
        isOpen: true,
        title: "Erro de Conexão",
        message: "Houve uma falha ao tentar comunicar com o servidor.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Modal de Popup */}
        {popup.isOpen && (
          <div className="absolute inset-0 w-full h-full z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[290px] p-5 rounded-2xl shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">

              {popup.type === "success" ? (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 text-xl font-bold border border-emerald-100">✓</div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-rose-50 text-red-600 text-xl font-bold border border-red-100">⚠️</div>
              )}

              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800">{popup.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed px-1">{popup.message}</p>
              </div>

              <button 
                onClick={closePopup} 
                className={`w-full text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md ${popup.type === "success" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Header Superior Azul */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button className="hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
          </div>
        </header>

        {/* Formulário */}
        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">

          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/config/perfil")}
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
            ⬅️
            
            </button>
            <h1 className="text-base font-black text-slate-800">Criar Novo Perfil</h1>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

            {/* Nome do Perfil */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Nome do Perfil
              </label>
              <input
                value={nomeState}
                onChange={(e) => setNomeState(e.target.value)}
                type="text"
                placeholder="Ex: RH2"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Descrição do Perfil */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição
              </label>
              <textarea
                value={descricaoState}
                onChange={(e) => setDescricaoState(e.target.value)}
                rows={4}
                placeholder="Ex: Setor de Recursos humanos"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-white border border-blue-500 text-blue-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              > 
                Cancelar
              </button>
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  await criarPerfil();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Salvar Perfil
              </button>
            </div>
          </form>

        </main>

        {/* Menu de Navegação Inferior */}
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
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}