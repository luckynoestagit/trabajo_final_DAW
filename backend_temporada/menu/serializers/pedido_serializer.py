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

    def validate_lineas_data(self, lineas_data):
        if not lineas_data:
            raise serializers.ValidationError("El pedido debe tener al menos un producto.")
        errores = []
        for linea in lineas_data:
            producto_id = linea.get('producto_id')
            cantidad = linea.get('cantidad', 1)
            if not producto_id:
                errores.append("Falta producto_id en una de las lineas.")
                continue
            try:
                producto = Producto.objects.get(id=producto_id)
            except Producto.DoesNotExist:
                errores.append(f"El producto con id {producto_id} no existe.")
                continue
            if not producto.is_active:
                errores.append(f"'{producto.nombre}' ya no esta disponible en la carta.")
            elif not producto.disponible:
                errores.append(f"'{producto.nombre}' no esta disponible hoy.")
            if cantidad < 1:
                errores.append(f"La cantidad de '{producto.nombre}' debe ser al menos 1.")
        if errores:
            raise serializers.ValidationError(errores)
        return lineas_data

    def validate(self, attrs):
        tipo_entrega = attrs.get('tipo_entrega')
        direccion = attrs.get('direccion_entrega', '')
        if tipo_entrega == 'domicilio' and not direccion:
            raise serializers.ValidationError(
                {"direccion_entrega": "La direccion de entrega es obligatoria para envio a domicilio."}
            )
        return attrs

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas_data', [])
        pedido = Pedido.objects.create(**validated_data)
        total = 0
        for linea in lineas_data:
            producto = Producto.objects.get(id=linea['producto_id'])
            cantidad = linea['cantidad']
            LineaPedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=producto.precio
            )
            total += producto.precio * cantidad
        pedido.total = total
        pedido.save(update_fields=['total'])
        return pedido