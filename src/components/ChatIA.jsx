import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Loader2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown"; 

export default function ChatIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Olá! Sou o assistente do Ecossistema Hodie. Como posso ajudar?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response || data.error }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Erro de conexão com o servidor Python." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-colors">
          
          {/* Header */}
          <div className="bg-zinc-100 dark:bg-zinc-900 p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 transition-colors">
            <span className="flex items-center gap-2 uppercase tracking-tighter font-bold text-zinc-900 dark:text-white">
              <Bot size={18} className="text-brand dark:text-white"/>Bibliotecário
            </span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors" />
            </button>
          </div>
          
          {/* Área de Mensagens */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md transition-colors ${
                  msg.role === 'user' 
                  ? 'bg-brand text-black font-bold rounded-tr-none border border-brand/50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' 
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-none' 
                }`}>
                  <div className={`space-y-3 ${msg.role === 'user' ? 'dark:text-white' : 'text-zinc-800 dark:text-white'}`}>
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-5 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-5 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-extrabold text-zinc-900 dark:text-white" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && <Loader2 className="animate-spin text-brand mx-auto" />}
          </div>

          {/* Input de Texto */}
          <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors">
            <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent px-2 text-sm outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
                placeholder="Pergunte algo..." 
              />
              <button onClick={handleSend} className="bg-brand p-2 rounded-lg hover:scale-105 transition-all shadow-sm">
                <Send size={18} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Botão Flutuante Principal */
        <button onClick={() => setIsOpen(true)} className="bg-white dark:bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-zinc-100 dark:border-zinc-800 hover:scale-110 transition-all">
          <MessageSquare size={30} className="text-brand dark:text-white" />
        </button>
      )}
    </div>
  );
}