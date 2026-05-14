from django.db import models
from .cliente_model import Cliente


class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha = models.DateField()
    hora = models.TimeField()
    precio = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    plazas_totales = models.PositiveIntegerField(default=20)
    plazas_disponibles = models.PositiveIntegerField(default=20)
    imagen = models.ImageField(upload_to='images/eventos/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'eventos'
        ordering = ['fecha', 'hora']
        verbose_name = '7. Evento'
        verbose_name_plural = '7. Eventos'

    def __str__(self):
        return f"{self.titulo} — {self.fecha} ({self.plazas_disponibles} plazas)"


class InscripcionEvento(models.Model):
    ESTADOS = [
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    ]

    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='inscripciones')
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True, related_name='inscripciones')
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    telefono = models.CharField(max_length=20)
    num_personas = models.PositiveIntegerField(default=1)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='confirmada')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inscripciones_eventos'
        ordering = ['-fecha_inscripcion']
        verbose_name = '8. Inscripción Evento'
        verbose_name_plural = '8. Inscripciones Eventos'

    def __str__(self):
        return f"{self.nombre} → {self.evento.titulo} ({self.num_personas} pers.)"