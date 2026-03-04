import secrets

from django.db import models


# productos_menu_temporada_restaurant
class Producto(models.Model):

    #Modelo para los platos/productos del menú del restaurante TEMPORADA


    CATEGORIAS = [
        ('entrante', 'Entrante'),
        ('principal', 'Plato Principal'),
        ('postre', 'Postre'),
        ('bebida', 'Bebida'),
    ]

    TEMPORADAS = [
        ('primavera', 'Primavera'),
        ('verano', 'Verano'),
        ('otono', 'Otoño'),
        ('invierno', 'Invierno'),
        ('anual', 'Todo el año'),
    ]

    nombre = models.CharField(max_length=200, unique=False, null=False, blank=False, verbose_name="Nombre del plato")
    slug = models.SlugField(max_length=250, unique=True, null=False, blank=False, verbose_name="Slug único")
    descripcion = models.TextField(null=False, blank=False, verbose_name="Descripción")
    precio = models.DecimalField(max_digits=6, decimal_places=2, null=False, blank=False, verbose_name="Precio")
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, null=False, blank=False, verbose_name="Categoría")
    temporada = models.CharField(max_length=20, choices=TEMPORADAS, default='anual', null=False, blank=False,
                                 verbose_name="Temporada")
    imagen = models.ImageField(upload_to='images/productos/', blank=True, null=True, verbose_name="Imagen")
    is_active = models.BooleanField(default=True, verbose_name="¿Está activo?") # ya no tenemos el producto- eliminacion de producto permanente
    disponible = models.BooleanField(default=True, verbose_name="¿Disponible para pedir?")  # en el dia de actual esta disponible para pedir? disponibilidad temporal
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    class Meta:
        db_table = 'productos'
        ordering = ['categoria', 'nombre']
        verbose_name = '1. Producto'
        verbose_name_plural = '1. Productos'

    # Este método es llamado al guardar y al actualizar
    def save(self, *args, **kwargs):
        if not self.slug:
            # Entonces creamos un slug único
            prov = secrets.token_hex(16)
            # SELECT id FROM productos WHERE slug=prov
            while Producto.objects.filter(slug=prov).exists():
                prov = secrets.token_hex(16)
            self.slug = prov

        super().save(*args, **kwargs)

    # Solo se llama al borrar un valor
    def delete(self, *args, **kwargs):
        # Desactivar en lugar de borrar (soft delete)
        self.is_active = False
        self.save()

    def __str__(self):
        return f"[PRODUCTO: {self.nombre} - {self.get_categoria_display()}]"