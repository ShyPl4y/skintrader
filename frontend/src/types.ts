export interface SkinItem {
  market_hash_name: string
  suggested_price: number | null
  min_price: number | null
  max_price: number | null
  mean_price: number | null
  median_price: number | null
  volume: number | null
  sales: number | null
  updated_at: number | null
}

export interface SkinsResponse {
  count: number
  skins: SkinItem[]
}

export interface FlipItem {
  id: number
  skin_name: string
  buy_price: number
  sell_price: number
  fee_pct: number
  profit: number
  margin: number
  created_at: string
}

export interface FlipStats {
  total_flips: number
  total_profit: number
  total_invested: number
  avg_margin: number
}

export interface MarketStats {
  total_skins: number
  avg_min_price: number
  avg_mean_price: number
  most_expensive: { name: string; price: number } | null
  cheapest: { name: string; price: number } | null
  highest_volume: { name: string; volume: number } | null
}

export interface TopSpread {
  market_hash_name: string
  min_price: number
  max_price: number
  mean_price: number | null
  spread_pct: number
  spread_value: number
  volume: number
}