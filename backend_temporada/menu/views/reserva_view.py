from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from menu.models import Reserva
from menu.serializers import ReservaSerializer

class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Reserva.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)