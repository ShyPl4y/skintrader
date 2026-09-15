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
    return {
        "market_hash_name": item.get("market_hash_name"),
        "suggested_price": item.get("suggested_price"),
        "min_price": item.get("min_price"),
        "max_price": item.get("max_price"),
        "mean_price": item.get("mean_price"),
        "median_price": item.get("median_price"),
        "volume": item.get("quantity"),
        "sales": item.get("sales"),
        "updated_at": item.get("updated_at"),
    }