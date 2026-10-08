import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import psycopg2
from app.core.config import settings

def inspect():
    conn = psycopg2.connect(settings.SYNC_DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'teams' 
        ORDER BY ordinal_position;
    """)
    print("Teams table columns:")
    for col in cur.fetchall():
        print(f"  {col[0]}: {col[1]}")

    cur.execute("SELECT id, name, theme, status, date FROM phases ORDER BY id;")
    print("\nPhases:")
    for p in cur.fetchall():
        print(f"  {p}")

    conn.close()

if __name__ == '__main__':
    inspect()
