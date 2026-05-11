from django.contrib import admin
from menu.models import Reserva

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_cliente', 'fecha', 'hora', 'num_personas', 'sala', 'estado']
    list_filter = ['estado', 'sala', 'fecha']
    search_fields = ['nombre_cliente', 'email_cliente']
    list_editable = ['estado']