from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usuarios.models import Usuario
from productos.models import Producto



class ResumenView(APIView):
    """Calcula y devuelve los totales para la pantalla Resumen."""

    def get(self, request):
        
        empleados_activos = Usuario.objects.filter(rol='empleado', activo=True).count()

        
        pendientes = Producto.objects.exclude(estado='almacenado').count()

        datos = {
            'productosPreparados': 0,  
            'productosPendientes': pendientes,
            'empleadosActivos': empleados_activos,
        }
        return Response(datos, status=status.HTTP_200_OK)