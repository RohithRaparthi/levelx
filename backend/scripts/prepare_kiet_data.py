import json
import re

# Load dumped excel data
with open('backend/scripts/kiet_excel_dump.json', 'r', encoding='utf-8') as f:
    dump = json.load(f)

# Evaluation Data for KIET (from screenshots)
eval_data = {
    "1": {"eval_lead": "Ashok kumar", "project_name": "AI instance assistance", "rag": 19, "func": 13, "deploy": 0, "team_score": 9, "pres": 9, "total": 50, "grade": "Needs Improvement", "notes": "Deployment is not done, and presentation is not clear"},
    "2": {"eval_lead": "leeladar", "project_name": "cyber security rag assistance", "rag": 19, "func": 15, "deploy": 0, "team_score": 12, "pres": 10, "total": 56, "grade": "Needs Improvement", "notes": "Deployment is not done, and presentation is not clear and frontend is pending"},
    "3": {"eval_lead": "hemavathi", "project_name": "hacklens", "rag": 21, "func": 15, "deploy": 0, "team_score": 14, "pres": 14, "total": 64, "grade": "Passed", "notes": "Deployment is not done, and inside the frontend some pendings are there and need to change the database form supabase to code vectorDB"},
    "4": {"eval_lead": "pujitha", "project_name": "travelplanning", "rag": 15, "func": 9, "deploy": 10, "team_score": 13, "pres": 12, "total": 59, "grade": "Needs Improvement", "notes": "deployed , need frontend enhacement. So the vector db is not used , the data is stroed in code base only"},
    "5": {"eval_lead": "naveen", "project_name": "yatra andhra", "rag": 19, "func": 14, "deploy": 0, "team_score": 13, "pres": 14, "total": 60, "grade": "Passed", "notes": "Deployment is not done,need frontend enhacement. Rag is good , the data is stored in code base only"},
    "6": {"eval_lead": "yojanasatu", "project_name": "govt schemes and eligibility chatbot", "rag": 13, "func": 13, "deploy": 10, "team_score": 13, "pres": 13, "total": 62, "grade": "Passed", "notes": "deployed , need frontend enhacement. So the vector db is not used , the data is stroed in code base only"},
    "7": {"eval_lead": "jyothika.k", "project_name": "pet guard ai", "rag": 10, "func": 13, "deploy": 0, "team_score": 13, "pres": 14, "total": 50, "grade": "Needs Improvement", "notes": "deployed , need frontend enhacement. So the vector db is not used , the data is stored in code base only, rag is not implemented correctly"},
    "8": {"eval_lead": "dheekshith", "project_name": "ahaar ai", "rag": 10, "func": 12, "deploy": 0, "team_score": 10, "pres": 10, "total": 42, "grade": "Needs Improvement", "notes": "Deployment is not done, and Rag is not good."},
    "10": {"eval_lead": "dhanunjay", "project_name": "jarvis labs", "rag": 19, "func": 13, "deploy": 0, "team_score": 13, "pres": 15, "total": 60, "grade": "Passed", "notes": "Deployment is not done, and presentation is clear . Rag pipline is good"},
    "20": {"eval_lead": "N Vasavi", "project_name": "Cure Tech", "rag": 10, "func": 12, "deploy": 0, "team_score": 10, "pres": 13, "total": 45, "grade": "Needs Improvement"},
    "21": {"eval_lead": "Y Venkata Balu", "project_name": "ERKA AI", "rag": 15, "func": 10, "deploy": 10, "team_score": 8, "pres": 12, "total": 55, "grade": "Needs Improvement"},
    "23": {"eval_lead": "S Bhoomika", "project_name": "Nexora", "rag": 15, "func": 7, "deploy": 0, "team_score": 10, "pres": 10, "total": 42, "grade": "Needs Improvement"},
    "24": {"eval_lead": "JADA.YASWANTH", "project_name": "aero RAG", "rag": 25, "func": 12, "deploy": 15, "team_score": 7, "pres": 15, "total": 74, "grade": "Passed", "notes": "Project Explanation and all is good , but has to communicate between team!"},
    "25": {"eval_lead": "M.uma devi", "project_name": "schemeconnect", "rag": 20, "func": 10, "deploy": 0, "team_score": 10, "pres": 10, "total": 50, "grade": "Needs Improvement", "notes": "Need better team communication and project understandings"},
    "27": {"eval_lead": "A V S Sirisha", "project_name": "Agent AI", "rag": 15, "func": 7, "deploy": 10, "team_score": 7, "pres": 10, "total": 49, "grade": "Needs Improvement"},
}

form_responses = dump['Form Responses 1']
kiet_data = dump['KIET DATA']

# Build a mapping of teams
teams_dict = {}

# 1. Base from KIET DATA
for r in kiet_data:
    t_no_raw = r.get('Team No')
    if t_no_raw:
        try:
            t_num = int(float(t_no_raw))
        except:
            continue
        t_name = r.get('Team Name') or f"KIET - Team {t_num}"
        domain = r.get(' Domain') or r.get('Domain')
        lead = r.get('  Team Leader Name  ') or r.get('Team Leader Name')
        
        teams_dict[t_num] = {
            "team_number": t_num,
            "team_code": f"KIET-T{t_num:02d}",
            "team_name": t_name,
            "domain": domain,
            "lead_name": lead,
            "college": "KIET",
            "members": [],
            "status": "active"
        }

