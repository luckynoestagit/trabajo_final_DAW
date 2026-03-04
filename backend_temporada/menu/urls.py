from django.urls import path, include
from rest_framework.routers import DefaultRouter
from menu.views import ProductoViewSet, CarritoViewSet, RegisterView, LoginView


router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'carrito', CarritoViewSet, basename='carrito')

urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]