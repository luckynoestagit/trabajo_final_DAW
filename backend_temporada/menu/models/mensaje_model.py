from django.db import models
from .cliente_model import Cliente

class Mensaje(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('respondido', 'Respondido'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True, related_name='mensajes')
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    asunto = models.CharField(max_length=200)
    mensaje = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    respuesta = models.TextField(blank=True, null=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    fecha_respuesta = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'mensajes'
        ordering = ['-fecha_envio']
        verbose_name = '6. Mensaje'
        verbose_name_plural = '6. Mensajes'

    def __str__(self):
        return f"[{self.estado.upper()}] {self.asunto} — {self.nombre}"