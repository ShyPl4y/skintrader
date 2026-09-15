import httpx
import asyncio
from typing import Any
from cachetools import TTLCache


SKINPORT_API = "https://api.skinport.com/v1"

_cache: TTLCache = TTLCache(maxsize=1, ttl=60)
_cache_lock = asyncio.Lock()


async def get_prices(app_id: int = 730, currency: str = "EUR") -> list[dict[str, Any]]:
    key = (app_id, currency)
    async with _cache_lock:
        if key in _cache:
            return _cache[key]
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{SKINPORT_API}/items",
                params={"app_id": app_id, "currency": currency},
                headers={"User-Agent": "SkinTrader/1.0", "Accept": "application/json"},
            )
            resp.raise_for_status()
            data = resp.json()
            _cache[key] = data
            return data


def extract_price_data(item: dict) -> dict:
    name = item.get("market_hash_name", "")
    return {
        "market_hash_name": name,
        "suggested_price": item.get("suggested_price"),
        "min_price": item.get("min_price"),
        "max_price": item.get("max_price"),
        "mean_price": item.get("mean_price"),
        "median_price": item.get("median_price"),
        "volume": item.get("quantity"),
        "sales": item.get("sales"),
        "updated_at": item.get("updated_at"),
        "item_page": item.get("item_page"),
        "market_page": item.get("market_page"),
    }


def build_marketplaces(item: dict) -> list[dict]:
    name = item.get("market_hash_name", "")
    min_p = item.get("min_price")
    max_p = item.get("max_price")
    mean_p = item.get("mean_price")
    result = []

    if min_p is not None:
        result.append({
            "name": "Skinport (mais barato)",
            "price": min_p,
            "url": f"https://skinport.com/item/{name.lower().replace(' ', '-')}",
            "type": "min",
        })
    if max_p is not None:
        result.append({
            "name": "Skinport (mais caro)",
            "price": max_p,
            "url": f"https://skinport.com/item/{name.lower().replace(' ', '-')}",
            "type": "max",
        })
    if mean_p is not None and mean_p != min_p and mean_p != max_p:
        result.append({
            "name": "Skinport (preço médio)",
            "price": mean_p,
            "url": f"https://skinport.com/item/{name.lower().replace(' ', '-')}",
            "type": "mean",
        })

    result.append({
        "name": "Steam Community Market",
        "price": None,
        "url": f"https://steamcommunity.com/market/listings/730/{name.replace(' ', '%20')}",
        "type": "external",
    })
    result.append({
        "name": "DMarket",
        "price": None,
        "url": f"https://dmarket.com/ingame-items/item-list/csgo-skins?title={name.replace(' ', '%20')}",
        "type": "external",
    })
    result.append({
        "name": "CSGOFloat",
        "price": None,
        "url": f"https://csgobackpack.net/item/{name.replace(' ', '%20')}",
        "type": "external",
    })

    return result