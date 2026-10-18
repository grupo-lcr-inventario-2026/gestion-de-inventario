
from django.urls import path
from .views import ContactosView


urlpatterns = [
    path('contactos', ContactosView.as_view()),
]
