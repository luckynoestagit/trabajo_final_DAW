from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from menu.serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    #get /post / put /patch /delete
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"success": True}, status=status.HTTP_201_CREATED)
            except BaseException as e:
                print(e)
                return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)