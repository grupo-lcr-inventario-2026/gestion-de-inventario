from rest_framework import serializers
from .models import Producto, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']


class ProductoSerializer(serializers.ModelSerializer):
    # La categoria viaja como su nombre (texto), no como id.
    categoria = serializers.SlugRelatedField(
        slug_field='nombre', queryset=Categoria.objects.all())
    # En el JSON se llama cantidadPendiente; en la base, cantidad_pendiente.
    cantidadPendiente = serializers.IntegerField(
        source='cantidad_pendiente', min_value=0, required=False)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria', 'precio', 'stock',
                  'ubicacion', 'estado', 'cantidadPendiente']
