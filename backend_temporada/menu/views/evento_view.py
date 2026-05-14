from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from menu.models import Evento, InscripcionEvento
from menu.serializers import EventoSerializer, InscripcionEventoSerializer


class EventoViewSet(viewsets.ModelViewSet):
    serializer_class = EventoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Evento.objects.filter(activo=True)

    @action(detail=True, methods=['post'])
    def inscribirse(self, request, pk=None):
        evento = self.get_object()
        num_personas = int(request.data.get('num_personas', 1))

        # Update atómico — evita race condition cuando dos usuarios
        # se inscriben a la vez y los dos pasan el if con plazas=1
        filas_actualizadas = Evento.objects.filter(
            pk=evento.pk,
            plazas_disponibles__gte=num_personas
        ).update(
            plazas_disponibles=F('plazas_disponibles') - num_personas
        )

        if filas_actualizadas == 0:
            evento.refresh_from_db()
            return Response(
                {'error': f'Solo quedan {evento.plazas_disponibles} plazas disponibles'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = InscripcionEventoSerializer(data={
            'evento': evento.id,
            'nombre': request.data.get('nombre'),
            'email': request.data.get('email'),
            'telefono': request.data.get('telefono'),
            'num_personas': num_personas,
        })

        if serializer.is_valid():
            serializer.save()
            evento.refresh_from_db()
            return Response({
                'success': True,
                'data': serializer.data,
                'plazas_restantes': evento.plazas_disponibles
            }, status=status.HTTP_201_CREATED)

        # Si el serializer falla, devolvemos las plazas que descontamos
        Evento.objects.filter(pk=evento.pk).update(
            plazas_disponibles=F('plazas_disponibles') + num_personas
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)