import type { SkinsResponse, SkinItem, FlipItem, FlipStats, MarketStats, TopSpread } from './types'

const BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchSkins(search?: string): Promise<SkinsResponse> {
  const params = new URLSearchParams({ limit: '100' })
  if (search) params.set('search', search)
  const res = await fetch(`${BASE}/skins?${params}`)
  return res.json()
}

export async function fetchSkinDetail(name: string): Promise<SkinItem> {
  const res = await fetch(`${BASE}/skins/${encodeURIComponent(name)}`)
  return res.json()
}

export async function fetchMarketStats(): Promise<MarketStats> {
  const res = await fetch(`${BASE}/skins/stats`)
  return res.json()
}

export async function fetchTopSpreads(limit = 10): Promise<TopSpread[]> {
  const res = await fetch(`${BASE}/skins/top-spreads?limit=${limit}`)
  return res.json()
}

export async function fetchFlips(): Promise<FlipItem[]> {
  const res = await fetch(`${BASE}/flips`)
  return res.json()
}

export async function fetchFlipStats(): Promise<FlipStats> {
  const res = await fetch(`${BASE}/flips/stats`)
  return res.json()
}

export async function createFlip(data: { skin_name: string; buy_price: number; sell_price: number; fee_pct: number }): Promise<FlipItem> {
  const res = await fetch(`${BASE}/flips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteFlip(id: number): Promise<void> {
  await fetch(`${BASE}/flips/${id}`, { method: 'DELETE' })
}