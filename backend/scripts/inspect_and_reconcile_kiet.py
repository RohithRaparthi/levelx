import json
import re

with open('backend/scripts/kiet_excel_dump.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

print("=== RECONCILING KIET EXCEL DATA WITH EVALUATION SHEETS ===")

form_responses = raw.get('Form Responses 1', [])
kiet_data = raw.get('KIET DATA', [])
gcc_data = raw.get('Room GCC DATA', [])
khub_data = raw.get('Room K-Hub DATA', [])

print(f"Form Responses: {len(form_responses)}")
print(f"KIET DATA: {len(kiet_data)}")
print(f"Room GCC: {len(gcc_data)}")
print(f"Room K-Hub: {len(khub_data)}")

# Print all GCC rows
print("\n--- Room GCC Teams ---")
for r in gcc_data:
    print(r)

# Print all K-Hub rows
print("\n--- Room K-Hub Teams ---")
for r in khub_data:
    print(r)
