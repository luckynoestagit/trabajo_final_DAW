from django.contrib import admin
from menu.models import Suscriptor

@admin.register(Suscriptor)
class SuscriptorAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'activo', 'fecha_registro']
    list_filter = ['activo']
    search_fields = ['email']