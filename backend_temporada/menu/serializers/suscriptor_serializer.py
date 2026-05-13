from rest_framework import serializers
from menu.models import Suscriptor

class SuscriptorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscriptor
        fields = ['id', 'email', 'fecha_registro']