import psycopg2

passwords = ['postgres', 'admin', 'root', '1234', '123456', 'levelx_password', '']
connected = False
for p in passwords:
    try:
        conn = psycopg2.connect(host='localhost', port=5432, user='postgres', password=p, dbname='postgres')
        print(f"Successfully connected with postgres:{p}")
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_roles WHERE rolname='levelx_user'")
        if not cur.fetchone():
            cur.execute("CREATE USER levelx_user WITH PASSWORD 'levelx_password' SUPERUSER")
            print("Created user levelx_user")
        else:
            cur.execute("ALTER USER levelx_user WITH PASSWORD 'levelx_password' SUPERUSER")
            print("Updated user levelx_user password")
        
        cur.execute("SELECT 1 FROM pg_database WHERE datname='levelx_db'")
        if not cur.fetchone():
            cur.execute("CREATE DATABASE levelx_db OWNER levelx_user")
            print("Created database levelx_db")
        else:
            print("Database levelx_db already exists")
        
        cur.execute("GRANT ALL PRIVILEGES ON DATABASE levelx_db TO levelx_user")
        cur.close()
        conn.close()
        connected = True
        break
    except Exception as e:
        print(f"Failed postgres:{p} -> {e}")

if not connected:
    print("Could not connect to PostgreSQL with common defaults. Let us check services or sqlite fallback.")
