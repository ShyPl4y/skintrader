import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { SkinItem } from '../types'
import { fetchSkinDetail } from '../api'

interface Props {
  skin: SkinItem
  onClose: () => void
  onCalculateSpread?: (skin: SkinItem) => void
}

const FEES = [
  { label: 'Skinport (12%)', pct: 12 },
  { label: 'Steam (15%)', pct: 15 },
  { label: 'DMarket (10%)', pct: 10 },
  { label: 'CSGOFloat (2%)', pct: 2 },
]

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
    { name: 'Médio', value: d.mean_price ?? 0, fill: '#60a5fa' },
    { name: 'Mediana', value: d.median_price ?? 0, fill: '#818cf8' },
    { name: 'Sugerido', value: d.suggested_price ?? 0, fill: '#a1a1aa' },
    { name: 'Máximo', value: d.max_price ?? 0, fill: '#f87171' },
  ].filter((item) => item.value > 0)

  const spreadPct = d.max_price && d.min_price && d.min_price > 0
    ? ((d.max_price - d.min_price) / d.min_price * 100).toFixed(1)
    : null

  const spreadValue = d.max_price && d.min_price
    ? (d.max_price - d.min_price).toFixed(2)
    : null

  const feeAnalysis = FEES.map((fee) => {
    const buy = d.min_price ?? 0
    const sell = d.max_price ?? 0
    if (!buy || !sell) return null
    const feeCost = sell * (fee.pct / 100)
    const profit = sell - buy - feeCost
    const margin = buy > 0 ? (profit / buy) * 100 : 0
    return { ...fee, buy, sell, feeCost: Math.round(feeCost * 100) / 100, profit: Math.round(profit * 100) / 100, margin: Math.round(margin * 10) / 10 }
  }).filter(Boolean)

  const updatedAt = d.updated_at ? new Date(d.updated_at * 1000).toLocaleDateString() : null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{skin.market_hash_name}</h2>
            {updatedAt && <p className="text-xs text-zinc-600 mt-0.5">Última atualização: {updatedAt}</p>}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xl leading-none">&times;</button>
        </div>

        {loading ? (
          <p className="text-zinc-500 text-sm">A carregar detalhes…</p>
        ) : (
          <div className="space-y-4">
            {/* Price cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <PriceCard label="Mínimo" value={d.min_price} color="text-emerald-400" />
              <PriceCard label="Médio" value={d.mean_price} color="text-blue-400" />
              <PriceCard label="Mediana" value={d.median_price} color="text-indigo-400" />
              <PriceCard label="Sugerido" value={d.suggested_price} color="text-zinc-100" />
              <PriceCard label="Máximo" value={d.max_price} color="text-red-400" />
            </div>

            {/* Bar chart */}
            {chartData.length > 1 && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-2">Comparação de preços</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
                      formatter={(value) => [`${Number(value).toFixed(2)}€`]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Volume + spread */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Volume (stock)</div>
                <div className="text-xl font-bold text-zinc-100">{d.volume?.toLocaleString() ?? '—'}</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-1">Spread</div>
                <div className={`text-xl font-bold ${spreadPct && Number(spreadPct) > 10 ? 'text-emerald-400' : 'text-zinc-100'}`}>
                  {spreadPct ? `${spreadPct}%` : '—'}
                </div>
                {spreadValue && <div className="text-xs text-zinc-500 mt-0.5">{spreadValue}€ diferença</div>}
              </div>
            </div>

            {/* Fee analysis per marketplace */}
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-zinc-500 text-xs mb-3">Simulação de lucro por marketplace (comprar ao mínimo, vender ao máximo)</div>
              <div className="space-y-2">
                {feeAnalysis.map((f) => f && (
                  <div key={f.label} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 w-28">{f.label}</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.profit > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.max(f.profit > 0 ? f.margin : f.margin * -1, 2), 100)}%` }}
                      />
                    </div>
                    <span className={`font-medium w-24 text-right ${f.profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {f.profit > 0 ? '+' : ''}{f.profit.toFixed(2)}€ ({f.profit > 0 ? '+' : ''}{f.margin.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-zinc-600 mt-2">
                * Valores estimados. Taxas reais podem variar conforme método de pagamento e volume.
              </div>
            </div>

            {/* Marketplaces */}
            {d.marketplaces && d.marketplaces.length > 0 && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <div className="text-zinc-500 text-xs mb-2">Onde comprar/vender</div>
                <div className="space-y-1.5">
                  {d.marketplaces.map((mp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <a
                        href={mp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline ${mp.price !== null ? 'text-zinc-200' : 'text-zinc-500'}`}
                      >
                        {mp.name}
                      </a>
                      <span className={mp.price !== null ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                        {mp.price !== null ? `${mp.price.toFixed(2)}€` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              {onCalculateSpread && (
                <button
                  onClick={() => { onCalculateSpread(skin); onClose() }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm transition-colors"
                >
                  Calcular Spread
                </button>
              )}
              {d.item_page && (
                <button
                  onClick={() => window.open(d.item_page!, '_blank')}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors"
                >
                  Ver na Skinport
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PriceCard({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-2.5 text-center">
      <div className="text-zinc-500 text-xs mb-0.5">{label}</div>
      <div className={`font-semibold ${color}`}>{value?.toFixed(2) ?? '—'}€</div>
    </div>
  )
}
