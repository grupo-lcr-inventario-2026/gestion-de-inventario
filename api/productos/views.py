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
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------- /api/v1/productos/<id> --------
class ProductoDetailView(APIView):
    """Ver, reemplazar (PUT), modificar en parte (PATCH) o borrar un producto."""

    def get(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        return Response(ProductoSerializer(producto).data)

    def put(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        serializer = ProductoSerializer(producto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# -------- /api/v1/categorias --------
class CategoriasView(APIView):
    """Listar las categorias y crear una nueva."""

    def get(self, request):
        categorias = Categoria.objects.all()
        return Response(CategoriaSerializer(categorias, many=True).data)

    def post(self, request):
        serializer = CategoriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------- /api/v1/categorias/<id> --------
class CategoriaDetailView(APIView):
    """Borrar una categoria (si no tiene productos)."""

    def delete(self, request, id):
        categoria = get_object_or_404(Categoria, id=id)
        # Si hay productos en esta categoria no se puede borrar.
        if categoria.productos.exists():
            return Response(
                {'detail': 'No se puede borrar: la categoria tiene productos.'},
                status=status.HTTP_409_CONFLICT,
            )
        categoria.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
