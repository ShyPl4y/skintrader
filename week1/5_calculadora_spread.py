"""
SEMANA 1 — PROJETO FINAL: Calculadora de Spread

Junta tudo o que aprendeste (variáveis, condições, listas, funções)
numa ferramenta real para avaliar flips de skins.

O que faz:
- Pede o preço de compra e venda de uma skin
- Pede a taxa da plataforma
- Calcula lucro bruto, taxa, lucro líquido, e margem
- Dá uma recomendação: vale a pena ou não?
"""

# -------------------------------------------------------------------
# Funções
# -------------------------------------------------------------------

def calcular_lucro_liquido(compra, venda, taxa_percentagem):
    lucro_bruto = venda - compra
    valor_taxa = venda * (taxa_percentagem / 100)
    lucro_liquido = lucro_bruto - valor_taxa
    return lucro_liquido

def calcular_margem(lucro, compra):
    return (lucro / compra) * 100

def recomendar(margem):
    if margem >= 15:
        return "✅ COMPRA JÁ — margem excelente!"
    elif margem >= 8:
        return "👍 BOA — vale a pena"
    elif margem >= 3:
        return "👌 RACIÁVEL — margem pequena mas positiva"
    elif margem >= 0:
        return "⚠️ MARGEM BAIXA — risco alto de não vender pelo preço"
    else:
        return "❌ PREJUÍZO — não compres"

# -------------------------------------------------------------------
# Programa principal
# -------------------------------------------------------------------

print("=" * 45)
print("   CALCULADORA DE SPREAD — CSGO Skins")
print("=" * 45)

# Input do utilizador
skin = input("\nNome da skin: ")
compra = float(input("Preço de compra (€): "))
venda = float(input("Preço de venda esperado (€): "))
taxa = float(input("Taxa da plataforma (%): "))

# Calcular
lucro = calcular_lucro_liquido(compra, venda, taxa)
margem = calcular_margem(lucro, compra)
decisao = recomendar(margem)

# Mostrar resultados
print("\n" + "-" * 45)
print(f"Skin:         {skin}")
print(f"Compra:       {compra}€")
print(f"Venda:        {venda}€")
print(f"Taxa:         {taxa}%")
print("-" * 45)
print(f"Lucro bruto:  {venda - compra}€")
print(f"Taxa paga:    {venda * (taxa / 100):.2f}€")
print(f"Lucro líquido: {lucro:.2f}€")
print(f"Margem:        {margem:.1f}%")
print("-" * 45)
print(f"\n{decisao}")
print("=" * 45)

# -------------------------------------------------------------------
# EXERCÍCIO EXTRA (se quiseres):
# Modifica o programa para aceitar VÁRIAS skins de uma vez
# Usa uma lista de flips e um loop para avaliar todas
# -------------------------------------------------------------------