import os
import numpy as np
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
from sklearn.metrics.pairwise import cosine_similarity

from sentence_transformers import SentenceTransformer 

app = Flask(__name__)
CORS(app)


client = Groq(api_key="Chave_API")


textos_paginas = []
metadados_paginas = []
modelo_embedding = None
matriz_embeddings = None

def preparar_base_rag():
    global textos_paginas, metadados_paginas, modelo_embedding, matriz_embeddings
    
    #LISTA DE PASTAS QUE A IA VAI LER
    pastas_conhecimento = ["Manuais", "Modulos", "Funcionalidades clientes", "Pasta 4"] 
    
    print("Fatiando documentos das pastas...")
    
    for pasta in pastas_conhecimento:

        if not os.path.exists(pasta):
            os.makedirs(pasta)
            continue

        for arquivo in os.listdir(pasta):
            if arquivo.endswith(".pdf"):
                try:
                    caminho_arquivo = os.path.join(pasta, arquivo)
                    leitor = PdfReader(caminho_arquivo)
                    for num_pag, pagina in enumerate(leitor.pages):
                        texto = pagina.extract_text()
                        if texto and len(texto.strip()) > 50:
                            
                           
                            nome_pasta = pasta.upper()
                            texto_enriquecido = f"[{nome_pasta}: {arquivo}]\n{texto.strip()}"
                            
                            textos_paginas.append(texto_enriquecido)
                           
                            metadados_paginas.append(f"{pasta}/{arquivo} (Página {num_pag + 1})")
                except Exception as e:
                    print(f" Erro ao ler {arquivo} da pasta {pasta}: {e}")
    
    if textos_paginas:
        print("Carregando modelo semântico (isso pode levar alguns segundos na primeira vez)...")
        if modelo_embedding is None:
            modelo_embedding = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        
        print("Convertendo documentos...")
        matriz_embeddings = modelo_embedding.encode(textos_paginas)
        print(f"Base RAG Semântica pronta! {len(textos_paginas)} páginas indexadas.")

preparar_base_rag()

def buscar_contexto_relevante(pergunta, top_n=4):
    if modelo_embedding is None:
        return ""
        

    pergunta_vec = modelo_embedding.encode([pergunta])
    similaridades = cosine_similarity(pergunta_vec, matriz_embeddings)[0]
    
    
    indices_top = np.argsort(similaridades)[-top_n:]
    
    contexto_final = ""
    paginas_recuperadas = []
    
    for i in reversed(indices_top): 
       
        if similaridades[i] > 0.3: 
            contexto_final += f"\n--- FONTE: {metadados_paginas[i]} ---\n{textos_paginas[i]}\n"
            paginas_recuperadas.append(metadados_paginas[i])
            
    print(f"\nA Busca Semântica encontrou estas páginas para '{pergunta}':")
    for pag in paginas_recuperadas:
        print(f"   -> {pag}")
        
    return contexto_final



