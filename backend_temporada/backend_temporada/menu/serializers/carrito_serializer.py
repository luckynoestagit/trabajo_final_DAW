from rest_framework import serializers
from menu.models import Carrito, LineaCarrito, Producto


class LineaCarritoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.DecimalField(source='producto.precio', max_digits=6, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = LineaCarrito
        fields = ['id', 'producto', 'producto_nombre', 'producto_precio', 'cantidad', 'subtotal']


class CarritoSerializer(serializers.ModelSerializer):
    lineas = LineaCarritoSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'cliente', 'fecha_creacion', 'lineas', 'total']