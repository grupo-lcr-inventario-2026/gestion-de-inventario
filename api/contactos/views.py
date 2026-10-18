

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

from .models import Contacto
from .serializers import ContactoSerializer


class ContactosView(APIView):
    """Listar los contactos y crear uno nuevo."""

    parser_classes = [FormParser, MultiPartParser, JSONParser]

    def get(self, request):
        contactos = Contacto.objects.all()
        serializer = ContactoSerializer(contactos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ContactoSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
