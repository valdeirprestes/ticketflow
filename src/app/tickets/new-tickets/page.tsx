"use client";

import { useState, useRef, useEffect } from "react"; // Importação do useRef adicionada
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function NewTicketPage() {
  const router = useRouter();
  const [lstCategoria, setlstCategoria] = useState([]);
  const [tituloState, settituloState] = useState('');
  const [itemperfilState, settemperfilState] = useState(0);
  const [textoState, settextoState] = useState('');
  

  // 1. Estados e Referências adicionados para gerenciar o arquivo nativo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 2. Função para simular o clique no input oculto
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 3. Função para capturar o arquivo quando selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }

  };
  const getstatus = (intprioridade: number) => {
    if (intprioridade == 1) return "Baixa";
    if (intprioridade == 2) return "Média";
    return "Alta";
  }
  const carregarCategoria = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/itemperfil`, {
        method: 'GET', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const itensperfil = await response.json();

      if (Array.isArray(itensperfil)) {
        const lst = itensperfil.map((itemperfil: any) => (
          {
            id: itemperfil.id || 0,
            title: itemperfil.titulo || " ",
            desc: itemperfil.descricao || " ",
            date: itemperfil.created_at || " ",
            status: itemperfil.status,
            priority: getstatus(itemperfil.prioridade),
            priorityColor: "text-rose-600 bg-rose-50"
          }));

        // Atualiza o estado das atividades recentes com os dados da API
        setlstCategoria(lst);
        //console.log("tickets.length",tickets.length)
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const rodar = async (token: any) => await carregarCategoria(token);
    rodar(token);

  }, [])

  const criarchamado = async () => {
    try {

      const token = Cookies.get('auth_token');
      const idusuario = Cookies.get('idusuario');

      if (tituloState === "") {
        setPopup({
          isOpen: true,
          title: "Erro!",
          message: "Preencha o campo titulo",
          type: "error",
        });
        return;
      }
      
      if (itemperfilState === 0) {
        setPopup({
          isOpen: true,
          title: "Erro!",
          message: "Selecione um serviço",
          type: "error",
        });
        return;
      }

      if (textoState === "") {
        setPopup({
          isOpen: true,
          title: "Erro!",
          message: "Preencha um texto explicando o que precisa",
          type: "error",
        });
        return;
      }

      let dadosParaEnviar = {
        titulo: tituloState,
        servico: {
          iditemperfil: itemperfilState
        },
        mensagem: {
          idusuario: idusuario * 1,
          texto: textoState
        }

      }
      console.log(dadosParaEnviar);
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado`, {
        method: 'POST', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      }
      );

      if (response_abertos.status != 201) {
        console.log(response_abertos);
        setPopup({
          isOpen: true,
          title: `Erro: status ${response_abertos.status}`,
          message: "Preencha um texto explicando o que precisa",
          type: "error",
        });
        return;
      }
      const dados = await response_abertos.json();
      if (selectedFile) {
        const formData = new FormData();
        console.log(selectedFile);
        formData.append("anexo", selectedFile);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/anexodamensagem/${dados.id}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: formData // Passamos o formData diretamente aqui
        });
        console.log(response);
        if (response.status != 201) {
          setPopup({
            isOpen: true,
            title: `Erro de anexagem do arquivo`,
            message: "Foi aberto o ticket ${dados.id}, mas não foi anexo o arquivo",
            type: "error",
          });
          return;
        }

      }
      setPopup({
        isOpen: true,
        title: "Ticket aberto com sucesso!",
        message: `Foi aberto o ticket ${dados.id} para você!`,
        type: "success",
      });
      setmeulink(`/tickets/${dados.id}`);
    } catch (e) {
      console.log(e);
    }
  }


  interface PopupConfig {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "info" | "comment" | "error";
  }

  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Estado para controlar o texto de um NOVO comentário
  const [newComment, setNewComment] = useState("");
  const [meulink, setmeulink] = useState('');


  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (meulink) {
      window.location.href = meulink;
    }

  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newObj: CommentItem = {
      id: Date.now(),
      author: "Usuário Atual",
      date: "Agora mesmo",
      text: newComment,
    };

    // setmensagens((prev) => [...prev, newObj]);

    setPopup({
      isOpen: true,
      title: "Comentário Enviado!",
      message: "O seu comentário foi adicionado ao histórico com sucesso.",
      type: "success",
    });
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
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-rose-50 text-red-600 text-xl font-bold border border-red-100"> 🔄</div>

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
                  <div className="flex gap-2">
                    <button onClick={closePopup} className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition">Cancelar</button>
                    <button onClick={handleSubmitComment} disabled={!newComment.trim()} className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-blue-100">Enviar</button>
                  </div>
                </div>
              ) : (
                <button onClick={closePopup} className={`w-full text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md ${popup.type === "success" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}>Entendido</button>
              )}
            </div>
          </div>
        )}



        {/* Header Superior Azul */}
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

        {/* Formulário */}
        <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto pb-24">

          {/* Título com botão de voltar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-800">Novo Chamado</h1>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

            {/* Título do Chamado */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Título do Chamado
              </label>
              <input
                value={tituloState}
                onChange={(e) => settituloState(e.target.value)}
                type="text"
                placeholder="Ex: Erro ao acessar o sistema"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Serviço
              </label>
              <div className="relative">
                <select
                  value={itemperfilState}
                  onChange={(e) => settemperfilState(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-500 outline-none appearance-none shadow-sm focus:border-blue-500">
                  <option >Escolha um serviço</option>
                  {lstCategoria.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>{categoria.desc}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-3.5 text-slate-400 text-[10px]">▼</span>
              </div>
            </div>



            {/* Descrição */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Descrição
              </label>
              <textarea
                value={textoState}
                onChange={(e) => settextoState(e.target.value)}
                rows={4}
                placeholder="Descreva o problema detalhadamente..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Anexar Arquivo — Atualizado e Funcional */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Anexar Arquivo
              </label>

              {/* O input HTML real fica invisível aqui através da classe hidden */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
              />

              {/* A caixa estilizada agora escuta o evento de clique */}
              <div
                onClick={handleBoxClick}
                className={`border-2 border-dashed rounded-xl p-6 bg-white text-center cursor-pointer transition ${selectedFile ? "border-blue-500 bg-blue-50/20" : "border-slate-200 hover:bg-slate-50/50"
                  }`}
              >
                {selectedFile ? (
                  <>
                    <span className="text-xl block mb-2">📎</span>
                    <p className="text-xs font-bold text-slate-800 truncate px-4">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Clique para alterar
                    </p>
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

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full bg-white border border-blue-500 text-blue-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              > Cancelar
              </button>
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  await criarchamado();
                  //router.push("/tickets/new-tickets/success");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition"
              >
                Enviar Chamado
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
          <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}