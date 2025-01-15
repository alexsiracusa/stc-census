from backend.config import POSTGRES
import asyncpg
import json


class PostgresClient:
    def __init__(self):
        self.user = POSTGRES.USER
        self.password = POSTGRES.PASSWORD
        self.host = POSTGRES.HOST
        self.port = POSTGRES.PORT
        self.database = POSTGRES.DB
        self._cursor = None

        self._connection_pool = None
        self.con = None

    async def connect(self):
        if not self._connection_pool:
            try:
                self._connection_pool = await asyncpg.create_pool(
                    min_size=1,
                    max_size=10,
                    command_timeout=30,
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    init=PostgresClient._setup_json_codec
                )

            except Exception:
                raise

    async def fetch(self, query: str, *args):
        async def fetch():
            return await self.con.fetch(query, *args)
        return await self._execute(fetch)

    async def fetch_row(self, query: str, *args):
        async def fetch_row():
            return await self.con.fetchrow(query, *args)
        return await self._execute(fetch_row)

    async def execute(self, query: str, *args):
        async def execute():
            return await self.con.execute(query, *args)
        return await self._execute(execute)

    async def _execute(self, get_result):
        if not self._connection_pool:
            await self.connect()

        self.con = await self._connection_pool.acquire()
        try:
            result = await get_result()
            return result
        except Exception:
            raise
        finally:
            await self._connection_pool.release(self.con)

    @staticmethod
    async def _setup_json_codec(conn):
        """Set up the custom codec for JSON and JSONB on a connection."""
        await conn.set_type_codec(
            'json',
            encoder=json.dumps,
            decoder=json.loads,
            schema='pg_catalog',
            format='text'
        )
        await conn.set_type_codec(
            'jsonb',
            encoder=json.dumps,
            decoder=json.loads,
            schema='pg_catalog',
            format='text'
        )


postgres_client: PostgresClient = None
