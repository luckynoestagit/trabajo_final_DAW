from sys import activate_stack_trampoline

from django.conf import settings
from django.views.static import directory_index
from rest_framework import serializers
from menu.models import Cliente


class RegisterSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(required=True, allow_blank=False, max_length=100)
    apellidos = serializers.CharField(required=True, allow_blank=False, max_length=100)
    email = serializers.EmailField(required=True, allow_blank=False, max_length=100)
    password1 = serializers.CharField(required=True, allow_blank=False, min_length=6, write_only=True)
    password2 = serializers.CharField(required=True, allow_blank=False, min_length=6, write_only=True)
    telefono = serializers.CharField(required=True, max_length=20)
    direccion = serializers.CharField(required=True, allow_blank=False, max_length=100)
    edad = serializers.IntegerField(required=True, min_value=18, max_value=100)

    class Meta:
        model = Cliente
        fields = (
            'nombre',
            'apellidos',
            'email',
            'password1',
            'password2',
            'telefono',
            'direccion',
            'edad'
        )

    def validate_email(self, email):
        if "@" not in email:
            raise serializers.ValidationError('Email ingresado incorrecto')
        if any(ext in email for ext in settings.EXTENSIONES_BLACKLIST):
            raise serializers.ValidationError('Extenciones no permitdas')
        if Cliente.objects.filter(email=email).exists():
            raise serializers.ValidationError('El cliente ya existe')
        return email

    # validar

    def validate_password1(self, password):
        if not any(n.isdigit() for n in password):
            raise serializers.ValidationError("la contraseña debe tener al menos un digito ")
        return password

    def validate_telefono(self, telefono):
        try:
            int(telefono)
            return telefono
        except:
            raise serializers.ValidationError("El telefono ingresado no es valido")

    def validate_edad(self, edad):
        if edad < 18:
            raise serializers.ValidationError("El edad ingresado no es valido")
        return edad

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Las contraseñas no son iguales")
        return attrs

    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password

        password = validated_data.pop('password1')
        validated_data.pop('password2')

        cliente = Cliente.objects.create(
            nombre=validated_data['nombre'],
            apellidos=validated_data['apellidos'],
            email=validated_data['email'],
            telefono=validated_data['telefono'],
            direccion=validated_data['direccion'],
            edad=validated_data['edad'],
            password=make_password(password),

        )

        return cliente