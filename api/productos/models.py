from django.db import models
from django.core.validators import MinValueValidator


class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'categorias'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    ESTADOS = [
        ('almacenado', 'Almacenado'),
        ('pendiente_almacenar', 'Pendiente de almacenar'),
        ('pendiente_preparar', 'Pendiente de preparar'),
    ]

    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, related_name="productos")
    precio = models.IntegerField(validators=[MinValueValidator(0)])
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    ubicacion = models.CharField(max_length=50, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="almacenado")
    cantidad_pendiente = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'productos'

    def __str__(self):
        return self.nombre
