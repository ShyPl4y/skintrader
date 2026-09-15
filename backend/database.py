import os
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import select, func, delete as sa_delete

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///skintrader.db")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Flip(Base):
    __tablename__ = "flips"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    skin_name: Mapped[str] = mapped_column(nullable=False)
    buy_price: Mapped[float] = mapped_column(nullable=False)
    sell_price: Mapped[float] = mapped_column(nullable=False)
    fee_pct: Mapped[float] = mapped_column(default=10.0)
    profit: Mapped[float] = mapped_column(nullable=False)
    margin: Mapped[float] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def add_flip(skin_name: str, buy_price: float, sell_price: float, fee_pct: float) -> Flip:
    profit = sell_price - buy_price - (sell_price * fee_pct / 100)
    margin = (profit / buy_price) * 100 if buy_price else 0
    async with async_session() as session:
        flip = Flip(
            skin_name=skin_name,
            buy_price=buy_price,
            sell_price=sell_price,
            fee_pct=fee_pct,
            profit=round(profit, 2),
            margin=round(margin, 1),
        )
        session.add(flip)
        await session.commit()
        return flip


async def list_flips() -> list[Flip]:
    async with async_session() as session:
        result = await session.execute(select(Flip).order_by(Flip.created_at.desc()))
        return list(result.scalars().all())


async def delete_flip(flip_id: int) -> bool:
    async with async_session() as session:
        result = await session.execute(sa_delete(Flip).where(Flip.id == flip_id))
        await session.commit()
        return result.rowcount > 0


async def flip_stats() -> dict:
    async with async_session() as session:
        total = await session.scalar(select(func.count(Flip.id)))
        total_profit = await session.scalar(select(func.coalesce(func.sum(Flip.profit), 0)))
        total_invested = await session.scalar(select(func.coalesce(func.sum(Flip.buy_price), 0)))
        avg_margin = await session.scalar(select(func.coalesce(func.avg(Flip.margin), 0)))
        return {
            "total_flips": total or 0,
            "total_profit": round(total_profit or 0, 2),
            "total_invested": round(total_invested or 0, 2),
            "avg_margin": round(avg_margin or 0, 1),
        }
