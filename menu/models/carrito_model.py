from django.db import models
from .cliente_model import Cliente
from .productos_model import Producto


class Carrito(models.Model):
    cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE, related_name='carrito')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'carritos'
        verbose_name = '3. Carrito'
        verbose_name_plural = '3. Carritos'

    def __str__(self):
        return f"Carrito de {self.cliente.nombre}"

    @property
    def total(self):
        return sum(linea.subtotal for linea in self.lineas.all())


class LineaCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name='lineas')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'lineas_carrito'
        verbose_name = '3. Lineas de Carrito'
        verbose_name_plural = '3. Lineas Carrito'
        unique_together = ['carrito', 'producto'] # UNIQUE evita duplicados / SQL base de datos

    def __str__(self):
        return f"{self.cantidad}, {self.producto.nombre}"

#retorna la cantidad
    @property
    def subtotal(self):
        return self.cantidad * self.producto.precio