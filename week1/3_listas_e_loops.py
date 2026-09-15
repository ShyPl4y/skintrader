"""
SEMANA 1 — LIÇÃO 3: Listas e Loops

Listas guardam vários valores. Loops repetem ações.
Com estas duas coisas, consegues processar dados reais.
"""

# -------------------------------------------------------------------
# LISTAS — várias skins ao mesmo tempo
# -------------------------------------------------------------------

skins = ["AK-47 Redline", "AWP Dragon Lore", "M4A4 Howl"]
print(skins)

# Aceder a um elemento específico (começa no índice 0)
print(skins[0])  # "AK-47 Redline"
print(skins[1])  # "AWP Dragon Lore"

# Adicionar à lista
skins.append("Desert Eagle Blaze")
print(skins)

# -------------------------------------------------------------------
# FOR LOOP — percorrer cada elemento da lista
# -------------------------------------------------------------------

print("\n--- Minhas Skins ---")
for skin in skins:
    print(" -", skin)

# -------------------------------------------------------------------
# LISTA DE PREÇOS — dados reais de flips
# -------------------------------------------------------------------

# Cada flip é um dicionário (como uma ficha com campos)
flips = [
    {"skin": "AK-47 Redline", "compra": 350, "venda": 420},
    {"skin": "M4A4 Howl", "compra": 1200, "venda": 1450},
    {"skin": "Desert Eagle Blaze", "compra": 80, "venda": 110},
]

print("\n--- Meus Flips ---")
for flip in flips:
    lucro = flip["venda"] - flip["compra"]
    print(f"{flip['skin']}: compra {flip['compra']}€ → venda {flip['venda']}€ | lucro: {lucro}€")

# -------------------------------------------------------------------
# CALCULAR LUCRO TOTAL
# -------------------------------------------------------------------

lucro_total = 0
for flip in flips:
    lucro = flip["venda"] - flip["compra"]
    lucro_total = lucro_total + lucro

print(f"\nLucro total: {lucro_total}€")

# -------------------------------------------------------------------
# EXERCÍCIOS:
# 1. Cria uma lista com 3 skins que tu flipaste (reais ou inventadas)
# 2. Usa um loop para imprimir cada skin com o seu lucro
# 3. Calcula o lucro médio (lucro_total / número_de_flips)
# 4. (Opcional) Encontra qual flip deu mais lucro
# -------------------------------------------------------------------