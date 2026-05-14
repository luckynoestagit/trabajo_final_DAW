from django.contrib import admin
from menu.models import Carrito, LineaCarrito

class LineaCarritoInline(admin.TabularInline):
    model = LineaCarrito
    extra = 0
    readonly_fields = ('subtotal',)

class CarritoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'fecha_creacion', 'total')
    readonly_fields = ('fecha_creacion', 'total')
    inlines = [LineaCarritoInline]

admin.site.register(Carrito, CarritoAdmin)