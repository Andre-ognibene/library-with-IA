# 📚 Biblioteca do Hodie - Assistente Inteligente (RAG)

> 💡 Sistema de consulta inteligente de documentos com IA (RAG), capaz de responder perguntas com base em PDFs reais.

A **Biblioteca do Hodie** é uma plataforma avançada de gestão de conhecimento para o Ecossistema Hodie. O sistema combina uma interface moderna para consulta de manuais logísticos com um **Bibliotecário Virtual** baseado em Inteligência Artificial, capaz de ler, compreender e responder dúvidas com base em documentos PDF reais.

---

## 🚀 Funcionalidades Principais

* **Busca Semântica (RAG):** A IA não apenas procura palavras-chave, ela entende o contexto dos manuais para fornecer respostas precisas.
* **Organização por Categorias:** Suporte para múltiplas pastas de conhecimento como **Manuais**, **Módulos**, **Funcionalidades clientes** e **Pasta 4**.
* **Bibliotecário Multi-Modal:**
    * **Tela Cheia:** Para consultas profundas e detalhadas.
    * **Widget Flutuante:** Para dúvidas rápidas durante a navegação.
* **Memória de Conversação:** A IA recorda o contexto das últimas mensagens, permitindo um diálogo fluido.
* **Gestão Dinâmica:** Upload de novos PDFs com seleção de pasta de destino diretamente pela interface.
* **Interface Adaptável:** Design moderno com suporte a **Modo Escuro** e um **Modo Claro Suave** para reduzir a fadiga visual.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
* **React (Vite):** Estrutura principal da aplicação.
* **Tailwind CSS:** Estilização moderna e responsiva.
* **Lucide React:** Conjunto de ícones minimalistas.
* **React Markdown:** Renderização inteligente de respostas formatadas da IA.

### **Backend (Cérebro da IA)**
* **Python / Flask:** Servidor de API.
* **Groq Cloud (Llama 3.3 70B):** Processamento de linguagem natural ultra-rápido.
* **Sentence-Transformers:** Conversão de texto em vetores matemáticos (Embeddings).
* **PyPDF2:** Extração de texto de documentos PDF.
* **Waitress:** Servidor WSGI para ambiente de produção.

---

## 🧪 Conceitos Aplicados

* Retrieval-Augmented Generation (RAG) 
* Processamento de linguagem natural (NLP) 
* Busca semântica com embeddings
* Arquitetura cliente-servidor
* Integração com APIs de IA

---

## 📂 Estrutura de Pastas

```text
biblioteca-hodie/
├── backend/
│   ├── app.py                  # Servidor Flask e lógica principal da IA
│   ├── requirements.txt        # Dependências do backend
│   ├── .env                    # Variáveis de ambiente (não versionar)
│   ├── Manuais/                # PDFs de manuais gerais
│   └── Modulos/                # PDFs de módulos específicos
│
├── frontend/
│   ├── public/
│   │   └── preview.png         # Imagem de demonstração
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatIA.jsx
│   │   │   ├── ChatFullScreen.jsx
│   │   │   └── Upload.jsx      # Componente de upload de arquivos
│   │   │
│   │   ├── services/
│   │   │   └── api.js          # Comunicação com backend
│   │   │
│   │   ├── App.jsx             # Componente principal
│   │   ├── main.jsx            # Entry point
│   │   └── styles.css          # Estilos globais
│   │
│   ├── package.json            # Dependências do frontend
│   └── vite.config.js          # Configuração do Vite
│
├── .gitignore                  # Arquivos ignorados (node_modules, .env, etc.)
├── README.md                   # Documentação do projeto
└── package.json                # (caso use scripts globais)
