from django.db import models

class Suscriptor(models.Model):
    email = models.EmailField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'suscriptores'
        ordering = ['-fecha_registro']
        verbose_name = '10. Suscriptor'
        verbose_name_plural = '10. Suscriptores'

    def __str__(self):
        return self.email