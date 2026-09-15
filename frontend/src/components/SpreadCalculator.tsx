import { useState, useCallback, useEffect, useRef } from 'react'
import { fetchSkins, createFlip } from '../api'
import type { SkinItem } from '../types'

interface Props {
  prefillBuy?: number
  prefillSell?: number
  prefillSkin?: string
  onFlipAdded?: () => void
}

export default function SpreadCalculator({ prefillBuy, prefillSell, prefillSkin, onFlipAdded }: Props) {
  const [compra, setCompra] = useState(prefillBuy?.toString() ?? '')
  const [venda, setVenda] = useState(prefillSell?.toString() ?? '')
  const [taxa, setTaxa] = useState('10')
  const [skinName, setSkinName] = useState(prefillSkin ?? '')
  const [result, setResult] = useState<{
    lucro: number; margem: number; decisao: string
  } | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<SkinItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (prefillBuy !== undefined) setCompra(prefillBuy.toString())
    if (prefillSell !== undefined) setVenda(prefillSell.toString())
    if (prefillSkin !== undefined) setSkinName(prefillSkin)
  }, [prefillBuy, prefillSell, prefillSkin])

  const searchSkins = useCallback((term: string) => {
    setSearchTerm(term)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!term.trim()) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchSkins(term)
        setSuggestions(data.skins.slice(0, 8))
        setShowSuggestions(true)
      } catch {}
    }, 300)
  }, [])

  const selectSkin = (skin: SkinItem) => {
    setSkinName(skin.market_hash_name)
    setCompra(skin.min_price?.toString() ?? compra)
    setVenda(skin.max_price?.toString() ?? venda)
    setSearchTerm('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const calcular = (e: React.FormEvent) => {
    e.preventDefault()
    const c = parseFloat(compra)
    const v = parseFloat(venda)
    const t = parseFloat(taxa)
    if (!c || !v) return

    const lucroBruto = v - c
    const valorTaxa = v * (t / 100)
    const lucro = lucroBruto - valorTaxa
    const margem = (lucro / c) * 100

    let decisao: string
    if (margem >= 15) decisao = 'Excelente margem — compra já'
    else if (margem >= 8) decisao = 'Boa margem — vale a pena'
    else if (margem >= 3) decisao = 'Raciável — margem pequena'
    else if (margem >= 0) decisao = 'Margem baixa — risco alto'
    else decisao = 'Prejuízo — não compres'

    setResult({ lucro, margem, decisao })
  }

  const saveFlip = async () => {
    if (!result || !skinName.trim()) return
    await createFlip({
      skin_name: skinName,
      buy_price: parseFloat(compra),
      sell_price: parseFloat(venda),
      fee_pct: parseFloat(taxa),
    })
    onFlipAdded?.()
    setResult(null)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-base font-semibold text-zinc-100 mb-4">Calculadora de Spread</h3>
      <form onSubmit={calcular} className="space-y-3">
        {/* Skin search */}
        <div className="relative">
          <label className="text-xs text-zinc-500 mb-1 block">Skin (opcional)</label>
          <input
            type="text"
            value={searchTerm || skinName}
            onChange={(e) => searchSkins(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-zinc-800 text-zinc-100 px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="AK-47 Redline…"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((s) => (
                <button
                  key={s.market_hash_name}
                  type="button"
                  onMouseDown={() => selectSkin(s)}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  <span className="text-zinc-100">{s.market_hash_name}</span>
                  <span className="text-zinc-500 ml-2">
                    {s.min_price?.toFixed(2)}€ — {s.max_price?.toFixed(2)}€
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Compra (€)</label>
            <input type="number" step="0.01" value={compra} onChange={(e) => setCompra(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Venda (€)</label>
            <input type="number" step="0.01" value={venda} onChange={(e) => setVenda(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Taxa (%)</label>
            <input type="number" step="0.1" value={taxa} onChange={(e) => setTaxa(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 px-3 py-2 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
        </div>
        <button type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Calcular
        </button>
      </form>

      {result && (
        <div className="mt-4 bg-zinc-800 rounded-lg p-3 text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-zinc-500">Lucro líquido:</span><span className={`font-semibold ml-2 ${result.lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{result.lucro.toFixed(2)}€</span></div>
            <div><span className="text-zinc-500">Margem:</span><span className={`font-semibold ml-2 ${result.margem >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{result.margem.toFixed(1)}%</span></div>
          </div>
          <div className="text-center font-medium">{result.decisao}</div>
          {skinName.trim() && (
            <button onClick={saveFlip}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-1.5 rounded-lg text-xs transition-colors">
              Salvar no histórico
            </button>
          )}
        </div>
      )}
    </div>
  )
}
