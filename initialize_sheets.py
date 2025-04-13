import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "for_api.settings")  # Replace 'yourproject' with your project name
django.setup()

from form_api.models import SheetTable  # Replace 'yourapp' with your app's name
from form_api.utils import create_table_for_sheet

from form_api.models import SheetMetadata  # Replace `myapp` with your app name

SHEET_NAMES = ["RNG", "FM", "MBNR", "MHBD"]  # Extend with all your sheet names

def initialize_sheets():
    for sheet_name in SHEET_NAMES:
        # Create metadata for each sheet
        sheet, created = SheetMetadata.objects.get_or_create(sheet_name=sheet_name)
        if created:
            print(f"Created metadata for sheet: {sheet_name}")
        # Dynamically create the corresponding table
        create_table_for_sheet(sheet_name)
        print(f"Initialized table for sheet: {sheet_name}")

if __name__ == "__main__":
    initialize_sheets()
