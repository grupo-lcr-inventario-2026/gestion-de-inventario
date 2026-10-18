from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usuarios.models import Usuario
from productos.models import Producto
from movimientos.models import Movimiento



class ResumenView(APIView):

    def get(self, request):
     
        preparados = Movimiento.objects.filter(tipo='preparacion').count()

        pendientes = Producto.objects.exclude(estado='almacenado').count()

        empleados_activos = Usuario.objects.filter(rol='empleado', activo=True).count()

        datos = {
            'productosPreparados': preparados,
            'productosPendientes': pendientes,
            'empleadosActivos': empleados_activos,
        }
        return Response(datos, status=status.HTTP_200_OK)