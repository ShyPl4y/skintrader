"""
SEMANA 1 — LIÇÃO 4: Funções

Funções são máquinas: metes algo lá dentro, sai algo cá fora.
Ajudam a não repetir código e a organizar as ideias.
"""

# -------------------------------------------------------------------
# DEFINIR E CHAMAR UMA FUNÇÃO
# -------------------------------------------------------------------

def calcular_lucro(compra, venda, taxa):
    """
    Calcula o lucro líquido de uma flip.
    compra: preço que pagaste
    venda: preço que vendeste
    taxa: percentagem de taxa (ex: 0.10 para 10%)
    """
    lucro_bruto = venda - compra
    valor_taxa = venda * taxa
    lucro_liquido = lucro_bruto - valor_taxa
    return lucro_liquido

# Usar a função
resultado = calcular_lucro(350, 420, 0.10)
print(f"Lucro líquido: {resultado}€")

# -------------------------------------------------------------------
# FUNÇÃO COM VÁRIOS FLIPS
# -------------------------------------------------------------------

def calcular_lucro_total(flips, taxa):
    lucro_total = 0
    for flip in flips:
        lucro = calcular_lucro(flip["compra"], flip["venda"], taxa)
        lucro_total = lucro_total + lucro
    return lucro_total

meus_flips = [
    {"compra": 350, "venda": 420},
    {"compra": 1200, "venda": 1450},
    {"compra": 80, "venda": 110},
]

total = calcular_lucro_total(meus_flips, 0.10)
print(f"Lucro total de todos os flips: {total}€")

# -------------------------------------------------------------------
# FUNÇÃO QUE DECIDE SE DEVES COMPRAR
# -------------------------------------------------------------------

def avaliar_flip(preco_compra, preco_venda_medio, taxa):
    lucro = calcular_lucro(preco_compra, preco_venda_medio, taxa)
    margem = lucro / preco_compra * 100  # percentagem de lucro

    if margem > 15:
        return "EXCELENTE — margem acima de 15%"
    elif margem > 8:
        return "BOA — margem acima de 8%"
    elif margem > 3:
        return "RACIÁVEL — margem pequena mas positiva"
    else:
        return "ESPERA — margem muito baixa ou negativa"

# Testar
print(avaliar_flip(350, 420, 0.10))   # skin barata
print(avaliar_flip(1000, 1050, 0.10)) # margem pequena
print(avaliar_flip(400, 390, 0.10))   # prejuízo

# -------------------------------------------------------------------
# EXERCÍCIOS:
# 1. Cria uma função "percentagem_lucro(compra, venda)" que devolve a %
# 2. Cria uma função "avaliar_flip_rapido(compra, venda)" que imprime:
#    - "Comprar" se margem > 10%
#    - "Talvez" se margem entre 5-10%
#    - "Passar" se margem < 5%
# 3. Testa com 3 pares de valores diferentes
# -------------------------------------------------------------------