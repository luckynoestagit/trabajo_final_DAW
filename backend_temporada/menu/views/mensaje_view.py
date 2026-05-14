from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from menu.models import Mensaje
from menu.serializers import MensajeSerializer


class MensajeViewSet(viewsets.ModelViewSet):
    serializer_class = MensajeSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Mensaje.objects.all()
        return Mensaje.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'success': True, 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)