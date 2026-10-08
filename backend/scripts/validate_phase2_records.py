import json

# Compile all raw Phase 2 data records

# Dataset 1: Room 2
room2_data = [
    {"source_id": "1", "leader": "LAKSHMI NARAYANA", "project": "VAYA FOOTWARE", "real_biz": 10, "chatbot": 18, "db": 8, "platform": 10, "team_stack": 8, "pres": 5, "total": 59, "grade_src": "Needs Improvement", "notes": None, "room": "Room 2"},
    {"source_id": "2", "leader": "G SRUTHI", "project": "DHANVI COLLECTIONS", "real_biz": 10, "chatbot": 10, "db": 7, "platform": 8, "team_stack": 9, "pres": 5, "total": 49, "grade_src": "Needs Improvement", "notes": None, "room": "Room 2"},
    {"source_id": "4", "leader": "SATYA", "project": "EVENT EASE", "real_biz": 10, "chatbot": 10, "db": 13, "platform": 8, "team_stack": 8, "pres": 5, "total": 54, "grade_src": "Needs Improvement", "notes": None, "room": "Room 2"},
    {"source_id": "5", "leader": "EASWER", "project": "NIVARA GREENS", "real_biz": 10, "chatbot": 15, "db": 12, "platform": 17, "team_stack": 12, "pres": 8, "total": 74, "grade_src": "Passed", "notes": None, "room": "Room 2"},
    {"source_id": "7(CS)", "leader": "SAI SUDHEER", "project": "FITORA", "real_biz": 12, "chatbot": 18, "db": 14, "platform": 18, "team_stack": 15, "pres": 10, "total": 87, "grade_src": "Top Performer", "notes": None, "room": "Room 2"},
    {"source_id": "8", "leader": "SATYA NAYARAYANA", "project": "TRIPURA MEDICAL SYSTEM", "real_biz": 12, "chatbot": 15, "db": 10, "platform": 17, "team_stack": 12, "pres": 8, "total": 74, "grade_src": "Passed", "notes": "FOR THEIR CUSSION", "room": "Room 2"},
    {"source_id": "3", "leader": "G ANILE", "project": "V FOODS", "real_biz": 10, "chatbot": 12, "db": 8, "platform": 12, "team_stack": 10, "pres": 8, "total": 60, "grade_src": "Passed", "notes": None, "room": "Room 2"},
    {"source_id": "9", "leader": "SHYAM", "project": None, "real_biz": 10, "chatbot": 12, "db": 8, "platform": 12, "team_stack": 10, "pres": 8, "total": 60, "grade_src": "Passed", "notes": None, "room": "Room 2"},
    {"source_id": "12", "leader": "P SUGUBNS", "project": "EVERBLUE", "real_biz": 10, "chatbot": 10, "db": 7, "platform": 8, "team_stack": 9, "pres": 5, "total": 49, "grade_src": "Needs Improvement", "notes": None, "room": "Room 2"},
    {"source_id": "10", "leader": "R SATYA JAGAN", "project": "CAKE BOX", "real_biz": 14, "chatbot": 14, "db": 12, "platform": 18, "team_stack": 12, "pres": 9, "total": 79, "grade_src": "Passed", "notes": None, "room": "Room 2"},
    {"source_id": "11", "leader": "A MANI KANTA", "project": "A RUDRA MOBILE SOTRES", "real_biz": 12, "chatbot": 17, "db": 12, "platform": 18, "team_stack": 12, "pres": 9, "total": 80, "grade_src": "Top Performer", "notes": None, "room": "Room 2"},
    {"source_id": "13", "leader": "P SURYA TEJA", "project": "DDHOUSE", "real_biz": 12, "chatbot": 17, "db": 12, "platform": 15, "team_stack": 12, "pres": 9, "total": 77, "grade_src": "Passed", "notes": None, "room": "Room 2"},
    {"source_id": "6", "leader": "VENKATESH", "project": None, "real_biz": 12, "chatbot": 15, "db": 13, "platform": 17, "team_stack": 12, "pres": 9, "total": 78, "grade_src": "Passed", "notes": None, "room": "Room 2"},
]

