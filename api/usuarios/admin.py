from django.contrib import admin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellido', 'email', 'rol', 'activo')
    list_filter = ('rol', 'activo')
    search_fields = ('nombre', 'apellido', 'email')
