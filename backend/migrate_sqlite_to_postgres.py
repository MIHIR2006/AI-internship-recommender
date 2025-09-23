import os
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

# Source (SQLite) and target (Postgres) URLs from env with sensible defaults
SQLITE_URL = os.getenv("SQLITE_URL", "sqlite:///./internships.db")
POSTGRES_URL = os.getenv("DATABASE_URL", "")


def normalize_pg(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    return url


def reflect_metadata(engine: sa.Engine) -> sa.MetaData:
    meta = sa.MetaData()
    meta.reflect(bind=engine)
    return meta


def main():
    if not POSTGRES_URL:
        raise SystemExit("DATABASE_URL not set. Set it to your Postgres connection URL.")

    target_url = normalize_pg(POSTGRES_URL)

    # Engines
    sqlite_engine = sa.create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    pg_engine = sa.create_engine(target_url, pool_pre_ping=True)

    # Reflect
    sqlite_meta = reflect_metadata(sqlite_engine)

    # Create tables on Postgres if not exist (structure based on SQLite)
    sqlite_meta.create_all(pg_engine)

    # Copy data table-by-table (simple bulk copy)
    with sqlite_engine.connect() as src_conn, pg_engine.begin() as dst_conn:
        for table_name, table in sqlite_meta.tables.items():
            rows = src_conn.execute(sa.select(table)).mappings().all()
            if not rows:
                continue
            # Build insert on the fly
            insert_stmt = sa.text(
                f"INSERT INTO {table_name} ({', '.join(rows[0].keys())}) VALUES (" +
                ", ".join([f":{k}" for k in rows[0].keys()]) + ")"
            )
            dst_conn.execute(insert_stmt, rows)

    print("✅ Migration completed from SQLite to Postgres")


if __name__ == "__main__":
    main()


