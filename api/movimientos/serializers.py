
from rest_framework import serializers

from .models import Movimiento
from productos.models import Producto
from usuarios.models import Usuario


class MovimientoSerializer(serializers.ModelSerializer):
    productoId = serializers.PrimaryKeyRelatedField(
        source='producto',
        queryset=Producto.objects.all()
    )

    usuarioId = serializers.PrimaryKeyRelatedField(
        source='usuario',
        queryset=Usuario.objects.all()
    )

    fecha = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Movimiento
        fields = [
            'id',
            'productoId',
            'tipo',
            'cantidad',
            'fecha',
            'usuarioId'
        ]
        read_only_fields = ['id', 'fecha']



