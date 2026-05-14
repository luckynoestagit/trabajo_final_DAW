from django.db.models import Sum
from rest_framework import serializers
from menu.models import Reserva
import datetime

# Configuración de Aforo
AFORO_CONFIG = {
    'principal': 50,
    'terraza': 30,
}

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
            raise serializers.ValidationError('Mínimo 1 persona por reserva.')
        return value

    def validate(self, attrs):
        fecha = attrs.get('fecha')
        hora_reserva = attrs.get('hora')
        sala = attrs.get('sala')
        num_personas = attrs.get('num_personas')

        # AÑADIR: cerrado los lunes
        if fecha.weekday() == 0:
            raise serializers.ValidationError(
                "Los lunes el restaurante permanece cerrado."
            )

        # AÑADIR: máximo de personas
        if num_personas > 20:
            raise serializers.ValidationError(
                "El máximo por reserva es 20 personas."
            )

        # Definir las franjas horarias
        almuerzo_inicio = datetime.time(13, 0)
        almuerzo_fin = datetime.time(15, 30) # Margen hasta fin de servicio
        cena_inicio = datetime.time(20, 0)
        cena_fin = datetime.time(22, 30)

        # 2. Determinar en qué franja estamos para sumar el aforo total de ese bloque
        if almuerzo_inicio <= hora_reserva <= almuerzo_fin:
            rango_horas = (almuerzo_inicio, almuerzo_fin)
        elif cena_inicio <= hora_reserva <= cena_fin:
            rango_horas = (cena_inicio, cena_fin)
        else:
            raise serializers.ValidationError("La hora seleccionada está fuera de nuestro horario de servicio.")

        # 3. Calcular ocupación total en esa franja y sala
        total_ocupado = Reserva.objects.filter(
            fecha=fecha,
            hora__range=rango_horas,
            sala=sala
        ).exclude(estado='cancelada').aggregate(
            total=Sum('num_personas')
        )['total'] or 0

        limite = AFORO_CONFIG.get(sala, 50)

        # 4. Validar disponibilidad
        if total_ocupado + num_personas > limite:
            if sala == 'principal':
                raise serializers.ValidationError(
                    "Límite de comensales superado en Sala Principal. Prueba a reservar en nuestra Terraza."
                )
            else:
                raise serializers.ValidationError(
                    "Terraza completa para esta franja. Por favor, selecciona otro día o intenta en Sala Principal."
                )

        return attrs