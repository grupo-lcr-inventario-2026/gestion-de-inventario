
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

  
    path('api/v1/', include('usuarios.urls')),
    path('api/v1/', include('productos.urls')),
    path('api/v1/', include('movimientos.urls')),
    path('api/v1/', include('contactos.urls')),
    path('api/v1/', include('resumen.urls')),

]