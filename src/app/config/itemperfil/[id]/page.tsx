"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface PerfilOpcao {
  id: number;
  nome: string;
}

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ItemPerfilDados {
  idperfil: number;
  nome: string;
  descricao: string;
  ativo: boolean; // Controla se o serviço está ativo ou inativo
}

export default function EditItemPerfilPage() {
  const router = useRouter();
  const params = useParams();

  const [listaPerfis, setListaPerfis] = useState<PerfilOpcao[]>([]);
  const [itemPerfil, setItemPerfil] = useState<ItemPerfilDados>({
    idperfil: 0,
    nome: '',
    descricao: '',
    ativo: true
  });

  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = Cookies.get('auth_token') || "";
    
    const inicializar = async () => {
      // 1. Carrega primeiro as opções do Select
      await carregarPerfis(token);
      // 2. Carrega os dados atuais deste ItemPerfil se houver ID na URL
      if (params.id) {
        await carregarItemPerfil(token, Number(params.id));
      }
    };

    inicializar();
  }, [params.id]);

  // Carrega a listagem de perfis para o Select
  const carregarPerfis = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const dados = await response.json();
        if (Array.isArray(dados)) {
          setListaPerfis(dados.map((p: any) => ({ id: p.id, nome: p.nome })));
        }
      }
    } catch (e) {
      console.error("Erro ao buscar perfis:", e);
    }
  };

  // Carrega os dados atuais do ItemPerfil que está sendo editado
  const carregarItemPerfil = async (token: string, id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const dados = await response.json();

      if (response.ok) {
        setItemPerfil({
          idperfil: dados.idperfil || 0,
          nome: dados.nome || "",
          descricao: dados.descricao || "",
          ativo: dados.ativo !== undefined ? dados.ativo : true
        });
      } else {
        router.push("/tickets");
      }
    } catch (e) {
      console.error("Erro ao carregar itemperfil:", e);
    }
  };

  // 1. Rota: /itemperfil/id (Method: PUT) - Salvar Alterações
  const handleUpdateItemPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('auth_token');
      
      const dadosParaEnviar = {
        idperfil: itemPerfil.idperfil,
        nome: itemPerfil.nome,
        descricao: itemPerfil.descricao
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (response.ok) {
        setPopup({
          isOpen: true,
          title: "Sucesso!",
          message: "Serviço atualizado com sucesso.",
          type: "success",
        });
      } else {
        setPopup({
          isOpen: true,
          title: "Erro ao atualizar",
          message: "Ocorreu um problema ao salvar as modificações.",
          type: "error",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Rota: /itemperfil/id (Method: DELETE) - Desativar
  const handleDesativarItemPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setItemPerfil(prev => ({ ...prev, ativo: false }));
        setPopup({
          isOpen: true,
          title: "Serviço Desativado!",
          message: "O serviço foi inativado no sistema.",
          type: "info",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Rota: /itemperfil/id/reativar (Method: PUT) - Reativar
  const handleReativarItemPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil/${params.id}/reativar`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setItemPerfil(prev => ({ ...prev, ativo: true }));
        setPopup({
          isOpen: true,
          title: "Serviço Reativado!",
          message: "O serviço voltou a ficar ativo no sistema.",
          type: "success",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {/* Popups de Feedback */}
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
            <span className="text-xl">🛠️</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push("/")} className="text-blue-600 text-lg font-bold hover:opacity-75">
              ⬅️
            </button>
            <h1 className="text-base font-black text-slate-800">Editar Serviço</h1>
          </div>

          {/* Status do Serviço */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-blue-500 font-mono">ID Serviço: {params.id}</span>
              <span className={`px-2 py-0.5 rounded-md ${itemPerfil.ativo ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                {itemPerfil.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>

          {/* Botões Ativar / Desativar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!itemPerfil.ativo}
              onClick={handleDesativarItemPerfil}
              className={!itemPerfil.ativo 
                ? "w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed"
                : "w-full text-xs py-2.5 rounded-xl transition shadow-sm bg-rose-500 hover:bg-rose-600 text-white font-bold"
              }
            >
              Desativar
            </button>
            <button
              type="button"
              disabled={itemPerfil.ativo}
              onClick={handleReativarItemPerfil}
              className={itemPerfil.ativo 
                ? "w-full bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed"
                : "w-full text-xs py-2.5 rounded-xl transition shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              }
            >
              Ativar / Reabrir
            </button>
          </div>

          {/* Formulário de Edição */}
          <form className="space-y-4" onSubmit={handleUpdateItemPerfil}>
            
            {/* Vínculo de Perfil */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Perfil Responsável
              </label>
              <div className="relative">
                <select
                  value={itemPerfil.idperfil}
                  onChange={(e) => setItemPerfil({ ...itemPerfil, idperfil: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none appearance-none shadow-sm focus:border-blue-500"
                  required
                >
                  <option value={0}>Selecione um perfil...</option>
                  {listaPerfis.map((perf) => (
                    <option key={perf.id} value={perf.id}>
                      {perf.nome}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-3.5 text-slate-400 text-[10px]">▼</span>
              </div>
            </div>

            {/* Nome do Serviço */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Nome do Serviço
              </label>
              <input
                type="text"
                value={itemPerfil.nome}
                onChange={(e) => setItemPerfil({ ...itemPerfil, nome: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição
              </label>
              <textarea
                rows={4}
                value={itemPerfil.descricao}
                onChange={(e) => setItemPerfil({ ...itemPerfil, descricao: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm resize-none"
                required
              ></textarea>
            </div>

            {/* Salvar */}
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

      </div>
    </div>
  );
}