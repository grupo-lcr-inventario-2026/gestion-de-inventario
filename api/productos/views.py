
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer


# -------- /api/v1/productos --------
class ProductosView(APIView):
    """Listar todos los productos y crear uno nuevo."""

    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = ProductoSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# -------- /api/v1/productos/<id> --------
class ProductoDetailView(APIView):
    """Consultar, reemplazar, modificar o eliminar un producto."""

    def get(self, request, id):
        producto = get_object_or_404(Producto, id=id)

        return Response(
            ProductoSerializer(producto).data,
            status=status.HTTP_200_OK
        )

    def put(self, request, id):
        producto = get_object_or_404(Producto, id=id)

        serializer = ProductoSerializer(
            producto,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, id):
        producto = get_object_or_404(Producto, id=id)

        estado_nuevo = request.data.get(
            'estado',
            producto.estado
        )

        cantidad_nueva = request.data.get(
            'cantidadPendiente',
            producto.cantidad_pendiente
        )

        # Validaciones específicas para solicitar una preparación.
        if estado_nuevo == 'pendiente_preparar':

            try:
                cantidad_nueva = int(cantidad_nueva)

            except (TypeError, ValueError):
                return Response(
                    {
                        'detail': 'La cantidad debe ser un número entero.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if cantidad_nueva <= 0:
                return Response(
                    {
                        'detail': (
                            'La cantidad a preparar debe ser mayor que cero.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if producto.estado != 'almacenado':
                return Response(
                    {
                        'detail': (
                            'El producto ya tiene una tarea pendiente.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if cantidad_nueva > producto.stock:
                return Response(
                    {
                        'detail': (
                            f'No hay suficiente stock. '
                            f'Disponible: {producto.stock}.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Si pasa las validaciones, se guarda la modificación.
        serializer = ProductoSerializer(
            producto,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        producto.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# -------- /api/v1/categorias --------
class CategoriasView(APIView):
    """Listar las categorías y crear una nueva."""

    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = CategoriaSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# -------- /api/v1/categorias/<id> --------
class CategoriaDetailView(APIView):
    """Eliminar una categoría si no tiene productos asociados."""

    def delete(self, request, id):
        categoria = get_object_or_404(Categoria, id=id)

        if categoria.productos.exists():
            return Response(
                {
                    'detail': (
                        'No se puede borrar: la categoría tiene productos.'
                    )
                },
                status=status.HTTP_409_CONFLICT
            )

        categoria.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
