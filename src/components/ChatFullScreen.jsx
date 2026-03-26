import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Recebemos uma função "onBack" para voltar para a tela principal
export default function ChatFullScreen({ onBack }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Olá! Sou o Bibliotecário do Hodie. Como posso ajudar você com os manuais hoje?" }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll suave
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(""); 
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Pega as últimas 6 mensagens do chat para a IA "lembrar" do contexto recente
      const historicoRecente = messages.slice(-6);

      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // AGORA ENVIAMOS A PERGUNTA E O HISTÓRICO JUNTOS
        body: JSON.stringify({ 
          pergunta: userMessage,
          historico: historicoRecente 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "❌ Erro: " + data.error }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Ops! O servidor da IA parece estar desligado." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Header Fixo */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span>Voltar à Biblioteca</span>
        </button>
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-brand" />
          <h1 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">Bibliotecário</h1>
        </div>
        <div className="w-40"></div> {/* Espaçador para centralizar o título */}
      </header>

      {/* Área Central de Mensagens */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-4 overflow-hidden">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === "user" ? "bg-zinc-200 dark:bg-zinc-800" : "bg-brand/10 text-brand border border-brand/20"
              }`}>
                {msg.role === "user" ? <User size={20} className="text-zinc-600 dark:text-zinc-300" /> : <Bot size={20} />}
              </div>

              {/* Mensagem */}
              <div className="flex-1 space-y-2 overflow-hidden">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {msg.role === "user" ? "Você" : "Bibliotecário"}
                </span>
                
                {/* O Renderizador de Markdown */}
                <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm overflow-hidden">
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                   
                    <div className="space-y-4">
                      <ReactMarkdown
                        components={{
                          strong: ({node, ...props}) => <strong className="font-bold text-zinc-900 dark:text-white" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                          code({node, inline, className, children, ...props}) {
                            return !inline ? (
                              <span className="block bg-zinc-900 dark:bg-black border border-zinc-800 rounded-xl p-4 overflow-x-auto my-2 shadow-sm">
                                <code className="text-zinc-300 font-mono text-xs" {...props}>
                                  {children}
                                </code>
                              </span>
                            ) : (
                              <code className="bg-brand/10 text-brand px-1.5 py-0.5 rounded-md font-mono text-xs font-bold" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Estado de Carregamento */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 mt-1">
                <Bot size={20} />
              </div>
              <div className="flex-1 space-y-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Bibliotecário</span>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Loader2 size={16} className="animate-spin text-brand" />
                  <span className="text-sm">Consultando manuais...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Centralizado no Rodapé */}
      <footer className="p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 dark:from-zinc-950 dark:via-zinc-950 to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm focus-within:ring-2 ring-brand/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pergunte ao Bibliotecário..."
              className="w-full max-h-48 min-h-[44px] bg-transparent text-zinc-900 dark:text-zinc-100 outline-none resize-none p-3 custom-scrollbar text-sm"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-brand text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shrink-0 mb-1"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-4">
            A IA pode cometer erros. Verifique as fontes listadas nas respostas.
          </p>
        </div>
      </footer>

    </div>
  );
}