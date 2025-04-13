from django.db import models

# Create your models here.
from django.db import models, connection

class SheetMetadata(models.Model):
    sheet_name = models.CharField(max_length=100, unique=True)  # Store sheet names
    created_at = models.DateTimeField(auto_now_add=True)

    def create_dynamic_table(self):
        """
        Dynamically create a table for this sheet.
        """
        table_name = self.sheet_name
        with connection.cursor() as cursor:
            # Define table creation SQL
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
                    -- Add other generic fields here
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def __str__(self):
        return self.sheet_name

