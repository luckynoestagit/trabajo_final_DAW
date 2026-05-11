from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from menu.models import Mensaje
from menu.serializers import MensajeSerializer

class MensajeViewSet(viewsets.ModelViewSet):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Mensaje.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)