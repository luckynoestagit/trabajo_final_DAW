from django.urls import path, include
from rest_framework.routers import DefaultRouter
from menu.views import (
    ProductoViewSet, CarritoViewSet,
    RegisterView, LoginView,
    ReservaViewSet, PedidoViewSet, MensajeViewSet,
    EventoViewSet, ProductorViewSet, SuscriptorView
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'carrito', CarritoViewSet, basename='carrito')
router.register(r'reservas', ReservaViewSet, basename='reservas')
router.register(r'pedidos', PedidoViewSet, basename='pedidos')
router.register(r'mensajes', MensajeViewSet, basename='mensajes')
router.register(r'eventos', EventoViewSet, basename='eventos')
router.register(r'productores', ProductorViewSet, basename='productores')

urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('suscribir/', SuscriptorView.as_view(), name='suscribir'),
]