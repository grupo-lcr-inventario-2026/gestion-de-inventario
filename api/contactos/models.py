
from django.db import models


class Contacto(models.Model):
    empresa = models.CharField(max_length=100)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    mensaje = models.TextField()

    class Meta:
        db_table = 'contactos'

    def __str__(self):
        return f'{self.nombre} - {self.empresa}'

