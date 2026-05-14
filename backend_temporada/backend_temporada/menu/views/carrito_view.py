from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from menu.models import Carrito, LineaCarrito, Producto
from menu.serializers import CarritoSerializer, LineaCarritoSerializer


class CarritoViewSet(viewsets.ModelViewSet):
    serializer_class = CarritoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Carrito.objects.filter(cliente=self.request.user.cliente)

    @action(detail=False, methods=['post'])
    def agregar_producto(self, request):
        carrito, created = Carrito.objects.get_or_create(cliente=request.user.cliente)
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad', 1)

        try:
            producto = Producto.objects.get(id=producto_id)
            linea, created = LineaCarrito.objects.get_or_create(
                carrito=carrito,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                linea.cantidad += cantidad
                linea.save()

            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no ha sido encontrado'}, status=status.HTTP_404_NOT_FOUND)