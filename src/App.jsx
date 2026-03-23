import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatIA from "./components/ChatIA";
import "./index.css";

const MODULOS = [
  { id: 1, titulo: "Hodie", desc: "Suíte modular de monitoramento logístico.", textoPrevio: "O HODIE é uma suíte modular que controla os processos logísticos, desde a colocação do pedido, até a entrega ou devolução. É a mais completa suíte de aplicativos para controle e monitoramento de entregas.", docs: [{ nome: "manual_do_hodie.pdf" }] },
  { id: 2, titulo: "Hodie Reversa", desc: "Gestão inteligente de devoluções e logística reversa.", textoPrevio: "O Hodie Reversa é um sistema completo para controle e visibilidade das solicitações de devolução, capaz de direcionar cada solicitação para fluxos customizáveis com etapas específicas, restrições e controles. Desde a solicitação do cliente até a destinação final do produto.", docs: [{ nome: "setup_reversa.pdf" }] },
  { id: 3, titulo: "Hodie Booking", desc: "Agendamento e reserva de janelas de carga/descarga.", textoPrevio: "O Hodie Booking é um portal Web responsável pelo controle de docas e pátios, agendamentos e monitoramento das cargas e controle de transferências entre centros de distribuição. É uma solução completa para otimizar o fluxo de veículos e cargas na sua operação.", docs: ["booking_docs.pdf"] },
  { id: 4, titulo: "Gateway", desc: "Integração e barramento de dados entre sistemas.", textoPrevio: "A ponte de comunicação que conecta o ecossistema Hodie com ERPs externos.", docs: [{ nome: "api_gateway.pdf" }] },
  { id: 5, titulo: "HodieKPI", desc: "Dashboards e indicadores de performance logística.", textoPrevio: "Transforme dados brutos em decisões estratégicas com painéis de controle dinâmicos.", docs: [{ nome: "indicadores.pdf" }] },
  { id: 6, titulo: "HodieAPP", desc: "Interface móvel para gestão de armazém e operações.", textoPrevio: "O HodieApp é um aplicativo mobile disponível para Android e iOS gratuitamente e de fácil instalação, funcionando de forma integrada ao portal HodieWeb. Todos os dados compartilhados no HodieWeb são sincronizados automaticamente no aplicativo.", docs: [{ nome: "app_v3_guia.pdf" }] },
  { id: 7, titulo: "App do motorista", desc: "Jornada do motorista e comprovantes de entrega.", textoPrevio: "O Hodie Motorista é um aplicativo disponível para Android gratuitamente e de fácil utilização, com uma interface intuitiva, simples e acessível para todos. Com ele, os motoristas podem estabelecer uma comunicação direta com o embarcador, confirmando entregas, registrando ocorrências e enviando fotos dos comprovantes em tempo real.", docs: [{ nome: "guia_motorista.pdf" }] },
  { id: 8, titulo: "Hodie Pedidos", desc: "Gerenciamento completo do ciclo de pedidos.", textoPrevio: "Do checkout à expedição, controle cada etapa da venda com precisão.", docs: [{ nome: "Manual_hodie_Pedidos.pdf" }] },
  { id: 9, titulo: "Hodie Fretes", desc: "Cálculo e auditoria de tabelas de frete.", textoPrevio: "O Hodie Frete é uma ferramenta completa para o controle e cálculo dos custos extras de transporte, desde o envio da pré-fatura ao transportador, até a conferência e o pagamento dessas faturas.", docs: [{ nome: "auditoria.pdf" }] },
  { id: 10, titulo: "HodieAI", desc: "Previsibilidade e IA para rotas e demandas.", textoPrevio: "Utilize o poder da inteligência artificial para prever gargalos logísticos.", docs: [{ nome: "manual_ia.pdf" }] },
  { id: 11, titulo: "HodieIOT", desc: "Monitoramento de sensores e telemetria.", textoPrevio: "Conectividade total com frotas e armazéns via hardware inteligente.", docs: [{ nome: "iot_setup.pdf" }] },
];

export default function App() {
  const [ativo, setAtivo] = useState(MODULOS[0]);
  const [busca, setBusca] = useState("");
  
  const [isDark, setIsDark] = useState(() => {
    const salvo = localStorage.getItem('theme');
    if (salvo) return salvo === 'dark';
    return true; 
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const modulosFiltrados = MODULOS.filter(m =>
    m.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">

      {}
      <Sidebar 
        modulos={modulosFiltrados} 
        setModuloAtivo={setAtivo} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />

      <main className="relative flex-1 p-8 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-no-repeat bg-cover bg-top opacity-20 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `url('https://www.estudarfora.org.br/wp-content/uploads/2022/02/Biblioteca-Online.jpg.webp')`, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 3%, rgba(0,0,0,1) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }} />

        <div className="relative max-w-5xl mx-auto space-y-16">

          {}
          <header className="mb-12 pt-4">
            <div className="relative w-full max-w-md">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 px-6 focus:ring-1 ring-brand outline-none backdrop-blur-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
                placeholder="Buscar nos manuais..."
              />
            </div>
          </header>

          <section className="space-y-4">
            <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase text-brand">
              {ativo.titulo}
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic max-w-3xl">
              {ativo.desc}
            </p>
          </section>

          <section className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm shadow-xl space-y-4 transition-colors">
            <h2 className="text-2xl font-bold tracking-tight text-brand">Descrição Técnica</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {ativo.textoPrevio}
            </p>
          </section>

          <section className="space-y-8 pb-20">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Materiais Complementares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ativo.docs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-100/30 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-brand/50 transition-all group backdrop-blur-sm">
                  <span className="text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-200 group-hover:text-brand transition-colors">
                    {doc.nome || doc}
                  </span>
                  <a
                    href={`/downloads/${doc.nome || doc}`}
                    download
                    className="flex items-center gap-2 text-[10px] font-black uppercase bg-brand text-black px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/10 cursor-pointer"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ChatIA />
    </div>
  );
}