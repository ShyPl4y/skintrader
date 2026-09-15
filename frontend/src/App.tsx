import { useState, useEffect, useCallback } from 'react'
import type { SkinItem } from './types'
import { fetchSkins } from './api'
import SearchBar from './components/SearchBar'
import SkinTable from './components/SkinTable'
import SkinDetail from './components/SkinDetail'
import SpreadCalculator from './components/SpreadCalculator'
import MarketOverview from './components/MarketOverview'
import FlipHistory from './components/FlipHistory'

type Mode = 'overview' | 'skins' | 'calculator' | 'historico'

function App() {
  const [skins, setSkins] = useState<SkinItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SkinItem | null>(null)
  const [mode, setMode] = useState<Mode>('overview')

  const [calcPrefill, setCalcPrefill] = useState<{ buy?: number; sell?: number; skin?: string }>({})
  const [flipKey, setFlipKey] = useState(0)

  const loadSkins = useCallback(async (term = '') => {
    setLoading(true)
    try {
      const data = await fetchSkins(term)
      setSkins(data.skins)
    } catch {
      setSkins([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSkins()
  }, [loadSkins])

  const handleSearch = (term: string) => {
    setSearch(term)
    setMode('skins')
    loadSkins(term)
  }

  const handleCalculateSpread = (skin: SkinItem) => {
    setCalcPrefill({
      buy: skin.min_price ?? undefined,
      sell: skin.max_price ?? undefined,
      skin: skin.market_hash_name,
    })
    setMode('calculator')
  }

  const handleSelectSkin = (skin: SkinItem) => {
    setSelected(skin)
  }

  const handleOverviewSelect = (name: string) => {
    setSearch(name)
    setMode('skins')
    loadSkins(name)
  }

  const tabs: { key: Mode; label: string }[] = [
    { key: 'overview', label: 'Visão Geral' },
    { key: 'skins', label: 'Mercado' },
    { key: 'calculator', label: 'Calculadora' },
    { key: 'historico', label: 'Histórico' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-lg font-bold">SkinTrader</h1>
            <span className="text-xs text-zinc-500 ml-1">Terminal</span>
          </div>
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setMode(t.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  mode === t.key
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {mode === 'overview' && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} loading={loading} />
            <MarketOverview onSelectSkin={handleOverviewSelect} />
          </div>
        )}

        {mode === 'skins' && (
          <>
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} loading={loading} />
              <p className="text-xs text-zinc-500 mt-2">
                Dados da Skinport API • {skins.length} skins {search ? `para "${search}"` : 'listadas'}
              </p>
            </div>
            {skins.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setMode('overview')}
                  className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  ← Voltar à visão geral
                </button>
              </div>
            )}
            <SkinTable skins={skins} onSelect={handleSelectSkin} />
          </>
        )}

        {mode === 'calculator' && (
          <div className="max-w-md mx-auto">
            <SpreadCalculator
              prefillBuy={calcPrefill.buy}
              prefillSell={calcPrefill.sell}
              prefillSkin={calcPrefill.skin}
              onFlipAdded={() => { setFlipKey((k) => k + 1) }}
            />
          </div>
        )}

        {mode === 'historico' && (
          <FlipHistory key={flipKey} />
        )}
      </main>

      {selected && (
        <SkinDetail
          skin={selected}
          onClose={() => setSelected(null)}
          onCalculateSpread={handleCalculateSpread}
        />
      )}
    </div>
  )
}

export default App
