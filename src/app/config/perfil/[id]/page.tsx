"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Interface para estruturar os popups
interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "info" | "error";
}

interface PerfilDados {
  nome: string;
  descricao: string;
  ativo: boolean; // Controla visualmente o estado do perfil
}

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();

  const [perfil, setPerfil] = useState<PerfilDados>({
    nome: '',
    descricao: '',
    ativo: true
  });

  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (params.id) {
      carregarPerfil(token || "", Number(params.id));
    }
  }, [params.id]);

  // Busca os dados iniciais do Perfil para preencher o formulário
  const carregarPerfil = async (token: string, id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const dados = await response.json();
      
      if (response.ok) {
        setPerfil({
          nome: dados.nome || "",
          descricao: dados.descricao || "",
          ativo: dados.ativo !== undefined ? dados.ativo : true
        });
      } else {
        //router.push("/perfil");
        console.log(response)
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 1. Rota: /perfil/id (Method: PUT) - Atualizar dados
  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('auth_token');
      const dadosParaEnviar = {
        nome: perfil.nome,
        descricao: perfil.descricao
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (response.status === 200) {
        setPopup({
          isOpen: true,
          title: "Sucesso!",
          message: "Perfil atualizado com sucesso.",
          type: "success",
        });
      } else {
        setPopup({
          isOpen: true,
          title: "Erro ao atualizar",
          message: "Verifique os dados e tente novamente.",
          type: "error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 2. Rota: /perfil/id (Method: DELETE) - Desativar
  const handleDesativarPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPerfil(prev => ({ ...prev, ativo: false }));
        setPopup({
          isOpen: true,
          title: "Perfil Desativado!",
          message: "O usuário/perfil foi inativado no sistema.",
          type: "info",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 3. Rota: /perfil/id/reativar (Method: PUT) - Reativar
  const handleReativarPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil/${params.id}/reativar`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPerfil(prev => ({ ...prev, ativo: true }));
        setPopup({
          isOpen: true,
          title: "Perfil Reativado!",
          message: "O perfil está ativo novamente.",
          type: "success",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Modal Dinâmico de Popups */}
        {popup.isOpen && (
          <div className="absolute inset-0 w-full h-full z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[290px] p-5 rounded-2xl shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              {popup.type === "success" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 text-xl font-bold border border-emerald-100">✓</div>
              )}
              {popup.type === "error" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-rose-50 text-rose-600 text-xl font-bold border border-rose-100">⚠️</div>
              )}
              {popup.type === "info" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600 text-xl font-bold border border-blue-100">ℹ️</div>
              )}

              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800">{popup.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed px-1">{popup.message}</p>
              </div>

              <button onClick={closePopup} className="w-full text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-100">
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push("/config/perfil")} className="text-blue-600 text-lg font-bold hover:opacity-75">
              ⬅️
            </button>
            <h1 className="text-base font-black text-slate-800">Editar Perfil</h1>
          </div>

          {/* Card informativo do Estado Atual do Perfil */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-blue-500 font-mono">ID Perfil: {params.id}</span>
              <span className={`px-2 py-0.5 rounded-md ${perfil.ativo ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                {perfil.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>

          {/* Grid de Botões: Ativar / Desativar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!perfil.ativo}
              onClick={handleDesativarPerfil}
              className={!perfil.ativo 
                ? "w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed"
                : "w-full text-xs py-2.5 rounded-xl transition shadow-sm bg-rose-500 hover:bg-rose-600 text-white font-bold"
              }
            >
              Desativar
            </button>
            <button
              type="button"
              disabled={perfil.ativo}
              onClick={handleReativarPerfil}
              className={perfil.ativo 
                ? "w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed"
                : "w-full text-xs py-2.5 rounded-xl transition shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              }
            >
              Reabrir / Ativar
            </button>
          </div>

          {/* Formulário de Edição */}
          <form className="space-y-4" onSubmit={handleUpdatePerfil}>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Nome do Perfil
              </label>
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição
              </label>
              <textarea
                rows={4}
                value={perfil.descricao}
                onChange={(e) => setPerfil({ ...perfil, descricao: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm resize-none"
                required
              ></textarea>
            </div>

            {/* Enviar Atualização */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </form>

        </main>

        {/* Menu de Navegação Inferior */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button type="button" onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button type="button" onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button type="button" onClick={() => router.push("/perfil")} className="flex flex-col items-center text-blue-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-bold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}