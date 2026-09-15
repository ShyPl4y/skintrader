"""
SEMANA 1 — LIÇÃO 1: Números e Variáveis

Python é uma calculadora poderosa. Vamos começar por aí.
"""

# Isto é um comentário — o Python ignora, serve para explicares a ti mesmo

# -------------------------------------------------------------------
# NÚMEROS
# -------------------------------------------------------------------

# Inteiros (números sem vírgula)
print(10)
print(1000)
print(3 + 4)       # soma
print(10 - 3)      # subtração
print(5 * 6)       # multiplicação
print(15 / 4)      # divisão (dá número com vírgula)
print(15 // 4)     # divisão inteira (dá 3, ignora o resto)
print(15 % 4)      # resto da divisão (módulo) — dá 3

# -------------------------------------------------------------------
# VARIÁVEIS — caixas onde guardas valores
# -------------------------------------------------------------------

preco_compra = 400       # guardas o número 400 na caixa "preco_compra"
preco_venda = 480        # guardas o número 480 na caixa "preco_venda"

print(preco_compra)      # imprime 400
print(preco_venda)       # imprime 480

lucro = preco_venda - preco_compra
print(lucro)             # imprime 80 (a diferença)

# -------------------------------------------------------------------
# STRINGS — texto (palavras, frases)
# -------------------------------------------------------------------

nome_skin = "AK-47 | Redline"
print(nome_skin)

# -------------------------------------------------------------------
# INPUT — pedir um valor ao utilizador
# -------------------------------------------------------------------

# Descomenta as linhas abaixo para testar:
# skin = input("Nome da skin: ")
# preco = input("Preço da skin: ")
# print("A skin", skin, "custa", preco, "euros")

# -------------------------------------------------------------------
# EXERCÍCIOS (tenta fazer):
# 1. Cria uma variável "minha_skin" com o nome da tua skin favorita
# 2. Cria "comprei_por" e "vendi_por" com valores à tua escolha
# 3. Calcula o lucro e imprime "Lucro: X euros"
# 4. Calcula a percentagem de lucro: (lucro / comprei_por) * 100
# -------------------------------------------------------------------