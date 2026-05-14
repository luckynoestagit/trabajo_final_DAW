from django.contrib import admin
from menu.models import Mensaje

@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'asunto', 'estado', 'fecha_envio']
    list_filter = ['estado']
    search_fields = ['nombre', 'email', 'asunto']
    list_editable = ['estado']