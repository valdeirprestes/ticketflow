"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "info" | "comment" | "error";
}

export default function NewTicketPage() {
  const params = useParams();
  const router = useRouter();

  // 1. Estados de Dados do Chamado
  const [categoria, setcategoria] = useState('');
  const [idcategoria, setidcategoria] = useState(-1);
  const [titulo, settitulo] = useState('');
  const [Msg, setMsg] = useState('');
  const [priority, setPriority] = useState("Baixa");

  // 2. Estados de arquivo nativo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 3. Estados do Popup e Comentários
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Carregar o chamado inicialmente
  useEffect(() => {
    const token = Cookies.get('auth_token');
    const rodar = async () => await carregarChamado(token, params.id);
    rodar();
  }, [params.id]);

  const buscarChamado = async (token: string, id: any) => {
    try {
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return await response_abertos.json();
    } catch (e) {
      return {};
    }
  };

  const getstatus = (intprioridade: number) => {
    if (intprioridade == 1) return "Baixa";
    if (intprioridade == 2) return "Média";
    return "Alta";
  };

  const carregarChamado = async (token: string, id: any) => {
    const dadoschamado = await buscarChamado(token, id);
    if (!dadoschamado) router.push("/");

    settitulo(dadoschamado.titulo || "");

    if (dadoschamado.servico && dadoschamado.servico.length > 0) {
      setcategoria(dadoschamado.servico[dadoschamado.servico.length - 1].itemperfil.nome);
      setidcategoria(dadoschamado.servico[dadoschamado.servico.length - 1].iditemperfil);
    }
  };

  // Funções de Interação e Simulações de Upload
  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Funções de Controle do Popup


  const handleOpenCommentPopup = () => {
    setNewComment("");
    setPopup({
      isOpen: true,
      title: "Adicionar Comentário",
      message: "Digite abaixo as informações que deseja acrescentar ao chamado:",
      type: "comment",
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    setPopup({
      isOpen: true,
      title: "Comentário Enviado!",
      message: "O seu comentário foi adicionado ao histórico com sucesso.",
      type: "success",
    });
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">

        {popup.isOpen && (
          <div className="absolute inset-0 w-full h-full z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[290px] p-5 rounded-2xl shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {popup.type === "success" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 text-xl font-bold border border-emerald-100">✓</div>
              )}
              {popup.type === "error" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-rose-50 text-rose-600 text-xl font-bold border border-rose-100">✕</div>
              )}
              {popup.type === "info" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600 text-xl font-bold border border-blue-100">🔄</div>
              )}
              {popup.type === "comment" && (
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-blue-50 text-blue-600 text-xl font-bold border border-blue-100">💬</div>
              )}

              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800">{popup.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed px-1">{popup.message}</p>
              </div>

              {popup.type === "comment" ? (
                <div className="space-y-3 text-left">
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva aqui..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white resize-none text-slate-700 font-medium placeholder:text-slate-400 transition"
                  />
                </div>
              ) : (
                <button onClick={closePopup} className={`w-full text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md ${popup.type === "success" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}>Entendido</button>
              )}
            </div>
          </div>
        )}

        <header className="bg-blue-600 text-white px-5 pt-6 pb-5 rounded-b-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <span className="font-bold text-lg tracking-wide">TicketMS</span>
          </div>
          <div className="flex items-center gap-4 text-lg">
            <button className="hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
          </div>
        </header>

        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/tickets/${params.id}`)}
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Voltar</h1>
          </div>

          <span className="text-blue-500 font-mono">Você deseja reabrir o Ticket {params.id}?</span>
          <h2 className="font-black text-sm text-slate-800 leading-tight">{titulo}</h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Categoria
              </label>
              <span className="text-xs text-slate-600 font-medium">{categoria}</span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Mensagem de abertura
              </label>
              <textarea
                value={Msg} // 👈 CORRIGIDO: Vinculado corretamente ao estado
                onChange={(e) => setMsg(e.target.value)} // 👈 CORRIGIDO: Evento adicionado
                rows={4}
                placeholder="Descreva o problema detalhadamente..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Anexar Arquivo
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
              />

              <div
                onClick={handleBoxClick}
                className={`border-2 border-dashed rounded-xl p-6 bg-white text-center cursor-pointer transition ${selectedFile ? "border-blue-500 bg-blue-50/20" : "border-slate-200 hover:bg-slate-50/50"}`}
              >
                {selectedFile ? (
                  <>
                    <span className="text-xl block mb-2">📎</span>
                    <p className="text-xs font-bold text-slate-800 truncate px-4">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Clique para alterar</p>
                  </>
                ) : (
                  <>
                    <span className="text-xl block mb-2">☁️</span>
                    <p className="text-xs font-bold text-blue-600">Toque para anexar arquivos</p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX (máx. 10MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="submit"
                onClick={async (e) => {
                  try {
                    e.preventDefault();
                    const token = Cookies.get('auth_token');
                    const idusuario = Cookies.get('idusuario');
                    let dadosParaEnviar = { status: "ABERTO" };

                    // 👈 CORRIGIDO: Alterado de 'id' para 'params.id'
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado/${params.id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(dadosParaEnviar)
                    });
                    
                    const dados = await response.json();
                    if (response.status != 200) {
                      setPopup({
                        isOpen: true,
                        title: "Chamado Reaberto!",
                        message: "O chamado foi reaberto e já está disponível para a equipe técnica.",
                        type: "error",
                      });
                      return;
                    }
                    

                    let dadosServico = {
                      idchamado: dados.id,
                      iditemperfil: idcategoria,
                    };

                    const response2 = await fetch(`${process.env.NEXT_PUBLIC_API}/servico`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(dadosServico)
                    });
                    
                    const dados2 = await response2.json();
                    if (response2.status != 201) {
                      setPopup({
                        isOpen: true,
                        title: "Não abriu o novo serviço",
                        message: "Não abriu novo serviço  ",
                        type: "error",
                      });
                      return;
                    }

                    

                    let dadosMsg = {
                      idchamado: params.id,
                      texto: Msg
                    };
                    const response3 = await fetch(`${process.env.NEXT_PUBLIC_API}/mensagem`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(dadosMsg)
                    });
                    const dados3 = await response3.json();
                    
                    if (response3.status != 201) {
                      setPopup({
                        isOpen: true,
                        title: "A mensagem não foi enviada!",
                        message: "A mensagem não foi enviada",
                        type: "error",
                      });
                      return;
                    }


                    if (response.status == 200) {
                      setPopup({
                        isOpen: true,
                        title: "Chamado Reaberto!",
                        message: "O chamado foi reaberto e já está disponível para a equipe técnica.",
                        type: "success",
                      });
                    } else {
                      setPopup({
                        isOpen: true,
                        title: "Chamado Reaberto!",
                        message: "O chamado foi reaberto e já está disponível para a equipe técnica.",
                        type: "error",
                      });
                    }
                    //router.push(`/tickets/${params.id}`)
                  } catch (e) {
                    return null;
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Reabrir Chamado
              </button>
            </div>
          </form>
        </main>

        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-semibold mt-0.5">Tickets</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}