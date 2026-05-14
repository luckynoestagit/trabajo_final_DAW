from django.contrib import admin
from menu.models import Productor


@admin.register(Productor)
class ProductorAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'tipo', 'ubicacion', 'activo']
    list_filter = ['activo', 'tipo']
    search_fields = ['nombre', 'tipo']
    list_editable = ['activo']