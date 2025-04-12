# React-Django Google Sheets Integration (TGSRTC)

A full-stack application that allows users to submit form data through a React frontend, processed by a Django backend, and dynamically stored in a Google Sheet using the Google Sheets API.

---

## 🚀 Features

- React frontend form for user input.
- Django REST API backend to process submissions.
- Google Sheets integration for dynamic data storage.
- Automatically creates new sheets and headers based on form inputs.
- Checks for existing dates to prevent duplicate entries.

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios
- **Backend**: Django, Django REST Framework
- **Database/Storage**: Google Sheets via Google Sheets API
- **Other**: Python, Google Cloud Service Account

---

## ⚙️ Setup Instructions

### 🔐 Prerequisites
- Python 3.x
- Node.js + npm
- Google Cloud service account JSON (`credentials.json`) with access to Google Sheets API
- Google Sheet created with correct permissions

### 🧰 Backend Setup

```bash
cd backend
pip install -r requirements.txt  # Include Django, djangorestframework, google-api-python-client, etc.
python manage.py makemigrations
python manage.py migrate
python manage.py runserver



