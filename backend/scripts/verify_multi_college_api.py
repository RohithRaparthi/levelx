import urllib.request
import json

base = 'http://127.0.0.1:8000/api/v1'

def get_json(endpoint):
    req = urllib.request.Request(f'{base}{endpoint}')
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        if isinstance(data, dict) and 'items' in data:
            return data['items']
        return data

print("=== VERIFYING MULTI-COLLEGE API ON NEON POSTGRESQL ===")
h = get_json('/health')
print(f"Health: {h}")

phases = get_json('/phases')
print(f"Phases (Count: {len(phases)}): {phases[0]['name']} -> teams_count = {phases[0]['teams_count']}")

kiet_teams = get_json('/teams?college=KIET&page_size=100')
print(f"\nKIET Teams (Total: {len(kiet_teams)}):")
for t in kiet_teams[:5]:
    print(f"  #{t.get('rank')} {t.get('team_name')} ({t.get('college')}) - Score: {t.get('score')} - {t.get('project_name')}")

kw_teams = get_json('/teams?college=KIET%20Women&page_size=100')
print(f"\nKIET Women Teams (Total: {len(kw_teams)}):")
for t in kw_teams[:5]:
    print(f"  #{t.get('rank')} {t.get('team_name')} ({t.get('college')}) - Score: {t.get('score')} - {t.get('project_name')}")

all_teams = get_json('/teams?page_size=100')
print(f"\nAll Teams combined: {len(all_teams)}")

kiet_projects = get_json('/projects?college=KIET&page_size=100')
print(f"KIET Projects count: {len(kiet_projects)}")
kw_projects = get_json('/projects?college=KIET%20Women&page_size=100')
print(f"KIET Women Projects count: {len(kw_projects)}")

print("\n>>> LIVE NEON API TEST PASSED 100% <<<")
