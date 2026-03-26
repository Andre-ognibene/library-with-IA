import { Book, ChevronRight, Sun, Moon, Upload, Loader2, Bot } from "lucide-react";
import { useRef, useState } from "react";

export default function Sidebar({ modulos, setModuloAtivo, isDark, setIsDark, setTelaAtual }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pastaDestino, setPastaDestino] = useState("Manuais");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const urlBackend = "http://127.0.0.1:5000/upload";
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pasta", pastaDestino);
    setIsUploading(true);

    try {
      const response = await fetch(urlBackend, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("✅ " + data.message);
      } else {
        alert(" Erro: " + data.error);
      }
    } catch (error) {
      alert(" Erro de conexão com o servidor. Ele está ligado?");
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };


  const estiloBotaoPadrao = "flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all font-semibold shadow-sm";

  return (
    <aside className="w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 p-4 hidden md:flex flex-col transition-colors duration-300">
      
      {}
      <div className="flex items-center gap-2 mb-8 px-2 shrink-0">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <Book size={20} className="text-black" />
        </div>
        <span className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
          Biblioteca do Hodie
        </span>
      </div>
      
      {}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {modulos.map((modulo, index) => (
          <button
            key={index}
            onClick={() => setModuloAtivo(modulo)}
            className="w-full flex items-center justify-between p-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:text-brand dark:hover:text-brand transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 group-hover:text-brand">
                {String(modulo.id).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium">{modulo.titulo}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </nav>

      {}
      <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex flex-col gap-3">
        
        <input 
          type="file" 
          accept=".pdf" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
          {}
          <select
            value={pastaDestino}
            onChange={(e) => setPastaDestino(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer"
          >
            <option value="Manuais">Salvar em: Manuais</option>
            <option value="Modulos">Salvar em: Módulos</option>
            <option value="Pasta 4">Salvar em: Pasta 4</option>
            <option value= "Funcionalidades clientes">Salvar em: Funcionalidades clientes </option>
          </select>
        {}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`${estiloBotaoPadrao} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-sm">
            {isUploading ? "Processando IA..." : "Novo Manual PDF"}
          </span>
        </button>
        </div>
        {}

        {}
        <button
          onClick={() => setTelaAtual("chat")}
          className={estiloBotaoPadrao}
        >
          <Bot size={18} />
          <span className="text-sm tracking-wide">
            Bibliotecário
          </span>
        </button>

        {}
        <button
          onClick={() => setIsDark(!isDark)}
          className={estiloBotaoPadrao}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm tracking-wide">
            {isDark ? "Modo Claro" : "Modo Escuro"}
          </span>
        </button>

        {}
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 mt-1">
          <p className="text-[10px] uppercase text-zinc-400 dark:text-zinc-500 font-bold mb-1 tracking-widest">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">IA Conectada</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