# Dataset 2: Room 4
room4_data = [
    {"source_id": "1", "leader": "K.AKHILA", "project": "AI POWERED BUSINESS MANAGEMENT", "real_biz": 7, "chatbot": 5, "db": 2, "platform": 15, "team_stack": 6, "pres": 8, "total": 43, "grade_src": "Needs", "notes": None, "room": "Room 4"},
    {"source_id": "2", "leader": "S. BHARATH SAI", "project": "FOOD PET STORE", "real_biz": 7, "chatbot": 7, "db": 10, "platform": 10, "team_stack": 8, "pres": 5, "total": 47, "grade_src": "Needs", "notes": None, "room": "Room 4"},
    {"source_id": "3", "leader": "AVS.SIRISHA", "project": "CHARMS HUB", "real_biz": 10, "chatbot": 16, "db": 12, "platform": 15, "team_stack": 9, "pres": 5, "total": 67, "grade_src": "Passed", "notes": None, "room": "Room 4"},
    {"source_id": "4", "leader": "P.VEDHA", "project": "SWEET VISIONARIES", "real_biz": 10, "chatbot": 15, "db": 10, "platform": 15, "team_stack": 8, "pres": 10, "total": 68, "grade_src": "Passed", "notes": None, "room": "Room 4"},
    {"source_id": "5", "leader": "Y.SUHARSHA", "project": "DUDE ECOMMERCE", "real_biz": 7, "chatbot": 5, "db": 5, "platform": 6, "team_stack": 5, "pres": 5, "total": 33, "grade_src": "Needs", "notes": None, "room": "Room 4"},
    {"source_id": "6", "leader": "K.BHAVANASRI", "project": "FASHION GRID", "real_biz": 10, "chatbot": 16, "db": 10, "platform": 18, "team_stack": 8, "pres": 10, "total": 72, "grade_src": "Passed", "notes": None, "room": "Room 4"},
    {"source_id": "7", "leader": "K.JYOTHIKA", "project": "ARIVA BAKES", "real_biz": 10, "chatbot": 16, "db": 10, "platform": 18, "team_stack": 8, "pres": 9, "total": 71, "grade_src": "Passed", "notes": None, "room": "Room 4"},
    {"source_id": "8", "leader": "A.VENKAT SURESH", "project": "PG FINDER", "real_biz": 5, "chatbot": 12, "db": 5, "platform": 15, "team_stack": 7, "pres": 10, "total": 54, "grade_src": "Needs", "notes": None, "room": "Room 4"},
    {"source_id": "9", "leader": "J.YASWANTH", "project": "AI TELECALLER", "real_biz": 12, "chatbot": 20, "db": 15, "platform": 19, "team_stack": 12, "pres": 10, "total": 88, "grade_src": "Top Performer", "notes": None, "room": "Room 4"},
]

