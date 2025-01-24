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
        return await self._execute('fetch', query, *args)

    async def fetch_row(self, query: str, *args):
        return await self._execute('fetchrow', query, *args)

    async def execute(self, query: str, *args):
        return await self._execute('execute', query, *args)

    # executes all query tuples in the form of (fn_name, query, args) as a single transaction
    # fn_name: 'fetch', 'fetchrow', 'execute' ... any valid function of an asyncpg connection
    # returns the result of the last query
    async def execute_many_in_transaction(self, queries_and_args):
        if not self._connection_pool:
            await self.connect()

        async with self._connection_pool.acquire() as con:
            async with con.transaction():
                for index, (fn_name, query, args) in enumerate(queries_and_args):
                    fn = getattr(con, fn_name)
                    result = await fn(query, *args)
                    if index == len(queries_and_args) - 1:
                        return result

    async def _execute(self, fn_name, query, *args):
        if not self._connection_pool:
            await self.connect()

        async with self._connection_pool.acquire() as con:
            fn = getattr(con, fn_name)
            result = await fn(query, *args)
            return result

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
