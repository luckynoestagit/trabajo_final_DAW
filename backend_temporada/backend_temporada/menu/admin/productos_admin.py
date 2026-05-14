from django.contrib import admin
from menu.models import Producto



class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'temporada', 'precio', 'disponible', 'is_active', 'fecha_creacion')
    list_filter = ('categoria', 'temporada', 'disponible', 'is_active')
    search_fields = ('nombre', 'descripcion')
    list_editable = ('disponible', 'precio')
    ordering = ('categoria', 'nombre')
    list_per_page = 25

    # Campos que no se pueden editar
    readonly_fields = ('slug', 'fecha_creacion', 'fecha_actualizacion')

    #organizar campos por sessiones
    fieldsets = (
        ('Información básica', {
            'fields': ('nombre', 'slug', 'descripcion', 'precio')
        }),
        ('Clasificación', {
            'fields': ('categoria', 'temporada')
        }),
        ('Imagen', {
            'fields': ('imagen',),
            'classes': ('collapse',)  # esta es una sección colapsable solo se expande si se hace click
        }),
        ('Estado', {
            'fields': ('is_active', 'disponible')
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

admin.site.register(Producto, ProductoAdmin)