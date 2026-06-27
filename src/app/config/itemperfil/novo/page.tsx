"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface PerfilOpcao {
  id: number;
  nome: string;
}

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
}

export default function NewItemPerfilPage() {
  const router = useRouter();
  
  // Estados para o formulário
  const [listaPerfis, setListaPerfis] = useState<PerfilOpcao[]>([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState<number>(0);
  const [nomeState, setNomeState] = useState('');
  const [descricaoState, setDescricaoState] = useState('');
  const [prioridadeState, setPrioridadeState] = useState<number>(1);

  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const [meulink, setMeulink] = useState('');

  // Carrega os perfis disponíveis para o Select ao montar a página
  const carregarPerfisDisponiveis = async (token: string) => {
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
      console.error("Erro ao carregar perfis:", e);
    }
  };

  useEffect(() => {
    const token = Cookies.get('auth_token') || "";
    carregarPerfisDisponiveis(token);
  }, []);

  const criarItemPerfil = async () => {
    try {
      const token = Cookies.get('auth_token');

      // Validações básicas
      if (perfilSelecionado === 0) {
        setPopup({ isOpen: true, title: "Erro!", message: "Selecione um Perfil para vincular.", type: "error" });
        return;
      }
      if (nomeState.trim() === "") {
        setPopup({ isOpen: true, title: "Erro!", message: "Preencha o campo Nome.", type: "error" });
        return;
      }
      if (descricaoState.trim() === "") {
        setPopup({ isOpen: true, title: "Erro!", message: "Preencha o campo Descrição.", type: "error" });
        return;
      }
      if (prioridadeState < 1 || prioridadeState > 3) {
        setPopup({ isOpen: true, title: "Erro!", message: "A prioridade deve ser entre 1 e 3.", type: "error" });
        return;
      }

      // Objeto formatado exatamente conforme o JSON solicitado
      let dadosParaEnviar = {
        idperfil: perfilSelecionado,
        nome: nomeState,
        descricao: descricaoState,
        prioridade: prioridadeState
      };

      console.log("Enviando dados:", dadosParaEnviar);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil`, {
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
          message: "Não foi possível criar o item de perfil.",
          type: "error",
        });
        return;
      }

      setPopup({
        isOpen: true,
        title: "Serviço criado com sucesso!",
        message: `O serviço "${nomeState}" foi adicionado com sucesso.`,
        type: "success",
      });
      
      setMeulink("/config/itemperfil"); // Defina para onde deseja redirecionar

    } catch (e) {
      console.error(e);
      setPopup({ isOpen: true, title: "Erro", message: "Falha ao comunicar com o servidor.", type: "error" });
    }
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (meulink) {
      router.push(meulink);
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
            <span className="text-xl">🛠️</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
        </header>

        {/* Formulário */}
        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push("/")} className="text-blue-600 text-lg font-bold hover:opacity-75">
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Novo Serviço (ItemPerfil)</h1>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

            {/* Select Perfil (Vínculo Dinâmico) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Vincular ao Perfil Responsável
              </label>
              <div className="relative">
                <select
                  value={perfilSelecionado}
                  onChange={(e) => setPerfilSelecionado(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none appearance-none shadow-sm focus:border-blue-500"
                >
                  <option value={0}>Selecione um perfil...</option>
                  {listaPerfis.map((perfil) => (
                    <option key={perfil.id} value={perfil.id}>
                      {perfil.nome} (ID: {perfil.id})
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-3.5 text-slate-400 text-[10px]">▼</span>
              </div>
            </div>

            {/* Nome do ItemPerfil */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Nome do Serviço
              </label>
              <input
                value={nomeState}
                onChange={(e) => setNomeState(e.target.value)}
                type="text"
                placeholder="Ex: Manutenção 1"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição do Serviço
              </label>
              <textarea
                value={descricaoState}
                onChange={(e) => setDescricaoState(e.target.value)}
                rows={3}
                placeholder="Ex: Manutenção simples"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Prioridade (1 a 5) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Prioridade (De 1 a 3)
              </label>
              <input
                value={prioridadeState}
                onChange={(e) => setPrioridadeState(Number(e.target.value))}
                type="number"
                min={1}
                max={5}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none focus:border-blue-500 shadow-sm"
              />
              <p className="text-[10px] text-slate-400 mt-1">1 = Mais Baixa, 3 = Mais Alta</p>
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
                  await criarItemPerfil();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Cadastrar Serviço
              </button>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
}