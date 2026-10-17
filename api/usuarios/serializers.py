from rest_framework import serializers
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido', 'email', 'password', 'rol', 'activo']
        # La contrasena se puede enviar (crear/editar) pero nunca se devuelve.
        extra_kwargs = {
            'password': {'write_only': True},
        }
