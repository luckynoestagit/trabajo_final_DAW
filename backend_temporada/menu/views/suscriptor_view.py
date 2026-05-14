from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from menu.models import Suscriptor
from menu.serializers import SuscriptorSerializer

class SuscriptorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        if Suscriptor.objects.filter(email=email).exists():
            return Response({'success': True, 'message': 'Ya estás suscrito'}, status=status.HTTP_200_OK)
        serializer = SuscriptorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Suscripción confirmada'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)