@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    pergunta = data.get('pergunta') or data.get('message')
    
    # 1. RECEBE O HISTÓRICO DO REACT (se não vier nada, assume uma lista vazia [])
    historico = data.get('historico', []) 
    
    if not pergunta:
         return jsonify({"error": "Nenhuma pergunta foi enviada"}), 400
         
    pergunta_limpa = pergunta.lower().strip()
    saudacoes = ["olá", "ola", "oi", "bom dia", "boa tarde", "boa noite", "obrigado", "obrigada", "valeu", "tudo bem", "opa"]
    is_small_talk = pergunta_limpa in saudacoes or (len(pergunta_limpa.split()) <= 3 and any(s in pergunta_limpa for s in saudacoes))

    # 2. PREPARA A LISTA DE MENSAGENS PARA O GROQ
    mensagens_groq = []

    if is_small_talk:
        print(f"💬 Bate-papo rápido detectado: '{pergunta}'.")
        instrucao = "Você é o 'Bibliotecário', o assistente virtual do Ecossistema Hodie. Responda de forma curta, educada e amigável, continuando a conversa naturalmente."
        mensagens_groq.append({"role": "system", "content": instrucao})
        
    else:
        print(f"🔍 Busca complexa detectada: '{pergunta}'.")
        contexto_recuperado = buscar_contexto_relevante(pergunta)
        
        if not contexto_recuperado:
            return jsonify({"response": "Desculpe, não encontrei nada nos manuais sobre esse assunto. Tente usar palavras-chave mais específicas."})

        instrucao = """Você é o 'Bibliotecário', o assistente virtual especialista, prestativo e muito educado do Ecossistema Hodie.
        
        DIRETRIZES DE COMPORTAMENTO E TOM DE VOZ:
        1. Seja sempre cordial, claro e aja como um consultor técnico de alto nível.
        2. Formate suas respostas para facilitar a leitura: use negrito para destacar nomes de menus ou botões, e use listas (bullet points) para explicar passo a passo.
        3. Responda APENAS com base no contexto fornecido.
        4. No final da sua explicação, cite as fontes de forma discreta e profissional (Ex: "📄 Fonte: manual_do_hodie.pdf").
        5. Se a resposta não estiver no contexto, diga educadamente: "Desculpe, mas não encontrei essa informação nos manuais que consultei agora. Pode me dar mais detalhes do que você precisa?"
        6. Responda com um português impecável, moderno e amigável.
        
        REGRA DE OURO CONTRA CONFUSÃO DE MANUAIS:
        O contexto que você receberá abaixo contém trechos de manuais (Ex: [MANUAL: arquivo.pdf] ou [MODULOS: arquivo.pdf]). Responda baseando-se EXCLUSIVAMENTE nos trechos corretos sem misturar regras de sistemas diferentes."""
        
        mensagens_groq.append({"role": "system", "content": instrucao})

    
    for msg in historico:
        
        role_correto = "assistant" if msg['role'] == "bot" else "user"
        mensagens_groq.append({"role": role_correto, "content": msg['text']})

    # 4. INJETA A PERGUNTA ATUAL (Com o contexto dos PDFs se não for small talk)
    if is_small_talk:
        mensagens_groq.append({"role": "user", "content": pergunta})
    else:
        prompt_usuario = f"CONTEXTO RECUPERADO DOS PDFs:\n{contexto_recuperado}\n\nPERGUNTA DO USUÁRIO: {pergunta}"
        mensagens_groq.append({"role": "user", "content": prompt_usuario})
        
    try:
       
        chat_completion = client.chat.completions.create(
            messages=mensagens_groq,
            model="llama-3.3-70b-versatile",
            temperature=0.3, 
        )
        
        return jsonify({"response": chat_completion.choices[0].message.content})
        
    except Exception as e:
        print(f"ERRO NO GROQ: {e}")
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/upload', methods=['POST'])
def upload_manual():
  
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    file = request.files['file']
    
    
    pasta_destino = request.form.get('pasta', 'Manuais')
    
    
    pastas_permitidas = ["Manuais", "Modulos", "Funcionalidades clientes", "Pasta 4"]
    if pasta_destino not in pastas_permitidas:
        pasta_destino = "Manuais" 

    if file.filename == '':
        return jsonify({"error": "Nome de arquivo vazio"}), 400
        
    if file and file.filename.endswith('.pdf'):
        
    
        if not os.path.exists(pasta_destino):
            os.makedirs(pasta_destino)
            

        caminho_salvo = os.path.join(pasta_destino, file.filename)
        file.save(caminho_salvo)
        
        try:
            leitor = PdfReader(caminho_salvo)
            novos_textos = []
            novos_metadados = []
            
           
            nome_pasta = pasta_destino.upper()
            
            for num_pag, pagina in enumerate(leitor.pages):
                texto = pagina.extract_text()
                if texto and len(texto.strip()) > 50:
                    
                    
                    texto_enriquecido = f"[{nome_pasta}: {file.filename}]\n{texto.strip()}"

                    novos_textos.append(texto_enriquecido)
                
                    novos_metadados.append(f"{pasta_destino}/{file.filename} (Página {num_pag + 1})")
            
            if novos_textos:
                global textos_paginas, metadados_paginas, matriz_embeddings, modelo_embedding
                
                textos_paginas.extend(novos_textos)
                metadados_paginas.extend(novos_metadados)
                
                novos_embeddings = modelo_embedding.encode(novos_textos)
                
                if matriz_embeddings is None:
                    matriz_embeddings = novos_embeddings
                else:
                    matriz_embeddings = np.vstack((matriz_embeddings, novos_embeddings))
                
            return jsonify({"message": f"Arquivo salvo e IA atualizada com sucesso!"}), 200
            
        except Exception as e:
            return jsonify({"error": f"Erro ao processar PDF: {str(e)}"}), 500
    else:
        return jsonify({"error": "Apenas arquivos PDF são permitidos"}), 400
    
    
if __name__ == '__main__':
    from waitress import serve
    print("🌐 Servidor de Produção HODIE iniciado na porta 5000...")
    serve(app, host="0.0.0.0", port=5000)
