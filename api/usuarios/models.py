from django.db import models


class Usuario(models.Model):
    ROLES = [
        ('admin', 'Administrador'),
        ('empleado', 'Empleado'),
    ]

    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(max_length=120, unique=True)
    password = models.CharField(max_length=128)
    rol = models.CharField(max_length=10, choices=ROLES, default='empleado')
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return f'{self.nombre} {self.apellido} ({self.email})'
