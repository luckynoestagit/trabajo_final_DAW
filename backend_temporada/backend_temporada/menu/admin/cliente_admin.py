from django.contrib import admin
from menu.models import Cliente

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellidos', 'edad', 'email', 'telefono', 'direccion', 'fecha_registro', 'is_active')
    list_filter = ('is_active','fecha_registro')
    search_fields = ('nombre', 'apellido', 'telefono','email')
    list_editable = ('is_active',)
    ordering = ('apellidos', 'nombre')
    list_per_page = 25

    #campos de solo lectura
    readonly_fields = ('slug','fecha_registro')


    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'apellidos', 'email', 'edad')
        }),
        ('Contacto', {
            'fields': ('telefono', 'direccion')
        }),
        ('Sistema', {
            'fields': ('slug', 'fecha_registro', 'is_active'),
            'classes': ('collapse',)
        }),
    )


admin.site.register(Cliente , ClienteAdmin)