from django.urls import path
from .views import UsuariosView, UsuarioDetailView, LoginView

# Rutas sin barra final para que coincidan con los servicios de Angular.
urlpatterns = [
    path('login', LoginView.as_view()),
    path('usuarios', UsuariosView.as_view()),
    path('usuarios/<int:id>', UsuarioDetailView.as_view()),
]
