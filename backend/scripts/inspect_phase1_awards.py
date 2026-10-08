import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import psycopg2
from app.core.config import settings

def inspect():
    conn = psycopg2.connect(settings.SYNC_DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SELECT DISTINCT award, COUNT(*) FROM teams WHERE phase_id = 1 GROUP BY award;")
    print("Phase 1 distinct awards:", cur.fetchall())

    conn.close()

if __name__ == '__main__':
    inspect()
