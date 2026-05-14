from rest_framework import viewsets, permissions
from menu.models import Producto
from menu.serializers import ProductoSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return Producto.objects.filter(is_active=True)