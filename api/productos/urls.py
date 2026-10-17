from django.urls import path
from .views import (
    ProductosView, ProductoDetailView,
    CategoriasView, CategoriaDetailView,
)

# Rutas sin barra final para que coincidan con los servicios de Angular.
urlpatterns = [
    path('productos', ProductosView.as_view()),
    path('productos/<int:id>', ProductoDetailView.as_view()),
    path('categorias', CategoriasView.as_view()),
    path('categorias/<int:id>', CategoriaDetailView.as_view()),
]
