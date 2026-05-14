from rest_framework import serializers
from menu.models import Mensaje

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = [
            'id', 'nombre', 'email', 'telefono',
            'asunto', 'mensaje', 'estado',
            'respuesta', 'fecha_envio'
        ]
        read_only_fields = ['estado', 'respuesta', 'fecha_envio']