from rest_framework import serializers
from menu.models import Reserva

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = [
            'id', 'nombre_cliente', 'email_cliente', 'telefono_cliente',
            'fecha', 'hora', 'num_personas', 'sala',
            'observaciones', 'estado', 'fecha_creacion'
        ]
        read_only_fields = ['estado', 'fecha_creacion']