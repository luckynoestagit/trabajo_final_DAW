from rest_framework import serializers
from menu.models import Productor


class ProductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productor
        fields = ['id', 'nombre', 'tipo', 'ubicacion', 'descripcion', 'imagen', 'activo']