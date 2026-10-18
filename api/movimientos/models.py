
from django.db import models
from django.core.validators import MinValueValidator


class Movimiento(models.Model):
    TIPOS = [
        ('ingreso', 'Ingreso'),
        ('preparacion', 'Preparación'),
    ]

    producto = models.ForeignKey(
        'productos.Producto',
        on_delete=models.PROTECT,
        related_name='movimientos'
    )

    usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.PROTECT,
        related_name='movimientos'
    )

    tipo = models.CharField(
        max_length=20,
        choices=TIPOS
    )

    cantidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )

    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimientos'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.tipo} - {self.producto} - {self.cantidad}'
