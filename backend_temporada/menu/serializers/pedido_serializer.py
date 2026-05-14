from rest_framework import serializers
from menu.models import Pedido, LineaPedido, Producto

class LineaPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = LineaPedido
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']

class PedidoSerializer(serializers.ModelSerializer):
    lineas = LineaPedidoSerializer(many=True, read_only=True)
    lineas_data = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Pedido
        fields = [
            'id', 'nombre_cliente', 'email_cliente', 'telefono_cliente',
            'tipo_entrega', 'direccion_entrega', 'metodo_pago',
            'estado', 'total', 'observaciones',
            'fecha_creacion', 'lineas', 'lineas_data'
        ]
        read_only_fields = ['fecha_creacion']

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas_data', [])
        pedido = Pedido.objects.create(**validated_data)
        for linea in lineas_data:
            producto = Producto.objects.get(id=linea['producto_id'])
            LineaPedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=linea['cantidad'],
                precio_unitario=producto.precio
            )
        return pedido