# Dataset 3: Room 3
# Note: Real Business Column in Room 3 contained text annotations like "INSTAGRAM(15)", "FAMILY".
# Total in sheet was recorded as sum of remaining 5 columns:
# e.g. Team 25: 14+8+12+7+5 = 46.
# Team 9 (O.LAVANYA): real_biz text "INSTARGRAM(15)", chatbot 20, db 12, platform 7, team 8, pres 7 -> total 54 (Wait: 20+12+7+8+7 = 54).
# Team 5 (DHEERAJ): real_biz "FAMILY", chatbot 19, db 7, platform 13, team 8, pres 5 -> total 52 (Wait: 19+7+13+8+5 = 52).
room3_data = [
    {"source_id": "25", "leader": "VINOD KUMAR", "project": "RAJU FITNESS", "real_biz_raw": "FAMILY", "real_biz": None, "chatbot": 14, "db": 8, "platform": 12, "team_stack": 7, "pres": 5, "total": 46, "grade_src": "C", "notes": "CODEBASE WAS NOT GOOD AND", "room": "Room 3"},
    {"source_id": "3(CSC)", "leader": "CH.SUNIL", "project": "TOFHEY HYD", "real_biz_raw": "INSTAGRAM(15)", "real_biz": 15, "chatbot": 10, "db": 7, "platform": 16, "team_stack": 8, "pres": 7, "total": 48, "grade_src": "C", "notes": "CODEBASE WAS NOT GOOD AND", "room": "Room 3"},
    {"source_id": "2", "leader": "K.ASHOK", "project": "INDIAN HANDICRAFTS", "real_biz_raw": "INSTAGRAM(15)", "real_biz": 15, "chatbot": 15, "db": 8, "platform": 9, "team_stack": 10, "pres": 8, "total": 50, "grade_src": "B", "notes": "PROJECT WAS GOOD TEAM", "room": "Room 3"},
    {"source_id": "8", "leader": "R.GANESH", "project": "SREE RAJ JEWLLERS", "real_biz_raw": "INSTAGRAM(10)", "real_biz": 10, "chatbot": 7, "db": 4, "platform": 3, "team_stack": 4, "pres": 4, "total": 22, "grade_src": "D", "notes": "CODEBASE WAS NOT GOOD AND", "room": "Room 3"},
    {"source_id": "4", "leader": "JATHIN", "project": "BOOK MY DÉCOR", "real_biz_raw": "INSTAGRAM(10)", "real_biz": 10, "chatbot": 9, "db": 7, "platform": 10, "team_stack": 10, "pres": 9, "total": 45, "grade_src": "C", "notes": "PROJECT WAS GOOD TEAM", "room": "Room 3"},
    {"source_id": "21", "leader": "RESHMA", "project": "RESIN ARTS", "real_biz_raw": "INSTAGRAM(15)", "real_biz": 15, "chatbot": 0, "db": 6, "platform": 16, "team_stack": 8, "pres": 8, "total": 38, "grade_src": "D", "notes": "CODEBASE WAS NOT GOOD AND", "room": "Room 3"},
    {"source_id": "9", "leader": "O.LAVANYA", "project": "MATRIX", "real_biz_raw": "INSTARGRAM(15)", "real_biz": 15, "chatbot": 20, "db": 12, "platform": 7, "team_stack": 8, "pres": 7, "total": 54, "grade_src": "A", "notes": "PROJECT WAS GOOD TEAM", "room": "Room 3"},
    {"source_id": "6", "leader": "M.SNEHA", "project": "STAYFINED.AI", "real_biz_raw": "INSTAGRAM", "real_biz": None, "chatbot": 0, "db": 0, "platform": 0, "team_stack": 0, "pres": 8, "total": 8, "grade_src": "D", "notes": "INFORMED TO RAJESH SIR CODE", "room": "Room 3"},
    {"source_id": "3(CSM)", "leader": "V.DEVI VARSHINI", "project": "JUSTLOOK", "real_biz_raw": "INSTAGRAM(15)", "real_biz": 15, "chatbot": 21, "db": 11, "platform": 13, "team_stack": 9, "pres": 7, "total": 61, "grade_src": "A", "notes": "PROMOTED TO FINAL REVIEWS", "room": "Room 3"},
    {"source_id": "2", "leader": "SUSHMA", "project": "SMARTFITNESS", "real_biz_raw": "INSTAGRAM(10)", "real_biz": 10, "chatbot": 17, "db": 6, "platform": 10, "team_stack": 8, "pres": 9, "total": 50, "grade_src": "A", "notes": "PROJECT WAS GOOD TEAM", "room": "Room 3"},
    {"source_id": "1(CSM)", "leader": "KRISHNA VAMSI", "project": "SAMPRADYA FOOD ORDERING", "real_biz_raw": "INSTAGRAM", "real_biz": None, "chatbot": 20, "db": 11, "platform": 14, "team_stack": 13, "pres": 7, "total": 65, "grade_src": "A", "notes": "PROMOTED TO FINAL REVIEWS", "room": "Room 3"},
    {"source_id": "5", "leader": "DHEERAJ", "project": "V MAKE OVER", "real_biz_raw": "FAMILY", "real_biz": None, "chatbot": 19, "db": 7, "platform": 13, "team_stack": 8, "pres": 5, "total": 52, "grade_src": "A", "notes": "PROJECT WAS GOOD TEAM", "room": "Room 3"},
]

