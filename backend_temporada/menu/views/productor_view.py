from rest_framework import viewsets, permissions
from menu.models import Productor
from menu.serializers import ProductorSerializer


class ProductorViewSet(viewsets.ModelViewSet):
    serializer_class = ProductorSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Productor.objects.filter(activo=True)