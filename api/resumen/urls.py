from django.urls import path
from .views import ResumenView

# Ruta sin barra final, igual que las de usuarios.
urlpatterns = [
    path('resumen', ResumenView.as_view()),
]