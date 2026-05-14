from django.contrib import admin
from menu.models import Evento, InscripcionEvento


class InscripcionInline(admin.TabularInline):
    model = InscripcionEvento
    extra = 0
    readonly_fields = ['fecha_inscripcion']


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'fecha', 'hora', 'precio', 'plazas_totales', 'plazas_disponibles', 'activo']
    list_filter = ['activo', 'fecha']
    search_fields = ['titulo']
    list_editable = ['activo', 'plazas_disponibles']
    inlines = [InscripcionInline]


@admin.register(InscripcionEvento)
class InscripcionEventoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'email', 'evento', 'num_personas', 'estado', 'fecha_inscripcion']
    list_filter = ['estado', 'evento']
    search_fields = ['nombre', 'email']
    list_editable = ['estado']