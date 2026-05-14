from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from menu.models import Reserva
from menu.serializers import ReservaSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        if email:
            return Reserva.objects.filter(email_cliente=email)
        if self.request.user and self.request.user.is_staff:
            return Reserva.objects.all()
        return Reserva.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            reserva = serializer.save()
            return Response(
                {'success': True, 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)