from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Usuario
from .serializers import UsuarioSerializer


# -------- /api/v1/usuarios --------
class UsuariosView(APIView):
    """Listar todos los usuarios (o filtrar por email) y crear uno nuevo."""

    def get(self, request):
        usuarios = Usuario.objects.all()
        # Filtro opcional por email (lo usa "recuperar contrasena" del frontend).
        email = request.query_params.get('email')
        if email:
            usuarios = usuarios.filter(email=email)
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------- /api/v1/usuarios/<id> --------
class UsuarioDetailView(APIView):
    """Ver, reemplazar (PUT), modificar en parte (PATCH) o borrar un usuario."""

    def get(self, request, id):
        usuario = get_object_or_404(Usuario, id=id)
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)

    def put(self, request, id):
        usuario = get_object_or_404(Usuario, id=id)
        serializer = UsuarioSerializer(usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        usuario = get_object_or_404(Usuario, id=id)
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        usuario = get_object_or_404(Usuario, id=id)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# -------- /api/v1/login --------
class LoginView(APIView):
    """Valida email + contrasena y devuelve el usuario si son correctos."""

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'detail': 'Email y contrasena son obligatorios.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            usuario = Usuario.objects.get(email=email, password=password, activo=True)
        except Usuario.DoesNotExist:
            return Response(
                {'detail': 'Credenciales incorrectas.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)
