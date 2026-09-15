"""
SEMANA 1 — LIÇÃO 2: Condições (if/else)

O teu programa precisa de tomar decisões. É aqui que entra o if.
"""

# -------------------------------------------------------------------
# IF / ELIF / ELSE
# -------------------------------------------------------------------

preco_atual = 420
meu_preco_alvo = 400

# Se o preço atual for menor que o meu alvo, compro
if preco_atual < meu_preco_alvo:
    print("Comprar agora!")
else:
    print("Esperar, está caro.")

# -------------------------------------------------------------------
# COMPARAÇÕES ÚTEIS
# -------------------------------------------------------------------
# <   menor que
# >   maior que
# <=  menor ou igual
# >=  maior ou igual
# ==  igual
# !=  diferente (não igual)

# -------------------------------------------------------------------
# EXEMPLO REAL: decidir se um flip vale a pena
# -------------------------------------------------------------------

preco_compra = 350
preco_venda = 420
taxa_mercado = 0.10  # 10% de taxa

lucro_bruto = preco_venda - preco_compra
taxa = preco_venda * taxa_mercado
lucro_liquido = lucro_bruto - taxa

print(f"Lucro bruto: {lucro_bruto}€")
print(f"Taxa ({taxa_mercado*100}%): {taxa}€")
print(f"Lucro líquido: {lucro_liquido}€")

# Decisão automática
if lucro_liquido > 20:
    print("👍 Vale a pena! Lucro acima de 20€")
elif lucro_liquido > 5:
    print("👌 Lucro pequeno mas positivo")
else:
    print("👎 Não compensa, lucro muito baixo ou negativo")

# -------------------------------------------------------------------
# EXERCÍCIOS:
# 1. Pede ao utilizador um preço de compra e um preço de venda (input)
# 2. Calcula o lucro líquido (assume 10% de taxa)
# 3. Se lucro > 10% do preço de compra, imprime "Boa flip!"
# 4. Senão, imprime "Procura melhor"
# -------------------------------------------------------------------