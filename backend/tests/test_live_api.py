import urllib.request
import json
import pytest

base = 'http://127.0.0.1:8000/api/v1'

def test_api():
    try:
        urllib.request.urlopen(f'{base}/health', timeout=1.0)
    except Exception as e:
        pytest.skip(f"Live server at {base} is not reachable ({e}). Skipping live API test.")

    phases = json.loads(urllib.request.urlopen(f'{base}/phases').read().decode())
    print('Phase 1 Live Counts:', phases[0]['name'], '| Teams:', phases[0]['teams_count'])

    teams_resp = json.loads(urllib.request.urlopen(f'{base}/teams?limit=5').read().decode())
    print('Teams Total:', teams_resp['total'])
    for t in teams_resp['items']:
        print(f"#{t['rank']} {t['team_name']} ({t['department']}) - Score: {t['score']} - {t['project_name']}")

    projects_resp = json.loads(urllib.request.urlopen(f'{base}/projects?limit=5').read().decode())
    print('\nProjects Total:', projects_resp['total'])
    for p in projects_resp['items']:
        print(f"{p['project_name']} by {p['team_name']} ({p['college']})")

    # Team detail test
    first_id = teams_resp['items'][0]['id']
    team_detail = json.loads(urllib.request.urlopen(f'{base}/teams/{first_id}').read().decode())
    print(f"\nTeam Detail for {team_detail['team_name']}:")
    print(f"  Members count: {len(team_detail['members'])}")
    for m in team_detail['members']:
        print(f"    - {m['name']} (Roll: {m['participant_id']}, {m['college']})")

if __name__ == '__main__':
    test_api()
