from django.contrib import admin
from menu.models import Pedido, LineaPedido

class LineaPedidoInline(admin.TabularInline):
    model = LineaPedido
    extra = 0
    readonly_fields = ['precio_unitario']

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_cliente', 'tipo_entrega', 'metodo_pago', 'estado', 'total', 'fecha_creacion']
    list_filter = ['estado', 'tipo_entrega', 'metodo_pago']
    search_fields = ['nombre_cliente', 'email_cliente']
    list_editable = ['estado']
    inlines = [LineaPedidoInline]