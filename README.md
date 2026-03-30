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

## ⚙️ Como executar o projeto

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py

cd frontend
npm install
npm run dev


```md
## 🧪 Conceitos aplicados

- Retrieval-Augmented Generation (RAG)
- Processamento de linguagem natural (NLP)
- Busca semântica com embeddings
- Arquitetura cliente-servidor
- Integração com APIs de IA


## 📂 Estrutura de Pastas

```text
meu-projeto/
├── backend/
│   ├── app.py              # Servidor Flask e Lógica da IA
│   ├── Manuais/            # PDFs de manuais gerais
│   ├── Modulos/            # PDFs de módulos específicos
│   
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx     # Menu lateral e Upload
│   │   ├── ChatIA.jsx      # Widget de chat flutuante
│   │   └── ChatFullScreen.jsx # Interface de chat completa
│   ├── App.jsx             # Componente principal
│   └── main.jsx
└── package.json

