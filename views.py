
import requests
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
#from form_api.models import SheetTable
from .models import SheetMetadata
from form_api.utils import create_table_for_sheet, insert_into_table, check_date_exists
import json
import logging

logger = logging.getLogger(__name__)

# Predefined credentials for simplicity
VALID_CREDENTIALS = {
    "username": "srinivas@10",
    "password": "srinivas@1234",
}

SHEET_URLS = {
    "RNG": "https://script.google.com/macros/s/AKfycbxcF8Ef5oKan1hztQCVWmVzrCYtibuqLFU3fWCRiGPJc43ZeLJEN8k7H-wvBR3x3E5k/exec",
    "FM": "https://script.google.com/macros/s/AKfycbwsh14Z-_MsvtRYPt1tloUp4GS03xxD2ncIeJ_e9m47bYmTErJorQQ6avKqGkP-dIk/exec",
    "MBNR": "https://script.google.com/macros/s/AKfycbw4fywynYhsZoGVNi4ABIdGk3z9oSlYlq5TvqftbK5HonPmoKMAKuE8e9UWh7uYZd0_/exec",
    "MHBD": "https://script.google.com/macros/s/AKfycby0B3ohDNSDh3GYuCSiLj6o0dhRMZDEJwcBT-Y6oyzPSVpV2hYqqVDxkebUFAPboh_V1g/exec",
    # Add entries for all 97 sheets
}

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if username == VALID_CREDENTIALS["username"] and password == VALID_CREDENTIALS["password"]:
                return JsonResponse({"token": "fake-jwt-token", "message": "Login successful"})
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=401)
        except Exception as e:
            logger.error(f"Unexpected error during login: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def submit_form(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Retrieve and validate sheet name
            sheet_name = data.pop("SheetName", None)  # Remove SheetName from the data payload
            if not sheet_name:
                return JsonResponse({"error": "SheetName is required"}, status=400)

            # Ensure the table exists for the sheet
            create_table_for_sheet(sheet_name)

            # Check for duplicate Date
            if "Date" in data and check_date_exists(sheet_name, data["Date"]):
                return JsonResponse({"error": f"Date '{data['Date']}' already exists in '{sheet_name}'"}, status=400)

            # Insert data into the table
            insert_into_table(sheet_name, data)

            return JsonResponse({"message": "Data submitted successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)
@csrf_exempt
def get_submitted_data(request):
    if request.method == "GET":
        try:
            sheet_name = request.GET.get("SheetName", None)
            if not sheet_name:
                return JsonResponse({"error": "SheetName is required"}, status=400)

            # Fetch data for the selected sheet
            data = list(SheetTable.objects.filter(sheet_name=sheet_name).values())
            return JsonResponse({"data": data}, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)