# 2. Extract members from Form Responses 1
# Rows 1 to 13 correspond to K-Hub teams (Team 16 to 29 approx in sheet mapping)
khub_team_num_map = {
    1: 16, 2: 17, 3: 18, 4: 19, 5: 20, 6: 21, 7: 22, 8: 23, 9: 24, 10: 25, 11: 26, 12: 27, 13: 28, 14: 29
}

for i in range(13):
    r = form_responses[i]
    t_no_val = r.get('Team No')
    try:
        t_idx = int(float(t_no_val))
    except:
        t_idx = i + 1
    t_num = khub_team_num_map.get(t_idx, t_idx)
    
    if t_num not in teams_dict:
        teams_dict[t_num] = {
            "team_number": t_num,
            "team_code": f"KIET-T{t_num:02d}",
            "team_name": r.get('Team Name') or f"KIET - Team {t_num}",
            "domain": r.get('Domain'),
            "lead_name": r.get('Team Lead Name'),
            "college": "KIET",
            "members": [],
            "status": "active"
        }
    
    lead = r.get('Team Lead Name')
    if lead:
        teams_dict[t_num]["lead_name"] = lead
    
    for m_key in ['Member 1 Name', 'Member  2 Name', 'Member  3 Name', 'Member  4 Name']:
        m_name = r.get(m_key)
        if m_name and m_name.strip() and m_name.strip() != '-':
            teams_dict[t_num]["members"].append(m_name.strip())

# Rows 28 to 43 correspond to GCC Teams (Team 1 to 15)
gcc_team_num_map = {
    28: 1, 29: 2, 30: 3, 31: 4, 32: 5, 33: 6, 34: 7, 35: 8, 36: 9, 37: 10, 38: 11, 39: 12, 40: 13, 41: 14, 42: 15
}

for i in range(28, len(form_responses)):
    r = form_responses[i]
    t_num = gcc_team_num_map.get(i)
    if not t_num:
        continue
    
    if t_num not in teams_dict:
        teams_dict[t_num] = {
            "team_number": t_num,
            "team_code": f"KIET-T{t_num:02d}",
            "team_name": r.get('Team Name') or f"KIET - Team {t_num}",
            "domain": r.get('Domain 2') or r.get('Domain'),
            "lead_name": r.get('Team Leader Name') or r.get('Team Lead Name'),
            "college": "KIET",
            "members": [],
            "status": "active"
        }
    
    lead = r.get('Team Leader Name') or r.get('Team Lead Name')
    if lead:
        teams_dict[t_num]["lead_name"] = lead
    if r.get('Domain 2'):
        teams_dict[t_num]["domain"] = r.get('Domain 2')
        
    for m_key in ['Member  Name', 'Member 2 Name', 'Member 3 Name', 'Member 4 Name']:
        m_name = r.get(m_key)
        if m_name and m_name.strip() and m_name.strip() != '-':
            teams_dict[t_num]["members"].append(m_name.strip())

# 3. Attach evaluation data to matching teams
evaluated_count = 0
for t_num, t_obj in teams_dict.items():
    ev = eval_data.get(str(t_num))
    if ev:
        t_obj["status"] = "evaluated"
        t_obj["project_name"] = ev["project_name"]
        t_obj["score"] = ev["total"]
        t_obj["grade"] = ev["grade"]
        t_obj["evaluator_notes"] = ev.get("notes")
        t_obj["components"] = ev
        evaluated_count += 1
    else:
        t_obj["project_name"] = t_obj.get("domain")

# Ensure Lead is included in member roster if not present
for t_num, t_obj in teams_dict.items():
    lead = t_obj.get("lead_name")
    if lead and lead not in t_obj["members"]:
        # Check if similar name already in members
        if not any(lead.lower() in m.lower() or m.lower() in lead.lower() for m in t_obj["members"]):
            t_obj["members"].insert(0, lead)

# Assign Ranks to evaluated teams
evaluated_teams = [t for t in teams_dict.values() if t.get("score") is not None]
evaluated_teams.sort(key=lambda x: x["score"], reverse=True)

rank = 1
for idx, t in enumerate(evaluated_teams):
    if idx > 0 and t["score"] < evaluated_teams[idx - 1]["score"]:
        rank = idx + 1
    t["rank"] = rank

all_kiet_teams = list(teams_dict.values())
all_kiet_teams.sort(key=lambda x: x["team_number"])

with open('backend/scripts/kiet_structured.json', 'w', encoding='utf-8') as f:
    json.dump(all_kiet_teams, f, indent=2)

print(f"Total KIET Teams processed: {len(all_kiet_teams)}")
print(f"Evaluated KIET Teams: {evaluated_count}")
total_students = sum(len(t['members']) for t in all_kiet_teams)
print(f"Total KIET Student Memberships: {total_students}")
