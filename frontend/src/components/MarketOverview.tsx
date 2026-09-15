import { useState, useEffect } from 'react'
import type { MarketStats, TopSpread } from '../types'
import { fetchMarketStats, fetchTopSpreads } from '../api'

interface Props {
  onSelectSkin: (name: string) => void
}

export default function MarketOverview({ onSelectSkin }: Props) {
  const [stats, setStats] = useState<MarketStats | null>(null)
  const [spreads, setSpreads] = useState<TopSpread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchMarketStats(), fetchTopSpreads(10)])
      .then(([s, sp]) => { setStats(s); setSpreads(sp) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-zinc-500 text-sm text-center py-12">A carregar mercado…</p>
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Skins listadas" value={stats?.total_skins.toLocaleString()} />
        <StatCard label="Preço mín. médio" value={stats ? `${stats.avg_min_price}€` : '—'} />
        <StatCard label="Preço médio" value={stats ? `${stats.avg_mean_price}€` : '—'} />
        <StatCard label="Mais cara" value={stats?.most_expensive?.name ? `${stats.most_expensive.price}€` : '—'} sub={stats?.most_expensive?.name} />
        <StatCard label="Maior stock" value={stats?.highest_volume?.name ? stats.highest_volume.volume?.toLocaleString() : '—'} sub={stats?.highest_volume?.name} />
      </div>

      {/* Top spreads */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Maiores spreads (oportunidades)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                <th className="text-left py-2 px-2">Skin</th>
                <th className="text-right py-2 px-2">Mínimo</th>
                <th className="text-right py-2 px-2">Médio</th>
                <th className="text-right py-2 px-2">Máximo</th>
                <th className="text-right py-2 px-2">Spread</th>
                <th className="text-right py-2 px-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {spreads.map((s) => (
                <tr
                  key={s.market_hash_name}
                  onClick={() => onSelectSkin(s.market_hash_name)}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-2 text-zinc-100 font-medium truncate max-w-[200px]">{s.market_hash_name}</td>
                  <td className="py-2 px-2 text-right text-emerald-400">{s.min_price.toFixed(2)}€</td>
                  <td className="py-2 px-2 text-right text-blue-400">{s.mean_price?.toFixed(2) ?? '—'}€</td>
                  <td className="py-2 px-2 text-right text-red-400">{s.max_price.toFixed(2)}€</td>
                  <td className="py-2 px-2 text-right">
                    <span className="text-emerald-400 font-semibold">+{s.spread_pct}%</span>
                  </td>
                  <td className="py-2 px-2 text-right text-zinc-400">{s.volume?.toLocaleString() ?? '—'}</td>
                </tr>
              ))}
              {spreads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-zinc-500 text-xs py-8">Nenhum spread disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | undefined; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-zinc-100 truncate">{value ?? '—'}</div>
      {sub && <div className="text-xs text-zinc-600 mt-1 truncate">{sub}</div>}
    </div>
  )
}
