
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from productos.models import Producto
from usuarios.models import Usuario
from .models import Movimiento
from .serializers import MovimientoSerializer


class MovimientosView(APIView):
    """Consultar el historial de movimientos."""

    def get(self, request):
        movimientos = Movimiento.objects.select_related(
            'producto', 'usuario'
        ).all()

        serializer = MovimientoSerializer(movimientos, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ConfirmarMovimientoView(APIView):
    """Confirmar una tarea y actualizar stock e historial en una transacción."""

    def post(self, request):
        producto_id = request.data.get('productoId')
        usuario_id = request.data.get('usuarioId')
        tipo = request.data.get('tipo')

        tipos_validos = dict(Movimiento.TIPOS)

        if not producto_id or not usuario_id:
            return Response(
                {'detail': 'Debe indicar el producto y el usuario.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if tipo not in tipos_validos:
            return Response(
                {'detail': 'El tipo debe ser ingreso o preparacion.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            producto = get_object_or_404(
                Producto.objects.select_for_update(),
                id=producto_id
            )

            usuario = get_object_or_404(
                Usuario,
                id=usuario_id
            )

            cantidad = producto.cantidad_pendiente

            if cantidad <= 0:
                return Response(
                    {'detail': 'El producto no tiene una cantidad pendiente.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if tipo == 'ingreso':
                if producto.estado != 'pendiente_almacenar':
                    return Response(
                        {'detail': 'El producto no tiene un ingreso pendiente.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                producto.stock += cantidad

            elif tipo == 'preparacion':
                if producto.estado != 'pendiente_preparar':
                    return Response(
                        {'detail': 'El producto no tiene una preparación pendiente.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if producto.stock < cantidad:
                    return Response(
                        {'detail': 'No hay stock suficiente para confirmar la preparación.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                producto.stock -= cantidad

            producto.estado = 'almacenado'
            producto.cantidad_pendiente = 0

            producto.save(
                update_fields=[
                    'stock',
                    'estado',
                    'cantidad_pendiente'
                ]
            )

            movimiento = Movimiento.objects.create(
                producto=producto,
                usuario=usuario,
                tipo=tipo,
                cantidad=cantidad
            )

            serializer = MovimientoSerializer(movimiento)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
