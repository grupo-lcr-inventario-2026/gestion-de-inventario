from django.contrib import admin
from .models import Categoria, Producto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'categoria', 'precio', 'stock', 'estado')
    list_filter = ('categoria', 'estado')
    search_fields = ('nombre',)
