import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import psycopg2
from app.core.config import settings

def inspect():
    conn = psycopg2.connect(settings.SYNC_DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SELECT team_name, project_name, leader_name FROM teams WHERE college = 'KIET' LIMIT 10;" if False else "SELECT team_name, project_name FROM teams WHERE college = 'KIET' LIMIT 10;")
    for r in cur.fetchall():
        print("KIET Team:", r)

    conn.close()

if __name__ == '__main__':
    inspect()
