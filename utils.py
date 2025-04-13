from django.db import connection

def create_table_for_sheet(sheet_name):
    """
    Dynamically create a table for the given sheet name.
    """
    table_name = sheet_name
    with connection.cursor() as cursor:
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                id SERIAL PRIMARY KEY,
                date DATE UNIQUE,
                PlannedSchedules INT,
                PlannedServices INT,
                PlannedKM INT,
                ActualServices INT,
                AcrualKM INT,
                TotalDrivers INT,
                MedicallyUnfit INT,
                SuspendedDrivers INT,
                WeeklyOff INT,
                SpecialOff INT,
                Other INT,
                LongLeave INT,
                SickLeave INT,
                LongAbsent INT,
                LeavesLessThan3Days INT,
                SpotAbsent INT,
                DriversRequired INT,
                DoubleDuty INT,
                OffCancellation INT,
                DriversAsConductors INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print(f"Table '{table_name}' created successfully.")

from django.db import connection

def add_column_if_not_exists(table_name, column_name, column_type="VARCHAR(255)"):
    """
    Add a new column to the table if it doesn't exist.
    """
    with connection.cursor() as cursor:
        cursor.execute(f"""
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name = %s AND column_name = %s
        """, [table_name, column_name])
        if cursor.fetchone()[0] == 0:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
            print(f"Added column '{column_name}' to table '{table_name}'.")

def insert_into_table(sheet_name, data):
    """
    Dynamically insert data into the given table, adding new columns if needed.
    """
    table_name = sheet_name

    # Ensure all keys exist as columns in the table
    for column_name in data.keys():
        if column_name != "Date":  # Avoid duplicate handling of 'Date'
            add_column_if_not_exists(table_name, column_name)

    # Build the dynamic query for insertion
    fields = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = tuple(data.values())

    with connection.cursor() as cursor:
        cursor.execute(f"""
            INSERT INTO {table_name} ({fields}) VALUES ({placeholders})
        """, values)
        print(f"Data inserted into table '{table_name}' successfully.")

def check_date_exists(sheet_name, date):
    """
    Check if a given date already exists in the table.
    """
    table_name = sheet_name
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE date = %s", [date])
        return cursor.fetchone()[0] > 0
