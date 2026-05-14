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

    def validate_num_personas(self, value):
        if value < 1:
            raise serializers.ValidationError('Mínimo 1 persona')
        if value > 20:
            raise serializers.ValidationError('Máximo 20 personas por reserva')
        return value

    def validate(self, attrs):
        fecha = attrs.get('fecha')
        hora = attrs.get('hora')
        sala = attrs.get('sala')

        reservas_existentes = Reserva.objects.filter(
            fecha=fecha, hora=hora, sala=sala
        ).exclude(estado='cancelada')

        if reservas_existentes.count() >= 5:
            raise serializers.ValidationError(
                f'No hay disponibilidad para esa fecha/hora en {sala}. Prueba otra hora.'
            )
        return attrs