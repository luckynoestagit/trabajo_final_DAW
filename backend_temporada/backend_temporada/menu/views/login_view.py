from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView # clase base de django REST Framework para crear endpoints

from menu.serializers import LoginSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]#cualquiera puede acceder a este endpoint sin estar autenticado

    #get post put y patch
    def post(self, request):
        serializer = LoginSerializer(data=request.data) #le pasa los datos que llegaron desde Angular al serializer
        if serializer.is_valid(): #validaciones
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)