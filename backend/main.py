from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from skinport import get_prices, extract_price_data
from database import init_db, add_flip, list_flips, delete_flip, flip_stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="SkinTrader API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Skinport ──


@app.get("/api/ping")
async def ping():
    return {"status": "ok", "message": "SkinTrader API is running"}


# ── Dashboard / Aggregations (must be before {name:path}) ──


@app.get("/api/skins/stats")
async def market_stats():
    items = await get_prices()
    prices = [extract_price_data(i) for i in items if i.get("min_price")]

    if not prices:
        return {
            "total_skins": 0,
            "avg_min_price": 0,
            "most_expensive": None,
            "cheapest": None,
            "highest_volume": None,
        }

    most_expensive = max(prices, key=lambda s: s["min_price"] or 0)
    cheapest = min(prices, key=lambda s: s["min_price"] or float("inf"))
    highest_volume = max(prices, key=lambda s: s["volume"] or 0)

    return {
        "total_skins": len(prices),
        "avg_min_price": round(sum(s["min_price"] or 0 for s in prices) / len(prices), 2),
        "most_expensive": {
            "name": most_expensive["market_hash_name"],
            "price": most_expensive["min_price"],
        },
        "cheapest": {
            "name": cheapest["market_hash_name"],
            "price": cheapest["min_price"],
        },
        "highest_volume": {
            "name": highest_volume["market_hash_name"],
            "volume": highest_volume["volume"],
        },
    }


@app.get("/api/skins/top-spreads")
async def top_spreads(limit: int = 10):
    items = await get_prices()
    results = []
    for item in items:
        data = extract_price_data(item)
        if (
            data["min_price"] and data["max_price"]
            and data["max_price"] > data["min_price"]
            and data["max_price"] < data["min_price"] * 50
            and (data.get("volume") or 0) > 0
        ):
            spread_pct = ((data["max_price"] - data["min_price"]) / data["min_price"]) * 100
            results.append({
                "market_hash_name": data["market_hash_name"],
                "min_price": data["min_price"],
                "max_price": data["max_price"],
                "spread_pct": round(spread_pct, 1),
                "spread_value": round(data["max_price"] - data["min_price"], 2),
                "volume": data["volume"],
            })
    results.sort(key=lambda r: r["spread_pct"], reverse=True)
    return results[:limit]


# ── Skinport ──


@app.get("/api/skins")
async def list_skins(search: str = "", limit: int = 50):
    items = await get_prices()
    results = [extract_price_data(i) for i in items]

    if search:
        search_lower = search.lower()
        results = [r for r in results if search_lower in r["market_hash_name"].lower()]

    return {"count": len(results[:limit]), "skins": results[:limit]}


@app.get("/api/skins/{name:path}")
async def skin_detail(name: str):
    items = await get_prices()
    for item in items:
        if item.get("market_hash_name", "").lower() == name.lower():
            return extract_price_data(item)
    return {"error": "Skin not found", "search": name}


# ── Flips ──


class FlipCreate(BaseModel):
    skin_name: str
    buy_price: float
    sell_price: float
    fee_pct: float = 10.0


@app.post("/api/flips")
async def create_flip(data: FlipCreate):
    flip = await add_flip(data.skin_name, data.buy_price, data.sell_price, data.fee_pct)
    return {
        "id": flip.id,
        "skin_name": flip.skin_name,
        "buy_price": flip.buy_price,
        "sell_price": flip.sell_price,
        "fee_pct": flip.fee_pct,
        "profit": flip.profit,
        "margin": flip.margin,
        "created_at": flip.created_at.isoformat(),
    }


@app.get("/api/flips")
async def get_flips():
    flips = await list_flips()
    return [
        {
            "id": f.id,
            "skin_name": f.skin_name,
            "buy_price": f.buy_price,
            "sell_price": f.sell_price,
            "fee_pct": f.fee_pct,
            "profit": f.profit,
            "margin": f.margin,
            "created_at": f.created_at.isoformat(),
        }
        for f in flips
    ]


@app.delete("/api/flips/{flip_id}")
async def remove_flip(flip_id: int):
    ok = await delete_flip(flip_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Flip not found")
    return {"ok": True}


@app.get("/api/flips/stats")
async def get_flip_stats():
    return await flip_stats()