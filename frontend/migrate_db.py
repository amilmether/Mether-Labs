import sqlite3

def migrate_db():
    print("Migrating database...")
    conn = sqlite3.connect('mether_workspace.db')
    cursor = conn.cursor()
    
    # Add whatsapp column to messages table
    try:
        cursor.execute("ALTER TABLE messages ADD COLUMN whatsapp VARCHAR")
        print("Added whatsapp column to messages table")
    except sqlite3.OperationalError as e:
        print(f"Message table update skipped: {e}")

    # Add whatsapp column to profile table
    try:
        cursor.execute("ALTER TABLE profile ADD COLUMN whatsapp VARCHAR")
        print("Added whatsapp column to profile table")
    except sqlite3.OperationalError as e:
        print(f"Profile table update skipped: {e}")

    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate_db()
