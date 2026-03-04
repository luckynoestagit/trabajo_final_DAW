from rest_framework import viewsets, permissions
from menu.models import Producto
from menu.serializers import ProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(is_active=True)
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]  # dejaremos publico de momento