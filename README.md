# TGSRTC Depot Operations Form Management

A full-stack application developed to manage depot operational data using a React frontend and a Django backend. Form submissions are dynamically stored in both a **MySQL database** and **Google Sheets** via Apps Script, without requiring a Google Cloud account.

## 🔧 Tech Stack

- **Frontend**: React
- **Backend**: Django (Python)
- **Database**: MySQL
- **External Integration**: Google Sheets with Google Apps Script

## 📌 Features

- Simple and intuitive web form for capturing depot data
- Stores submitted data into:
  - A structured **MySQL database**
  - Corresponding **Google Sheets** (based on dynamic column mapping)
- No use of Google Cloud APIs — only Apps Script and shared sheet links

## 🚀 How It Works

1. **Frontend (React)**:

   - Provides a form for users to submit depot operation details.
   - Sends a POST request to the Django API.

2. **Backend (Django)**:

   - Accepts form data and validates it.
   - Inserts the data into a MySQL table.
   - Pushes the same data to a Google Sheet using Apps Script Web App URLs.

3. **Google Sheets**:
   - Sheets are shared and contain Apps Script functions to handle incoming requests and dynamically create/update columns.
   - Apps Script handles the insertion of new rows and creation of headers if they don’t exist.

## 📂 Folder Structure (Simplified)

react_django_integration/ ├── backend/ │ ├── form_api/ │ │ ├── views.py │ │ ├── urls.py │ │ ├── utils.py │ │ └── models.py │ └── react_django_integration/ │ └── settings.py ├── frontend/ │ └── src/ │ └── components/ │ └── Form.jsx

Google Sheets & Apps Script:

Create or open a Google Sheet and go to Extensions > Apps Script.

Paste your Apps Script code (that handles data insertion).

Deploy it as a Web App (accessible via POST).

Share the sheet with Anyone with the link access and copy the Web App URL.

Update your Django backend with this Web App URL in your utils.py.
