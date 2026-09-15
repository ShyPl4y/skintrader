import { useState, useEffect } from 'react'
import type { FlipItem, FlipStats } from '../types'
import { fetchFlips, fetchFlipStats, deleteFlip } from '../api'

export default function FlipHistory() {
  const [flips, setFlips] = useState<FlipItem[]>([])
  const [stats, setStats] = useState<FlipStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([fetchFlips(), fetchFlipStats()])
      .then(([f, s]) => { setFlips(f); setStats(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: number) => {
    await deleteFlip(id)
    load()
  }

  if (loading) {
    return <p className="text-zinc-500 text-sm text-center py-12">A carregar histórico…</p>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 mb-1">Total flips</div>
            <div className="text-lg font-bold text-zinc-100">{stats.total_flips}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 mb-1">Lucro total</div>
            <div className="text-lg font-bold text-emerald-400">{stats.total_profit}€</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 mb-1">Total investido</div>
            <div className="text-lg font-bold text-zinc-100">{stats.total_invested.toFixed(2)}€</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 mb-1">Margem média</div>
            <div className="text-lg font-bold text-emerald-400">{stats.avg_margin}%</div>
          </div>
        </div>
      )}

      {/* Flip list */}
      {flips.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-8">Nenhum flip registado. Usa a calculadora para adicionar o primeiro.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                <th className="text-left py-2 px-2">Skin</th>
                <th className="text-right py-2 px-2">Compra</th>
                <th className="text-right py-2 px-2">Venda</th>
                <th className="text-right py-2 px-2">Taxa</th>
                <th className="text-right py-2 px-2">Lucro</th>
                <th className="text-right py-2 px-2">Margem</th>
                <th className="text-right py-2 px-2">Data</th>
                <th className="text-right py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {flips.map((f) => {
                const isProfitable = f.profit > 0
                return (
                  <tr key={f.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-2 px-2 text-zinc-100 font-medium truncate max-w-[200px]">{f.skin_name}</td>
                    <td className="py-2 px-2 text-right text-zinc-300">{f.buy_price.toFixed(2)}€</td>
                    <td className="py-2 px-2 text-right text-zinc-300">{f.sell_price.toFixed(2)}€</td>
                    <td className="py-2 px-2 text-right text-zinc-400">{f.fee_pct}%</td>
                    <td className={`py-2 px-2 text-right font-medium ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfitable ? '+' : ''}{f.profit.toFixed(2)}€
                    </td>
                    <td className={`py-2 px-2 text-right font-medium ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isProfitable ? '+' : ''}{f.margin}%
                    </td>
                    <td className="py-2 px-2 text-right text-zinc-500 text-xs">{new Date(f.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-2 text-right">
                      <button onClick={() => handleDelete(f.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-xs">
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
