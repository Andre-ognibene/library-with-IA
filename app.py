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


client = Groq(api_key="")


textos_paginas = []
metadados_paginas = []
modelo_embedding = None
matriz_embeddings = None

def preparar_base_rag():
    global textos_paginas, metadados_paginas, modelo_embedding, matriz_embeddings
    pasta_manuais = "Manuais" 
    
    if not os.path.exists(pasta_manuais):
        print("❌ Pasta Manuais não encontrada.")
        return

    print("📚 Fatiando manuais...")
    for arquivo in os.listdir(pasta_manuais):
        if arquivo.endswith(".pdf"):
            try:
                leitor = PdfReader(os.path.join(pasta_manuais, arquivo))
                for num_pag, pagina in enumerate(leitor.pages):
                    texto = pagina.extract_text()
                    if texto and len(texto.strip()) > 50:
                        textos_paginas.append(texto)
                        metadados_paginas.append(f"{arquivo} (Página {num_pag + 1})")
            except Exception as e:
                print(f"❌ Erro ao ler {arquivo}: {e}")
    
    if textos_paginas:
        
        print("🧠 Carregando modelo semântico (isso pode levar alguns segundos na primeira vez)...")
        modelo_embedding = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        
        
        print("⚙️ Convertendo manuais em conhecimento de IA...")
        matriz_embeddings = modelo_embedding.encode(textos_paginas)
        print(f"✅ Base RAG Semântica pronta! {len(textos_paginas)} páginas indexadas.")

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
            
    print(f"\n🔍 A Busca Semântica encontrou estas páginas para '{pergunta}':")
    for pag in paginas_recuperadas:
        print(f"   -> {pag}")
        
    return contexto_final



@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    pergunta = data.get('message')
    
    contexto_recuperado = buscar_contexto_relevante(pergunta)
    
    if not contexto_recuperado:
        return jsonify({"response": "Desculpe, não encontrei nada nos manuais sobre esse assunto. Tente usar palavras-chave mais específicas."})

   
    instrucao_sistema = """Você é o 'Bibliotecário', o assistente virtual especialista, prestativo e muito educado do Ecossistema Hodie.
    
    DIRETRIZES DE COMPORTAMENTO E TOM DE VOZ:
    1. Seja sempre cordial, claro e aja como um consultor técnico de alto nível.
    2. Formate suas respostas para facilitar a leitura: use negrito para destacar nomes de menus ou botões, e use listas (bullet points) para explicar passo a passo.
    3. Responda APENAS com base no contexto fornecido.
    4. Se o contexto tiver informações de manuais diferentes, explique a diferença de forma natural e clara para o usuário.
    5. No final da sua explicação, cite as fontes de forma discreta e profissional (Ex: "📄 Fonte: manual_do_hodie.pdf, pág 4").
    6. Se a resposta não estiver no contexto, diga educadamente: "Desculpe, mas não encontrei essa informação nos manuais que consultei agora. Pode me dar mais detalhes do que você precisa?"
    
    Responda com um português impecável, moderno e amigável."""
    
    prompt_usuario = f"CONTEXTO RECUPERADO:\n{contexto_recuperado}\n\nPERGUNTA: {pergunta}"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": instrucao_sistema},
                {"role": "user", "content": prompt_usuario}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3, 
        )
        
        return jsonify({"response": chat_completion.choices[0].message.content})
        
    except Exception as e:
        print(f"🔥 ERRO REAL NO GROQ: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')