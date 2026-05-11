from django.db import models
from .cliente_model import Cliente

class Reserva(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    ]
    SALAS = [
        ('principal', 'Sala principal'),
        ('terraza', 'Terraza interior'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='reservas', null=True, blank=True)
    nombre_cliente = models.CharField(max_length=100)
    email_cliente = models.EmailField(max_length=100)
    telefono_cliente = models.CharField(max_length=20)
    fecha = models.DateField()
    hora = models.TimeField()
    num_personas = models.PositiveIntegerField(default=2)
    sala = models.CharField(max_length=20, choices=SALAS, default='principal')
    observaciones = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reservas'
        ordering = ['fecha', 'hora']
        verbose_name = '4. Reserva'
        verbose_name_plural = '4. Reservas'

    def __str__(self):
        return f"Reserva {self.nombre_cliente} — {self.fecha} {self.hora}"