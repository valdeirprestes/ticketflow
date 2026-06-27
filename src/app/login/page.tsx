"use client";



import { redirect, useRouter } from "next/navigation"; // 1. Importa o roteador do Next.js
import { NextResponse } from "next/server";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export default function LoginPage() {
  const router = useRouter(); // 2. Inicializa o roteador
  const [nome, setnome] = useState('');
  const [idusuario, setidusuario] = useState(-1);
  const [idperfil, setidperfil] = useState('');
  const token = Cookies.get('auth_token');
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      router.push("/");
    }
  }, [router]);
  // 3. Função que lida com o clique de login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const senha = formData.get("senha");

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/token`, {
        method: 'POST', // Define o método HTTP correto
        headers: {
          'Content-Type': 'application/json', // Avisa a API que você está enviando JSON
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          senha: senha // enviando a senha que o usuário digitou
        })
      }
      );
      const data = await response.json();

      if (response.status != 200) {
        let { errors } = data;

        errors.map((e: string) => console.log(e.reason));
        setPopup({
          isOpen: true,
          title: "Erro de login!",
          message: "Por favor entrar com email e senha novamene.",
          type: "error",
        });
        return;
      } else {
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`
        document.cookie = `idusuario=${data.id}; path=/; max-age=86400; SameSite=Strict; Secure`
        document.cookie = `idperfil=${data.idperfil}; path=/; max-age=86400; SameSite=Strict; Secure`
        document.cookie = `nome=${data.nome}; path=/; max-age=86400; SameSite=Strict; Secure`

        setnome(data.nome);
        setidusuario(data.id);
        setidperfil(data.idperfil);
        //return NextResponse.redirect(new URL('/'))
        router.push("/");
      }

    } catch (error) {
      console.log("Erro!", error);
      //return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
    }
    // Aqui no futuro você colocará a validação de e-mail e senha.
    // Por enquanto, ele vai direto para a tela inicial:


  };


  interface PopupConfig {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "info" | "comment" | "error";
  }

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

  // Estados para controle da edição em linha
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
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


  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">


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






        {/* Cabeçalho do Formulário */}
        <div className="text-center mb-8">
          <span className="text-3xl">🎫</span>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">TicketFlow</h1>
          <p className="text-sm text-slate-500 mt-1">Sistema de gerenciamento de tickets</p>
        </div>

        {/* Mensagem de Boas-vindas */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-700">Bem-vindo!</h2>
          <p className="text-sm text-slate-400">Inicie sessão na sua conta para continuar.</p>
        </div>

        {/* Formulário de Login */}
        <form className="space-y-4" onSubmit={handleLogin}> {/* 4. Chama a função de login aqui */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="seuemail@gmail.com"
              className=" email w-full rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="senha"
              placeholder="sua senha"
              className="senha w-full rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Esqueceu sua senha?
          </button>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-200"
          >
            Login
          </button>
        </form>

        {/* Rodapé */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Não tem uma conta? <a href="#" className="text-blue-600 font-medium hover:underline">Contate Administrador</a>
        </div>

      </div>
    </main>
  );
}