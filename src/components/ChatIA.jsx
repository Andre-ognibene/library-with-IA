import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Olá! Sou o assistente do Ecossistema Hodie. Como posso ajudar?" }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      
      const historicoRecente = messages.slice(-6);
      
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: userMessage, historico: historicoRecente }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "❌ Erro: " + data.error }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Ops! O servidor está desligado." }]);
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

  // Se estiver fechado, mostra apenas o botão flutuante
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand text-black rounded-full flex items-center justify-center shadow-lg shadow-brand/20 hover:scale-110 transition-all z-50"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  
  return (
    <div className="fixed bottom-8 right-8 w-[380px] h-[550px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-colors duration-300">
      
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-brand" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Bibliotecário</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Mensagens*/}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white dark:bg-zinc-950">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} className="text-brand" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-brand text-black rounded-br-none"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-200 dark:border-zinc-800"
            }`}>
              {msg.role === "user" ? (
                msg.text
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-black dark:text-white" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-1">
              <Bot size={16} className="text-brand" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3">
              <Loader2 size={16} className="animate-spin text-brand" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Caixa de Input */}
      <footer className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 px-2 focus-within:ring-1 ring-brand/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte algo rápido..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none py-2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-brand text-black rounded-lg disabled:opacity-50 hover:scale-105 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
