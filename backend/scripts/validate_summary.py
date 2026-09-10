import json
from collections import Counter

with open('backend/scripts/kiet_women_structured.json', 'r', encoding='utf-8') as f:
    teams = json.load(f)

print('=== KIET WOMEN VALIDATION REPORT ===')
rolls = []
for t in teams:
    for m in t['members']:
        rolls.append(m['roll_no'])

roll_counts = Counter(rolls)
dup_rolls = {k: v for k, v in roll_counts.items() if v > 1}
print(f'Total Teams: {len(teams)}')
print(f'Total Student Memberships: {len(rolls)}')
print(f'Unique Roll Numbers: {len(set(rolls))}')
if dup_rolls:
    print('Duplicate roll numbers found:', dup_rolls)
else:
    print('Zero duplicate roll numbers. Every student has a unique institutional roll number.')

# Check missing project names or leads
missing_projs = [t['team_code'] for t in teams if not t.get('project_name')]
missing_leads = [t['team_code'] for t in teams if not t.get('lead_name')]
print('Missing Project Names:', missing_projs if missing_projs else 'None (0)')
print('Missing Lead Names:', missing_leads if missing_leads else 'None (0)')

# Print Leaderboard preview
evaluated = [t for t in teams if t.get('score') is not None]
evaluated.sort(key=lambda x: x['score'], reverse=True)
print('\n=== TOP 10 LEADERBOARD PREVIEW ===')
for t in evaluated[:10]:
    print(f"#{t.get('rank')} | {t['team_name']} ({t['dept']}) | Lead: {t['lead_name']} | Proj: {t['project_name']} | Score: {t['score']} | Grade: {t['grade']}")

print('\n=== DISQUALIFIED TEAMS ===')
disqualified = [t for t in teams if t.get('status') == 'disqualified']
for t in disqualified:
    print(f"{t['team_code']} | {t['team_name']} ({t['dept']}) | Lead: {t['lead_name']} | Reason: {t.get('evaluator_notes')}")
