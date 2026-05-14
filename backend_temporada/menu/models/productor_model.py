from django.db import models


class Productor(models.Model):
    nombre = models.CharField(max_length=200)
    tipo = models.CharField(max_length=100, verbose_name='Especialidad')
    ubicacion = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='images/productores/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'productores'
        ordering = ['nombre']
        verbose_name = '9. Productor'
        verbose_name_plural = '9. Productores'

    def __str__(self):
        return f"{self.nombre} — {self.tipo}"