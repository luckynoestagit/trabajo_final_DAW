from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from menu.models import Cliente


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False, max_length=100)
    password = serializers.CharField(required=True, allow_blank=False, min_length=5, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Validación básica del email
        if "@" not in email:
            raise serializers.ValidationError("Email o contraseña incorrecta")

        if any(ext in email for ext in settings.EXTENSIONES_BLACKLIST):
            raise serializers.ValidationError("Email o contraseña incorrecta")

        # Buscar cliente activo
        cliente = Cliente.objects.filter(email=email, is_active=True).first()
        if not cliente:
            raise serializers.ValidationError("El usuario no existe")

        # Comparar contraseña hasheada
        if not check_password(password, cliente.password):
            raise serializers.ValidationError("La contraseña no coincide")

        # Generar tokens JWT
        refresh = RefreshToken.for_user(cliente)
        refresh['nombre'] = cliente.nombre

        return {
            'success': True,
            'data': {
                'nombre': cliente.nombre,
                'email': cliente.email,
                'telefono': cliente.telefono,
                'refreshToken': str(refresh),
                'token': str(refresh.access_token)
            }
        }