# Dataset 4: Room A-304
roomA304_data = [
    {"source_id": "Team 13", "leader": "parmila", "project": "Booking Systems", "real_biz": 10, "chatbot": 20, "db": 10, "platform": 10, "team_stack": 10, "pres": 5, "total": 65, "grade_src": "Passed", "notes": "Team Cordination is missing", "room": "Room A-304"},
    {"source_id": "Team 19", "leader": "ramesh", "project": "Kalyani Restaurent", "real_biz": 13, "chatbot": 15, "db": 10, "platform": 18, "team_stack": 10, "pres": 9, "total": 75, "grade_src": "Passed", "notes": "Communication skills , Bussiness Idea and Presentation was good but Rag Implemention is not accurate but Overall performance is good", "room": "Room A-304"},
    {"source_id": "Team 16", "leader": "ramavathi", "project": "Bistoland caffe", "real_biz": 10, "chatbot": 10, "db": 8, "platform": 8, "team_stack": 5, "pres": 4, "total": 45, "grade_src": "Needs Improvement", "notes": "Lack of communication skills and cordination and Rag is not working properly", "room": "Room A-304"},
    {"source_id": "Team 18", "leader": "pavan santhosh", "project": "Ganapathi Gardens", "real_biz": 13, "chatbot": 17, "db": 12, "platform": 15, "team_stack": 12, "pres": 8, "total": 77, "grade_src": "Passed", "notes": "Overall performance is good", "room": "Room A-304"},
    {"source_id": "Team 10", "leader": "sampath", "project": "Ram n Ram Rentals", "real_biz": 8, "chatbot": 12, "db": 8, "platform": 12, "team_stack": 8, "pres": 5, "total": 53, "grade_src": "Needs Improvement", "notes": "Rag is not working Properly and tech stack not explained clearly", "room": "Room A-304"},
    {"source_id": "Team 15", "leader": "suresh", "project": "Marg Party House", "real_biz": 12, "chatbot": 17, "db": 10, "platform": 10, "team_stack": 7, "pres": 7, "total": 63, "grade_src": "Passed", "notes": "Rag was not working", "room": "Room A-304"},
    {"source_id": "Team 14", "leader": "rahim", "project": "Kadili", "real_biz": 7, "chatbot": 10, "db": 7, "platform": 9, "team_stack": 5, "pres": 5, "total": 43, "grade_src": "Needs Improvement", "notes": "Rag is not working Properly and tech stack not explained clearly", "room": "Room A-304"},
    {"source_id": "Team 20", "leader": "shyamala", "project": "Adireddy Events & Facilitators", "real_biz": 12, "chatbot": 10, "db": 7, "platform": 15, "team_stack": 9, "pres": 7, "total": 60, "grade_src": "Passed", "notes": "Rag is not working properly", "room": "Room A-304"},
    {"source_id": "Team 11", "leader": "dhanunjay", "project": "Iron Peak Fitnass", "real_biz": 9, "chatbot": 10, "db": 7, "platform": 12, "team_stack": 8, "pres": 7, "total": 53, "grade_src": "Needs Improvement", "notes": "Rag is not working Properly and tech stack not explained clearly", "room": "Room A-304"},
    {"source_id": "Team 17", "leader": "pujitha", "project": "Skin Glow", "real_biz": 10, "chatbot": 18, "db": 10, "platform": 15, "team_stack": 10, "pres": 7, "total": 70, "grade_src": "Passed", "notes": "Overall performance is good", "room": "Room A-304"},
    {"source_id": "Team 12", "leader": "mounika", "project": "E-commers", "real_biz": 10, "chatbot": 3, "db": 3, "platform": 3, "team_stack": 3, "pres": 3, "total": 25, "grade_src": "Needs Improvement", "notes": "Project was not completed", "room": "Room A-304"},
]

# Top 5 Unresolved references (Room 1)
room1_unresolved = [
    {"source_id": "01", "leader": None, "project": None, "real_biz": None, "chatbot": None, "db": None, "platform": None, "team_stack": None, "pres": None, "total": 88, "grade_src": "Top Performer", "notes": "Unresolved source record from Phase 2 Top 5 source", "room": "Room 1", "rank": 1, "is_unresolved": True},
    {"source_id": "02", "leader": None, "project": None, "real_biz": None, "chatbot": None, "db": None, "platform": None, "team_stack": None, "pres": None, "total": 80, "grade_src": "Top Performer", "notes": "Unresolved source record from Phase 2 Top 5 source", "room": "Room 1", "rank": 4, "is_unresolved": True},
]

all_records = room2_data + room4_data + room3_data + roomA304_data + room1_unresolved
print(f"Total Phase 2 records compiled: {len(all_records)}")

# Validation checks:
# 1. Total score vs sum of component scores
score_mismatches = []
score_anomalies = []
unresolved_fields = []

for r in all_records:
    if r.get("is_unresolved"):
        unresolved_fields.append((r["room"], r["source_id"], "Leader & Project not provided"))
        continue

    if not r["leader"]:
        unresolved_fields.append((r["room"], r["source_id"], "Leader missing"))
    if not r["project"]:
        unresolved_fields.append((r["room"], r["source_id"], "Project missing"))

    # Check component scores limits
    limits = [
        ("Real Business", r["real_biz"], 15),
        ("Chatbot & RAG", r["chatbot"], 25),
        ("Database", r["db"], 15),
        ("Platform", r["platform"], 20),
        ("Team Stack", r["team_stack"], 15),
        ("Presentation", r["pres"], 10),
    ]
    for comp_name, val, max_val in limits:
        if val is not None and val > max_val:
            score_anomalies.append((r["room"], r["source_id"], r["leader"], comp_name, val, f"Exceeds max {max_val}"))

    # Check sum
    comps = [r["real_biz"] or 0, r["chatbot"] or 0, r["db"] or 0, r["platform"] or 0, r["team_stack"] or 0, r["pres"] or 0]
    comp_sum = sum(comps)
    if comp_sum != r["total"]:
        score_mismatches.append((r["room"], r["source_id"], r["leader"], f"Component sum {comp_sum} != recorded total {r['total']}", r.get("real_biz_raw")))

print(f"\n--- SCORE MISMATCHES ({len(score_mismatches)}) ---")
for m in score_mismatches:
    print(m)

print(f"\n--- SCORE ANOMALIES ({len(score_anomalies)}) ---")
for a in score_anomalies:
    print(a)

print(f"\n--- UNRESOLVED / MISSING FIELDS ({len(unresolved_fields)}) ---")
for u in unresolved_fields:
    print(u)
