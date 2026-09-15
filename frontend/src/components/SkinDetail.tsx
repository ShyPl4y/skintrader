import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { SkinItem } from '../types'
import { fetchSkinDetail } from '../api'

interface Props {
  skin: SkinItem
  onClose: () => void
  onCalculateSpread?: (skin: SkinItem) => void
}

export default function SkinDetail({ skin, onClose, onCalculateSpread }: Props) {
  const [detail, setDetail] = useState<SkinItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchSkinDetail(skin.market_hash_name)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [skin.market_hash_name])

  const d = detail ?? skin
  const chartData = [
    { name: 'Mínimo', value: d.min_price ?? 0, fill: '#34d399' },
    { name: 'Sugerido', value: d.suggested_price ?? 0, fill: '#a1a1aa' },
    { name: 'Mediana', value: d.median_price ?? 0, fill: '#818cf8' },
    { name: 'Máximo', value: d.max_price ?? 0, fill: '#f87171' },
  ].filter((item) => item.value > 0)

  const spreadPct = d.max_price && d.min_price && d.min_price > 0
    ? ((d.max_price - d.min_price) / d.min_price * 100).toFixed(1)
    : null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">{skin.market_hash_name}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xl leading-none">&times;</button>
        </div>

        {loading ? (
          <p className="text-zinc-500 text-sm">A carregar detalhes…</p>
        ) : (
          <div className="space-y-4">
            {/* Price cards */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Mínimo</div>
                <div className="text-emerald-400 text-lg font-semibold">{d.min_price?.toFixed(2) ?? '—'}€</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Máximo</div>
                <div className="text-red-400 text-lg font-semibold">{d.max_price?.toFixed(2) ?? '—'}€</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Sugerido</div>
                <div className="text-zinc-100 text-lg font-semibold">{d.suggested_price?.toFixed(2) ?? '—'}€</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Mediana</div>
                <div className="text-zinc-100 text-lg font-semibold">{d.median_price?.toFixed(2) ?? '—'}€</div>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 1 && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-2">Comparação de preços</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
                      formatter={(value) => [`${Number(value).toFixed(2)}€`]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Volume + sales */}
            <div className="flex gap-4 text-sm text-zinc-400">
              <span>Volume: <strong className="text-zinc-100">{d.volume ?? '—'}</strong></span>
              <span>Vendas (24h): <strong className="text-zinc-100">{d.sales ?? '—'}</strong></span>
            </div>

            {/* Spread */}
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-zinc-500 text-xs mb-2">Spread Estimado</div>
              <div className="text-2xl font-bold text-zinc-100">
                {spreadPct ? `${spreadPct}%` : '—'}
              </div>
              <div className="text-zinc-400 text-xs mt-1">
                {d.max_price && d.min_price
                  ? `Diferença: ${(d.max_price - d.min_price).toFixed(2)}€`
                  : '—'}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {onCalculateSpread && (
            <button
              onClick={() => { onCalculateSpread(skin); onClose() }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm transition-colors"
            >
              Calcular Spread
            </button>
          )}
          <button
            onClick={() => window.open(`https://skinport.com/item/${skin.market_hash_name.replace(/\s+/g, '-')}`, '_blank')}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors"
          >
            Ver na Skinport
          </button>
        </div>
      </div>
    </div>
  )
}
