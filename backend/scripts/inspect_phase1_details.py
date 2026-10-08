import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import psycopg2
from app.core.config import settings

def inspect():
    conn = psycopg2.connect(settings.SYNC_DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SELECT id, team_name, project_name, score, rank, award, college, department FROM teams WHERE phase_id = 1 LIMIT 5;")
    for row in cur.fetchall():
        print("Team:", row)
        cur.execute("""
            SELECT s.id, s.name, s.participant_id, s.college 
            FROM team_members tm 
            JOIN students s ON tm.student_id = s.id 
            WHERE tm.team_id = %s;
        """, (row[0],))
        print("  Members:", cur.fetchall())

    conn.close()

if __name__ == '__main__':
    inspect()
