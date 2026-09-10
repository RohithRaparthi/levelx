import json
import re

def clean(text):
    if text is None:
        return None
    s = str(text).strip()
    return s if s and s.lower() != 'none' and s.lower() != 'nan' else None

# Load raw spreadsheet data
with open('backend/scripts/kiet_women_raw.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

teams_list = []

# --- 1. AID H ---
aid_h_eval = {
    1: {"rag": 18, "func": 15, "deploy": 10, "team": 12, "pres": 15, "total": 70, "grade": "Passed"},
    2: {"rag": 15, "func": 18, "deploy": 10, "team": 12, "pres": 14, "total": 69, "grade": "Passed"},
    3: {"rag": 10, "func": 10, "deploy": 10, "team": 12, "pres": 15, "total": 57, "grade": "Needs Improvement"},
    4: {"rag": 15, "func": 12, "deploy": 12, "team": 10, "pres": 10, "total": 59, "grade": "Needs Improvement"},
    5: {"rag": 15, "func": 14, "deploy": 15, "team": 10, "pres": 10, "total": 64, "grade": "Passed"},
    6: {"rag": 10, "func": 10, "deploy": 0, "team": 10, "pres": 13, "total": 43, "grade": "Needs Improvement"},
    7: {"rag": 15, "func": 15, "deploy": 10, "team": 8, "pres": 11, "total": 59, "grade": "Needs Improvement"},
    8: {"rag": 10, "func": 14, "deploy": 10, "team": 10, "pres": 10, "total": 54, "grade": "Needs Improvement"},
    9: {"rag": 15, "func": 13, "deploy": 10, "team": 10, "pres": 10, "total": 58, "grade": "Needs Improvement"},
    10: {"rag": 5, "func": 10, "deploy": 5, "team": 8, "pres": 8, "total": 36, "grade": "Needs Improvement"},
}

current_team = None
for r in raw.get('AID H', []):
    t_no_raw = clean(r.get('TEAM NO'))
    if t_no_raw:
        m = re.search(r'\d+', t_no_raw)
        num = int(m.group()) if m else len(teams_list) + 1
        t_name = clean(r.get('TEAM NAME')) or clean(r.get('TEAM NAME ')) or f"AID H - Team {num}"
        lead = clean(r.get('TEAM LEAD NAME')) or clean(r.get('TEAM LEAD NAME '))
        proj = clean(r.get('PROJECT NAME')) or clean(r.get('PROJECT NAME '))
        domain = clean(r.get('DOMAIN'))
        prob = clean(r.get('PROBLEM STATEMENT')) or clean(r.get('PROBLEM STATEMENT '))
        ev = aid_h_eval.get(num, {})
        
        current_team = {
            "dept": "AID H",
            "team_number": num,
            "team_name": t_name,
            "team_code": f"AIDH-T{num:02d}",
            "lead_name": lead,
            "project_name": proj,
            "domain": domain,
            "problem_statement": prob,
            "college": "KIET Women",
            "status": "evaluated",
            "score": ev.get("total"),
            "grade": ev.get("grade"),
            "components": ev,
            "members": []
        }
        teams_list.append(current_team)
    
    mem_name = clean(r.get('TEAM MEMBERS NAME')) or clean(r.get('TEAM MEMBERS NAME '))
    roll = clean(r.get('ROLL NO')) or clean(r.get('ROLL NO '))
    if mem_name and roll and current_team:
        is_lead = (lead and lead.lower() in mem_name.lower()) or (mem_name.lower() in str(lead or '').lower())
        current_team["members"].append({
            "name": mem_name,
            "roll_no": roll,
            "is_lead": is_lead,
            "college": "KIET Women"
        })
        if not current_team["project_name"] and clean(r.get('PROJECT NAME')):
            current_team["project_name"] = clean(r.get('PROJECT NAME'))

# --- 2. CSM H ---
csm_h_eval = {
    1: {"lead": "P. Sravanya", "total": 57, "status": "evaluated", "grade": "Needs Improvement"},
    2: {"lead": "Pavani", "total": 78, "status": "evaluated", "grade": "Top Performer"},
    3: {"lead": "K. Divyasree", "total": 71, "status": "evaluated", "grade": "Passed"},
    4: {"lead": "P.Ramya", "status": "disqualified", "notes": "Disqualified this team"},
    5: {"lead": "R.Jaswitha", "status": "disqualified", "notes": "Disqualified this team"},
    6: {"lead": "P. V. Poojitha", "total": 76, "status": "evaluated", "grade": "Passed"},
    7: {"lead": "A. Mokshitha", "total": 70, "status": "evaluated", "grade": "Passed"},
    8: {"lead": "U. Deepika", "total": 67, "status": "evaluated", "grade": "Passed"},
    9: {"lead": "U.DEEPIKA", "total": 67, "status": "evaluated", "grade": "Passed"},
}

current_team = None
for r in raw.get('CSM H', []):
    t_no_raw = clean(r.get('TEAM NO'))
    if t_no_raw:
        m = re.search(r'\d+', str(t_no_raw))
        num = int(m.group()) if m else len(teams_list) + 1
        t_name = clean(r.get('TEAM NAME ')) or clean(r.get('TEAM NAME')) or f"CSM H - Team {num}"
        lead = clean(r.get('TEAM LEAD NAME ')) or clean(r.get('TEAM LEAD NAME'))
        proj = clean(r.get('PROJECT NAME ')) or clean(r.get('PROJECT NAME'))
        domain = clean(r.get('DOMAIN'))
        prob = clean(r.get('PROBLEM STATEMENT ')) or clean(r.get('PROBLEM STATEMENT'))
        ev = csm_h_eval.get(num, {})
        
        current_team = {
            "dept": "CSM H",
            "team_number": num,
            "team_name": t_name,
            "team_code": f"CSMH-T{num:02d}",
            "lead_name": lead,
            "project_name": proj,
            "domain": domain,
            "problem_statement": prob,
            "college": "KIET Women",
            "status": ev.get("status", "evaluated"),
            "score": ev.get("total"),
            "grade": ev.get("grade"),
            "evaluator_notes": ev.get("notes"),
            "members": []
        }
        teams_list.append(current_team)
    
    mem_name = clean(r.get('TEAM MEMBERS NAME')) or clean(r.get('TEAM MEMBERS NAME '))
    roll = clean(r.get('ROLL NO ')) or clean(r.get('ROLL NO'))
    if mem_name and roll and current_team:
        is_lead = (lead and lead.lower() in mem_name.lower()) or (mem_name.lower() in str(lead or '').lower())
        current_team["members"].append({
            "name": mem_name,
            "roll_no": roll,
            "is_lead": is_lead,
            "college": "KIET Women"
        })

# --- 3. CSM D ---
csm_d_eval = {
    1: {"lead": "G. Keerthi", "total": 78, "status": "evaluated", "grade": "Top Performer"},
    2: {"lead": "A. Renuka", "total": 70, "status": "evaluated", "grade": "Passed"},
}

current_team = None
for r in raw.get('CSM D', []):
    t_no_raw = clean(r.get('TEAM NO'))
    if t_no_raw:
        m = re.search(r'\d+', str(t_no_raw))
        num = int(m.group()) if m else len(teams_list) + 1
        t_name = clean(r.get('TEAM NAME ')) or clean(r.get('TEAM NAME')) or f"CSM D - Team {num}"
        lead = clean(r.get('TEAM LEAD NAME ')) or clean(r.get('TEAM LEAD NAME'))
        proj = clean(r.get('PROJECT NAME')) or clean(r.get('PROJECT NAME '))
        domain = clean(r.get('DOMAIN'))
        prob = clean(r.get('PROBLEM STATEMENT ')) or clean(r.get('PROBLEM STATEMENT'))
        ev = csm_d_eval.get(num, {})
        
        current_team = {
            "dept": "CSM D",
            "team_number": num,
            "team_name": t_name,
            "team_code": f"CSMD-T{num:02d}",
            "lead_name": lead,
            "project_name": proj,
            "domain": domain,
            "problem_statement": prob,
            "college": "KIET Women",
            "status": ev.get("status", "evaluated"),
            "score": ev.get("total"),
            "grade": ev.get("grade"),
            "members": []
        }
        teams_list.append(current_team)
    
    mem_name = clean(r.get('TEAM MEMBERS NAME')) or clean(r.get('TEAM MEMBERS NAME '))
    roll = clean(r.get('ROLL NO ')) or clean(r.get('ROLL NO'))
    if mem_name and roll and current_team:
        is_lead = (lead and lead.lower() in mem_name.lower()) or (mem_name.lower() in str(lead or '').lower())
        current_team["members"].append({
            "name": mem_name,
            "roll_no": roll,
            "is_lead": is_lead,
            "college": "KIET Women"
        })

# --- 4. CAI H ---
cai_h_eval = {
    1: {"rag": 12, "func": 14, "deploy": 0, "team": 9, "pres": 13, "total": 48, "grade": "Needs Improvement"},
    2: {"rag": 8, "func": 8, "deploy": 0, "team": 8, "pres": 8, "total": 32, "grade": "Needs Improvement"},
    3: {"rag": 11, "func": 14, "deploy": 0, "team": 10, "pres": 15, "total": 50, "grade": "Needs Improvement", "notes": "Thanusha"},
}

current_team = None
for r in raw.get('CAI H', []):
    t_no_raw = clean(r.get('TEAM NO'))
    if t_no_raw:
        m = re.search(r'\d+', str(t_no_raw))
        num = int(m.group()) if m else len(teams_list) + 1
        t_name = clean(r.get('TEAM NAME ')) or clean(r.get('TEAM NAME')) or f"CAI H - Team {num}"
        lead = clean(r.get('TEAM LEAD NAME ')) or clean(r.get('TEAM LEAD NAME'))
        proj = clean(r.get('PROJECT NAME ')) or clean(r.get('PROJECT NAME'))
        domain = clean(r.get('DOMAIN'))
        prob = clean(r.get('PROBLEM STATEMENT ')) or clean(r.get('PROBLEM STATEMENT'))
        ev = cai_h_eval.get(num, {})
        
        current_team = {
            "dept": "CAI H",
            "team_number": num,
            "team_name": t_name,
            "team_code": f"CAIH-T{num:02d}",
            "lead_name": lead,
            "project_name": proj,
            "domain": domain,
            "problem_statement": prob,
            "college": "KIET Women",
            "status": "evaluated",
            "score": ev.get("total"),
            "grade": ev.get("grade"),
            "evaluator_notes": ev.get("notes"),
            "components": ev,
            "members": []
        }
        teams_list.append(current_team)
    
    mem_name = clean(r.get('TEAM MEMBERS NAME')) or clean(r.get('TEAM MEMBERS NAME '))
    roll = clean(r.get('ROLL NO ')) or clean(r.get('ROLL NO'))
    if mem_name and roll and current_team:
        is_lead = (lead and lead.lower() in mem_name.lower()) or (mem_name.lower() in str(lead or '').lower())
        current_team["members"].append({
            "name": mem_name,
            "roll_no": roll,
            "is_lead": is_lead,
            "college": "KIET Women"
        })

# --- 5. AID D ---
aid_d_eval = {
    1: {"rag": 10, "func": 15, "deploy": 0, "team": 11, "pres": 15, "total": 51, "grade": "Needs Improvement"},
    2: {"rag": 10, "func": 13, "deploy": 0, "team": 11, "pres": 15, "total": 49, "grade": "Needs Improvement"},
    3: {"rag": 11, "func": 14, "deploy": 0, "team": 10, "pres": 15, "total": 50, "grade": "Needs Improvement"},
    5: {"rag": 13, "func": 12, "deploy": 0, "team": 11, "pres": 14, "total": 50, "grade": "Needs Improvement"},
    6: {"rag": 15, "func": 15, "deploy": 10, "team": 11, "pres": 16, "total": 67, "grade": "Passed"},
    9: {"rag": 10, "func": 15, "deploy": 0, "team": 8, "pres": 10, "total": 43, "grade": "Needs Improvement"},
    10: {"rag": 10, "func": 13, "deploy": 8, "team": 9, "pres": 13, "total": 53, "grade": "Needs Improvement"},
    11: {"rag": 10, "func": 12, "deploy": 10, "team": 9, "pres": 9, "total": 50, "grade": "Needs Improvement"},
}

current_team = None
for r in raw.get('AID D', []):
    t_no_raw = clean(r.get('TEAM NO'))
    if t_no_raw:
        m = re.search(r'\d+', str(t_no_raw))
        num = int(m.group()) if m else len(teams_list) + 1
        t_name = clean(r.get('TEAM NAME ')) or clean(r.get('TEAM NAME')) or clean(r.get('Team name')) or f"AID D - Team {num}"
        lead = clean(r.get('TEAM LEAD NAME ')) or clean(r.get('TEAM LEAD NAME'))
        proj = clean(r.get('PROJECT NAME')) or clean(r.get('PROJECT NAME '))
        domain = clean(r.get('DOMAIN')) or clean(r.get('DOMAIN '))
        prob = clean(r.get('PROBLEM STATEMENT ')) or clean(r.get('PROBLEM STATEMENT'))
        ev = aid_d_eval.get(num, {})
        
        # Resolve project name for Team 9 if missing
        if num == 9 and not proj:
            proj = "Industrial Knowledge Assistant"
            domain = "Industry Sector"
            prob = "Industries and organizations maintain large amounts of information in PDFs, manuals, policies, reports, and technical documents."

        current_team = {
            "dept": "AID D",
            "team_number": num,
            "team_name": t_name,
            "team_code": f"AIDD-T{num:02d}",
            "lead_name": lead,
            "project_name": proj,
            "domain": domain,
            "problem_statement": prob,
            "college": "KIET Women",
            "status": "evaluated",
            "score": ev.get("total"),
            "grade": ev.get("grade"),
            "components": ev,
            "members": []
        }
        teams_list.append(current_team)
    
    mem_name = clean(r.get('TEAM MEMBERS NAME')) or clean(r.get('TEAM MEMBERS NAME '))
    roll = clean(r.get('ROLL NO ')) or clean(r.get('ROLL NO'))
    if mem_name and roll and current_team:
        is_lead = (lead and lead.lower() in mem_name.lower()) or (mem_name.lower() in str(lead or '').lower())
        current_team["members"].append({
            "name": mem_name,
            "roll_no": roll,
            "is_lead": is_lead,
            "college": "KIET Women"
        })

# Assign Ranks to evaluated teams based on Score descending
evaluated_teams = [t for t in teams_list if t.get("score") is not None]
evaluated_teams.sort(key=lambda x: x["score"], reverse=True)

rank = 1
for i, t in enumerate(evaluated_teams):
    if i > 0 and t["score"] < evaluated_teams[i-1]["score"]:
        rank = i + 1
    t["rank"] = rank

# Save cleaned structured output
with open('backend/scripts/kiet_women_structured.json', 'w', encoding='utf-8') as f:
    json.dump(teams_list, f, indent=2)

print(f"Total KIET Women Teams Processed: {len(teams_list)}")
print(f"Evaluated Teams: {len([t for t in teams_list if t['status'] == 'evaluated'])}")
print(f"Disqualified Teams: {len([t for t in teams_list if t['status'] == 'disqualified'])}")
print(f"Total Student Members: {sum(len(t['members']) for t in teams_list)}")
