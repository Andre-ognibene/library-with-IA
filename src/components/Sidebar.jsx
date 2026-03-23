import { Book, ChevronRight, Sun, Moon } from "lucide-react"; 


export default function Sidebar({ modulos, setModuloAtivo, isDark, setIsDark }) {
  return (
    <aside className="w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 p-4 hidden md:flex flex-col transition-colors duration-300">
      
      {/* Topo: Logo */}
      <div className="flex items-center gap-2 mb-8 px-2 shrink-0">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <Book size={20} className="text-black" />
        </div>
        <span className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
          Biblioteca do Hodie
        </span>
      </div>
      
      {/* Centro: Navegação */}
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

      {/* Base: Controles e Status */}
      <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex flex-col gap-4">
        
        {/* O NOVO BOTÃO DE TEMA ESTÁ AQUI */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-800 hover:border-brand/50"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Sun size={18} className="text-brand" /> : <Moon size={18} className="text-brand" />}
            <span className="text-sm font-semibold tracking-wide">
              {isDark ? "Modo Claro" : "Modo Escuro"}
            </span>
          </div>
        </button>

        {/* Status do Sistema */}
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
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