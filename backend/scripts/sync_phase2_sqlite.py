import os
import sys
import json
import sqlite3

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.import_phase2_neon import get_raw_phase2_records

def sync_sqlite(db_path):
    if not os.path.exists(db_path):
        return
    print(f"Syncing Phase 2 to SQLite: {db_path}...")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Add columns if missing
    columns = [
        "source_team_id TEXT", "room TEXT", "leader_name TEXT", "grade TEXT",
        "score_real_business REAL", "score_chatbot_rag REAL", "score_database REAL",
        "score_platform REAL", "score_team_understanding REAL", "score_presentation REAL",
        "category_scores TEXT"
    ]
    for col in columns:
        try:
            cur.execute(f"ALTER TABLE teams ADD COLUMN {col};")
        except sqlite3.OperationalError:
            pass # column already exists
    conn.commit()

    # Phase 2
    cur.execute("SELECT id FROM phases WHERE id = 2 OR name LIKE '%Phase 2%';")
    row = cur.fetchone()
    if row:
        p2_id = row[0]
        cur.execute("UPDATE phases SET name = 'Phase 2 – Real Business Applications & AI Chatbots', theme = 'Real Business Applications & AI Chatbots', status = 'completed', date = 'September 2026' WHERE id = ?;", (p2_id,))
    else:
        cur.execute("INSERT INTO phases (id, name, theme, status, date) VALUES (2, 'Phase 2 – Real Business Applications & AI Chatbots', 'Real Business Applications & AI Chatbots', 'completed', 'September 2026');")
        p2_id = 2
    conn.commit()

    # Delete existing Phase 2 teams
    cur.execute("DELETE FROM teams WHERE phase_id = ?;", (p2_id,))
    conn.commit()

    records = get_raw_phase2_records()
    sorted_records = sorted(records, key=lambda x: x["total"], reverse=True)
    for i, r in enumerate(sorted_records):
        if i > 0:
            prev = sorted_records[i - 1]
            r["rank"] = prev["rank"] if r["total"] == prev["total"] else i + 1
        else:
            r["rank"] = 1
        score = r["total"]
        if score >= 80.0:
            r["grade"] = "Top Performer"
            r["award"] = "Top Performer"
        elif score >= 60.0:
            r["grade"] = "Passed"
            r["award"] = None
        else:
            r["grade"] = "Needs Improvement"
            r["award"] = None
        leader = r.get("leader")
        r["team_name"] = f"Team {r['source_id']} - {leader}" if leader else f"Team {r['source_id']}"
        cat_dict = {
            "Real Business Used": r["real_biz"],
            "Chatbot Implemented & RAG Quality": r["chatbot"],
            "Database Used": r["db"],
            "Platform Functionality": r["platform"],
            "Team Understanding & Tech Stack": r["team_stack"],
            "Presentation & Demo": r["pres"],
            "Recorded Total": r["total"],
        }
        if r.get("real_biz_raw"):
            cat_dict["Real Business Raw Annotation"] = r["real_biz_raw"]
        r["cat_json"] = json.dumps(cat_dict)

        cur.execute("""
            INSERT INTO teams (
                phase_id, team_name, project_name, score, rank, award,
                project_description, github_url, demo_url, college,
                status, department, evaluator_notes,
                source_team_id, room, leader_name, grade,
                score_real_business, score_chatbot_rag, score_database,
                score_platform, score_team_understanding, score_presentation,
                category_scores
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            p2_id, r["team_name"], r.get("project"), r["total"], r["rank"], r["award"],
            f"Phase 2 Project evaluated in {r['room']}.", None, None, None,
            "evaluated", r["room"], r.get("notes"),
            r["source_id"], r["room"], r.get("leader"), r["grade"],
            r.get("real_biz"), r.get("chatbot"), r.get("db"),
            r.get("platform"), r.get("team_stack"), r.get("pres"),
            r["cat_json"]
        ))
    conn.commit()
    conn.close()
    print(f"Synced {len(sorted_records)} Phase 2 teams to {db_path}.")

if __name__ == '__main__':
    for p in ["levelx.db", "../levelx.db"]:
        sync_sqlite(p)
