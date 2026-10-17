from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from usuarios.models import Usuario



class ResumenView(APIView):

    def get(self, request):
        empleados_activos = Usuario.objects.filter(activo=True).count()

        datos = {
            'productosPreparados': 0,    
            'productosPendientes': 0,    
            'empleadosActivos': empleados_activos,
        }
        return Response(datos, status=status.HTTP_200_OK)
