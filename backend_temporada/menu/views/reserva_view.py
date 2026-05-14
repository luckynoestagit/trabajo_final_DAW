from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from django.core.mail import send_mail
from django.conf import settings
from menu.models import Reserva
from menu.serializers import ReservaSerializer
import datetime


class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve', 'verificar_disponibilidad']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'])
    def verificar_disponibilidad(self, request):
        fecha = request.data.get('fecha')
        hora_str = request.data.get('hora')
        sala = request.data.get('sala')
        num_personas = int(request.data.get('num_personas', 0))

        if not fecha or not hora_str:
            return Response({'disponible': False, 'mensaje': 'Faltan datos'}, status=400)

        fecha_obj = datetime.datetime.strptime(fecha, '%Y-%m-%d').date()

        if fecha_obj.weekday() == 0:
            return Response({
                'disponible': False,
                'mensaje': 'Los lunes el restaurante permanece cerrado por descanso semanal.'
            }, status=200)

        try:
            hora_reserva = datetime.datetime.strptime(hora_str[:5], '%H:%M').time()
        except ValueError:
            return Response({'disponible': False, 'mensaje': 'Formato de hora inválido'}, status=400)

        if datetime.time(13, 0) <= hora_reserva <= datetime.time(15, 30):
            inicio_franja = datetime.time(13, 0)
            fin_franja = datetime.time(15, 30)
            nombre_franja = "el turno de comida"
        elif datetime.time(20, 0) <= hora_reserva <= datetime.time(22, 30):
            inicio_franja = datetime.time(20, 0)
            fin_franja = datetime.time(22, 30)
            nombre_franja = "el turno de cena"
        else:
            return Response({'disponible': False, 'mensaje': 'Horario fuera de servicio'})

        total_ocupado = Reserva.objects.filter(
            fecha=fecha,
            sala=sala,
            hora__range=(inicio_franja, fin_franja)
        ).exclude(estado='cancelada').aggregate(total=Sum('num_personas'))['total'] or 0

        limite = 50 if sala == 'principal' else 30

        if total_ocupado + num_personas > limite:
            plazas_libres = limite - total_ocupado
            if sala == 'principal':
                msg = f'Límite superado en sala para {nombre_franja}. Quedan {plazas_libres} plazas. Prueba otra cantidad de comensales o en terraza.'
            else:
                msg = f'Terraza llena para {nombre_franja}. Quedan {plazas_libres} plazas. Prueba en sala principal.'
            return Response({'disponible': False, 'mensaje': msg})

        return Response({'disponible': True})

    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        if email:
            return Reserva.objects.filter(email_cliente=email)
        if self.request.user and self.request.user.is_staff:
            return Reserva.objects.all()
        return Reserva.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reserva = serializer.save()
        self._enviar_email_confirmacion(reserva)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )

    def _enviar_email_confirmacion(self, reserva: Reserva):
        asunto = 'Confirmación de reserva — Temporada'
        mensaje = (
            f'Hola {reserva.nombre_cliente},\n\n'
            f'Hemos recibido tu reserva:\n'
            f'- Fecha: {reserva.fecha}\n'
            f'- Hora: {reserva.hora}\n'
            f'- Personas: {reserva.num_personas}\n'
            f'- Sala: {reserva.get_sala_display()}\n\n'
            'Gracias por reservar en Temporada.'
        )
        send_mail(
            asunto, mensaje, settings.DEFAULT_FROM_EMAIL,
            [reserva.email_cliente], fail_silently=True,
        )