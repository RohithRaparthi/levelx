import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import psycopg2
from app.core.config import settings

def inspect():
    conn = psycopg2.connect(settings.SYNC_DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    print("Tables in DB:", [r[0] for r in cur.fetchall()])

    conn.close()

if __name__ == '__main__':
    inspect()
