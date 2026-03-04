from django.core.validators import MinValueValidator
from django.db import models
import secrets

#clientes del restaurante TEMPORADA
class Cliente(models.Model):

    nombre = models.CharField(max_length=100, blank=False, null=False, verbose_name='Nombre Cliente')
    apellidos = models.CharField(max_length=100, blank=False, null=False, verbose_name='Apellido Cliente')
    email = models.EmailField(max_length=100, blank=False, null=False, verbose_name='Email Cliente')
    edad = models.IntegerField(blank=False, null=False, verbose_name='Edad', validators=[MinValueValidator(18)], help_text='Debe ser mayor que 18')
    slug = models.SlugField(max_length=100,unique=True, verbose_name='Slug Cliente')
    telefono = models.CharField(max_length=100, blank=False, null=False, verbose_name='Telefono')
    direccion = models.CharField(max_length=100, blank=False, null=False, verbose_name='Direccion Cliente')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    class Meta:
        db_table = 'clientes'
        verbose_name = '2. Cliente'
        verbose_name_plural = '2. Clientes'
        ordering = ['apellidos','nombre']

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def save(self, *args, **kwargs):
        if not self.slug:
            prov = secrets.token_hex(16)
            while Cliente.objects.filter(slug=prov).exists():
                prov = secrets.token_hex(16)
            self.slug = prov

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cliente: {self.nombre}, {self.apellidos}, {self.edad}, {self.slug}"