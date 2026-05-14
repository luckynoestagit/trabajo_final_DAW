from django.db import models
from .cliente_model import Cliente
from .productos_model import Producto

class Pedido(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente de pago'),
        ('pagado', 'Pagado'),
        ('preparando', 'En preparación'),
        ('listo', 'Listo para envío/recogida'),
        ('enviado', 'En reparto'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    TIPOS_ENTREGA = [
        ('domicilio', 'Envío a domicilio'),
        ('recogida', 'Recogida en tienda'),
    ]
    METODOS_PAGO = [
        ('paypal', 'PayPal'),
        ('tarjeta', 'Tarjeta de crédito'),
    ]
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, related_name='pedidos', null=True, blank=True)
    nombre_cliente = models.CharField(max_length=100)
    email_cliente = models.EmailField(max_length=100)
    telefono_cliente = models.CharField(max_length=20)
    tipo_entrega = models.CharField(max_length=20, choices=TIPOS_ENTREGA, default='domicilio')
    direccion_entrega = models.CharField(max_length=200, blank=True, null=True)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, default='paypal')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    observaciones = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pedidos'
        ordering = ['-fecha_creacion']
        verbose_name = '5. Pedido'
        verbose_name_plural = '5. Pedidos'

    def __str__(self):
        return f"Pedido #{self.id} — {self.nombre_cliente} ({self.estado})"

class LineaPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='lineas')
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        db_table = 'lineas_pedido'
        verbose_name = '5. Línea de Pedido'
        verbose_name_plural = '5. Líneas de Pedido'

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre}"