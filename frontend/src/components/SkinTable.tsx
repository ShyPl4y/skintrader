import type { SkinItem } from '../types'

interface Props {
  skins: SkinItem[]
  onSelect: (skin: SkinItem) => void
}

export default function SkinTable({ skins, onSelect }: Props) {
  if (skins.length === 0) {
    return <p className="text-zinc-500 text-sm text-center py-8">Nenhuma skin encontrada.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
            <th className="text-left py-3 px-2">Skin</th>
            <th className="text-right py-3 px-2">Mínimo</th>
            <th className="text-right py-3 px-2">Sugerido</th>
            <th className="text-right py-3 px-2">Máximo</th>
            <th className="text-right py-3 px-2">Volume</th>
            <th className="text-right py-3 px-2">Vendas (24h)</th>
          </tr>
        </thead>
        <tbody>
          {skins.map((skin) => (
            <tr
              key={skin.market_hash_name}
              onClick={() => onSelect(skin)}
              className="border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <td className="py-2.5 px-2 text-zinc-100 font-medium truncate max-w-[280px]">
                {skin.market_hash_name}
              </td>
              <td className="py-2.5 px-2 text-right text-emerald-400">
                {skin.min_price?.toFixed(2) ?? '—'}€
              </td>
              <td className="py-2.5 px-2 text-right text-zinc-300">
                {skin.suggested_price?.toFixed(2) ?? '—'}€
              </td>
              <td className="py-2.5 px-2 text-right text-red-400">
                {skin.max_price?.toFixed(2) ?? '—'}€
              </td>
              <td className="py-2.5 px-2 text-right text-zinc-400">
                {skin.volume ?? '—'}
              </td>
              <td className="py-2.5 px-2 text-right text-zinc-400">
                {skin.sales ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}