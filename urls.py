# This urls.py should be under your app directory Here im my case it is form_api so it is under react_django_project/form_api/urls

from django.urls import path
from .views import submit_form, login_view

urlpatterns = [
    path("submit/", submit_form, name="submit_form"),
    path("login/", login_view, name="login_view"),
]
