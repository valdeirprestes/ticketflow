"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Linha corrigida aqui!
import Cookies from "js-cookie";


// Interface para estruturar os popups
interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "info" | "comment" | "error";
}

// Interface para estruturar os comentários dinâmicos
interface MensagemItem {
  id: number;
  author: string;
  date: string;
  text: string;
}

interface AnexoItem {
  idmsg: number;
  url: string;
  nome: string;
}
interface ChamadoDados {
  status: string;
  titulo: string;
  categoria: string;
  prioridade: string;
  create: string;
  update: string;
  responsavel: string;
  solicitante: string;
  inativarbbClose: Boolean;
  inativarbbReOpen: Boolean;
  inativarbbAnexar: Boolean;
  inativarbbComentar: Boolean;
  primeiramensagem: string;
}



export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [chamado, setchamado] = useState<ChamadoDados>({
    status: '',
    titulo: '',
    categoria: '',
    prioridade: '',
    create: '',
    update: '',
    responsavel: '',
    solicitante: '',
    inativarbbClose: false,
    inativarbbReOpen: false,
    inativarbbAnexar: false,
    inativarbbComentar: false,
    primeiramensagem: ''
  })




  // Estado para os popups
  const [popup, setPopup] = useState<PopupConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Estado para controlar o texto de um NOVO comentário
  const [newComment, setNewComment] = useState("");

  // Lista de comentários dinâmica
  const [mensagens, setmensagens] = useState<MensagemItem[]>([]);

  const [anexos, setanexos] = useState<AnexoItem[]>([]);

  const [nota, setNota] = useState<number>(-1);

  // Estados para controle da edição em linha
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [Novamsg, setNovamsg] = useState("");
  useEffect(() => {
    const token = Cookies.get('auth_token');
    const rodar = async () => await carregarChamado(token, params.id);
    rodar();
  }, [params.id]);


  const buscarChamado = async (token: string, id: number) => {
    try {
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado/${id}`, {
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
      return {};
    }
  }



  const criarMensagem = async (token: string, idchamado: number, texto: string) => {
    try {
      let dadosParaEnviar = {
        idchamado: idchamado,
        texto: texto
      }
      const response_abertos = await fetch(`${process.env.NEXT_PUBLIC_API}/mensagem`, {
        method: 'POST', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      }
      );
      const dados = await response_abertos.json();
      if (selectedFile) {
        const formData = new FormData();
        
        formData.append("anexo", selectedFile);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/anexodamensagem/${dados.id}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: formData // Passamos o formData diretamente aqui
        });
        
      }
      return dados;
    } catch (e) {
      return null;
    }
  }






  const renderizarIconeArquivo = (nomeArquivo: string) => {
    const extensao = nomeArquivo.split('.').pop()?.toLowerCase();

    switch (extensao) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <span className="text-base">🖼️</span>; // ou <Image /> se usar Lucide
      case 'pdf':
        return <span className="text-base">📕</span>;
      case 'zip':
      case 'rar':
        return <span className="text-base">📦</span>;
      default:
        return <span className="text-base">📄</span>; // Ícone padrão
    }
  };







  const getstatus = (intprioridade: number) => {
    if (intprioridade == 1) return "Baixa";
    if (intprioridade == 2) return "Média";
    return "Alta";
  }

  const carregarChamado = async (token: string, id: number) => {

    const dadoschamado = await buscarChamado(token, id);
    if (!dadoschamado) router.push("/");
    let titulo, status, categoria, prioridade, create, update, responsavel, solicitante;

    titulo = dadoschamado.titulo || "titulo";
    let servico = dadoschamado.servico[dadoschamado.servico.length - 1] || "";
    if (dadoschamado.status === "ANDAMENTO") status = "Em Andamento";
    else if (dadoschamado.status === "ABERTO") status = "Aberto";
    else if (dadoschamado.status === "FECHADO") status = "Fechado";
    categoria = servico.itemperfil.nome || "nomerrado";
    prioridade = getstatus(dadoschamado.prioridade || "prioridaderrado");
    create = dadoschamado.updated_at;
    update = dadoschamado.updated_at;

    responsavel = servico.itemperfil.perfil.nome || 'nomeerradoperfil';
    solicitante = dadoschamado.usuario.nome;

    let inativarbbClose, inativarbbAnexar, inativarbbComentar, inativarbbReOpen;
    
    let primeiramensagem = dadoschamado.mensagem[0].texto || '';

    if (dadoschamado.status == "FECHADO") {
      inativarbbClose = true;
      inativarbbAnexar = true;
      inativarbbComentar = true;
      inativarbbReOpen = false;

    } else {
      inativarbbClose = false;
      inativarbbAnexar = false;
      inativarbbComentar = false;
      inativarbbReOpen = true;
    }

    setchamado({
      status: status,
      titulo: titulo,
      categoria: categoria,
      prioridade: prioridade,
      create: new Date(create).toLocaleString('pt-BR'),
      update: new Date(update).toLocaleString('pt-BR'),
      responsavel: responsavel,
      solicitante: solicitante,
      inativarbbClose: inativarbbClose,
      inativarbbReOpen: inativarbbReOpen,
      inativarbbAnexar: inativarbbAnexar,
      inativarbbComentar: inativarbbComentar,
      primeiramensagem: primeiramensagem
    })
    let listaanexo: any[] = [];
    if (dadoschamado.mensagem.length > 0) {

      const minhamsg = dadoschamado.mensagem.map((msg: any) => {
        let tmp = msg.anexo.map((an: any) => (
          {
            idmsg: msg.id,
            url: an.url,
            nome: an.nomeoriginal
          }
        ));
        listaanexo = [...listaanexo, tmp]
        return {
          id: msg.id,
          author: msg.usuario?.nome,
          date: new Date(msg.created_at).toLocaleString('pt-BR'),
          text: msg.texto,
        }
      }

      );

      setmensagens(minhamsg);
      setanexos(listaanexo);
    }

  }

  const handleCloseTicket = async () => {
    try {

      if (selectedFile) {
        if (Novamsg == "") {
          setPopup({
            isOpen: true,
            title: "Erro ao anexar o arquivo!",
            message: "Se for anexar o arquivo deixe alguma mensagem",
            type: "error",
          });
          return;
        }
      }

      if (nota < 0) {
        setPopup({
          isOpen: true,
          title: "Erro ao fechar o chamado!",
          message: "Avalie o serviço antes de fechar o chamado.",
          type: "error",
        });
        return;
      }

      const token = Cookies.get('auth_token');
      let dadosParaEnviar;
      let dados ;
      if (Novamsg != "") {
        dadosParaEnviar = { idchamado: params.id, texto: Novamsg };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/mensagem`, {
          method: 'POST', // Define o método HTTP correto
          headers: {
            'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dadosParaEnviar)
        });
        dados = await response.json();
        if (selectedFile) {
          const formData = new FormData();
          
          formData.append("anexo", selectedFile);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/anexodamensagem/${dados.id}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: formData // Passamos o formData diretamente aqui
          });
          
        }
      }

      //Quando fechao o chamado a API fechado todos os serviços aberto com a nota do fechamento 
      dadosParaEnviar = {
        status: "FECHADO",
        avaliacao : nota
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/chamado/${params.id}`, {
        method: 'PUT', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnviar)
      });
      
      dados = await response.json();
      
      
      if (response.status == 200) {
        setPopup({
          isOpen: true,
          title: "Chamado fechado com sucesso!",
          message: "O chamado foi fechado com sucesso em nosso sistema.",
          type: "success",
        });
        setmeulink(`/tickets/${dados.id}`);
      } else {
        setPopup({
          isOpen: true,
          title: dados.title,
          message: dados.detail,
          type: "error",
        });

      }

      //router.refresh();
    } catch (e) {
      setPopup({
        isOpen: true,
        title: "Ocorreu um erro!",
        message: "O chamado não foi fechado com sucesso em nosso sistema.",
        type: "error",
      });
      return;
    }


  };

  const handleReopenTicket = () => {
    setPopup({
      isOpen: true,
      title: "Chamado Reaberto!",
      message: "O chamado foi reaberto e já está disponível para a equipe técnica.",
      type: "info",
    });
  };

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

    const newObj: CommentItem = {
      id: Date.now(),
      author: "Usuário Atual",
      date: "Agora mesmo",
      text: newComment,
    };

    setmensagens((prev) => [...prev, newObj]);

    setPopup({
      isOpen: true,
      title: "Comentário Enviado!",
      message: "O seu comentário foi adicionado ao histórico com sucesso.",
      type: "success",
    });
  };


  const [meulink, setmeulink] = useState('');

  const handleStartEdit = (comment: MensagemItem) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return;

    setmensagens((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: editText } : item))
    );

    setEditingCommentId(null);
    setEditText("");
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (meulink) {
      window.location.href = meulink;
    }
  };

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
                <div className="mx-auto flex items-center justify-center h-11 w-11 rounded-full bg-rose-50 text-rose-600 text-xl font-bold border border-blue-100">🔄</div>
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

        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/tickets/${params.id}`)}
              className="text-blue-600 text-lg font-bold hover:opacity-75"
            >
              ⬅️
            </button>
            <h1 className="text-base font-black text-slate-800">Retornar ao ticket {params.id}</h1>
          </div>




          <h1 className="text-base font-black text-slate-800">Tem certeza que deseja fechar ticket {params.id}?</h1>
          <div className="grid grid-cols-2 gap-2">




            <button
              disabled={chamado.inativarbbClose}
              onClick=
              {handleCloseTicket}
              className={
                chamado.inativarbbClose ?
                  "w-full bg-blue border  border-blue-200 text-blue-600 font-bold text-xs py-2.5 rounded-xl transition shadow-sm cursor-not-allowed" :
                  "w-full text-xs py-2.5 rounded-xl transition shadow-sm bg-rose-500 hover:bg-rose-600 text-white"


              }>Fechar
            </button>

          </div>






          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-blue-500 font-mono">Ticket {params.id}</span>
              <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{chamado.status}</span>
            </div>

            <h2 className="font-black text-sm text-slate-800 leading-tight">{chamado.titulo}</h2>

            <div className="text-[11px] space-y-2 pt-1 border-t border-slate-50">
              <div className="flex justify-between"><span className="text-slate-400">Categoria</span><span className="font-bold text-slate-700">{chamado.categoria}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Prioridade</span><span className="font-bold text-rose-600">{chamado.prioridade}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Criado em</span><span className="font-medium text-slate-700">{chamado.create}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Última atualização</span><span className="font-medium text-slate-700">{chamado.update}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Responsável</span><span className="font-bold text-slate-700">{chamado.responsavel}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Solicitante</span><span className="font-bold text-slate-700">{chamado.solicitante}</span></div>
            </div>
          </div>


          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-700">
                Avalie o atendimento (0 a 5)
              </label>
              <span className="text-xs font-black bg-blue-50 text-blue-650 px-2 py-0.5 rounded-md font-mono">
                Nota: {nota}
              </span>
            </div>

            {/* Container das estrelas interativas */}
            <div className="flex items-center gap-1.5 pt-1 justify-center bg-slate-50/50 py-3 rounded-xl border border-slate-100">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  // Altera o estado ao clicar na estrela correspondente
                  onClick={() => setNota(estrela)}
                  className="transition-transform active:scale-95 duration-100 p-0.5"
                >
                  <span
                    className={`text-2xl transition-colors duration-150 ${estrela <= nota
                      ? "text-amber-400 filter drop-shadow-[0_1px_1px_rgba(245,158,11,0.2)]"
                      : "text-slate-300 grayscale opacity-40"
                      }`}
                  >
                    ★
                  </span>
                </button>
              ))}

              {/* Botão de reset rápido para nota 0, caso o usuário queira limpar */}
              {nota > 0 && (
                <button
                  type="button"
                  onClick={() => setNota(0)}
                  className="text-[10px] text-slate-400 hover:text-rose-500 font-bold ml-2 transition"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>




          <div >
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Nova mensagem
            </label>
            <textarea
              name="texto"
              onChange={(e) => setNovamsg(e.target.value)}
              rows={4}
              placeholder="Descreva o problema detalhadamente..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 outline-none placeholder-slate-400 focus:border-blue-500 shadow-sm resize-none"
            ></textarea>
          </div>

          {/* Anexar Arquivo — Atualizado e Funcional */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Anexar Arquivo na mensagem
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
                  <p className="text-xs font-bold text-blue-600">Toque para anexar arquivos</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX (máx. 10MB)</p>
                </>
              )}
            </div>
          </div>

        </main>

        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-4 rounded-t-xl z-10">
          <button onClick={() => router.push("/")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-semibold mt-0.5">Início</span>
          </button>
          <button onClick={() => router.push("/tickets")} className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🎟️</span>
            <span className="text-[10px] font-bold mt-0.5">Tickets</span>
          </button>
          <button onClick={() => router.push("/profile")} className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <span className="text-lg">👤</span>
            <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
          </button>
        </nav>

      </div >
    </div >
  );
}
