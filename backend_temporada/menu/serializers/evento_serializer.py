from rest_framework import serializers
from menu.models import Evento, InscripcionEvento


class InscripcionEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InscripcionEvento
        fields = ['id', 'evento', 'nombre', 'email', 'telefono', 'num_personas', 'estado', 'fecha_inscripcion']
        read_only_fields = ['estado', 'fecha_inscripcion']


class EventoSerializer(serializers.ModelSerializer):
    inscripciones = InscripcionEventoSerializer(many=True, read_only=True)
    inscritos_total = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = [
            'id', 'titulo', 'descripcion', 'fecha', 'hora',
            'precio', 'plazas_totales', 'plazas_disponibles',
            'imagen', 'activo', 'inscripciones', 'inscritos_total'
        ]

    def get_inscritos_total(self, obj):
        return obj.inscripciones.filter(estado='confirmada').count()