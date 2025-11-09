from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import EmailOTP, Task
from .serializers import TaskSerializer, UserSerializer
from django.utils import timezone
from .utils import generate_otp, send_otp_email
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from datetime import timedelta


class RegisterWithEmailView(APIView):
    def post(self, request):
        username = request.data.get("username")
        full_name = request.data.get("full_name")
        email = request.data.get("email")
        password1 = request.data.get("password1")
        password2 = request.data.get("password2")

        # Validate all fields
        if not all([username, full_name, email, password1, password2]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if password1 != password2:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Create inactive user
        user = User.objects.create_user(username=username, email=email, password=password1, is_active=False)
        user.first_name = full_name
        user.save()

        # Generate OTP and save
        otp = generate_otp()
        EmailOTP.objects.create(email=email, otp=otp)
        send_otp_email(email, otp)

        return Response(
            {"message": "OTP sent to your email. Please verify to activate your account."},
            status=status.HTTP_200_OK
        )


class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        email_otp = EmailOTP.objects.filter(email=email, is_verified=False).order_by("-created_at").first()
        if not email_otp:
            return Response({"error": "OTP not found or already verified"}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > email_otp.created_at + timedelta(minutes=5):
            return Response({"error": "OTP expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        if otp != email_otp.otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark verified
        email_otp.is_verified = True
        email_otp.verified_at = timezone.now()
        email_otp.save()

        # Activate user
        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Generate token
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "message": "Email verified successfully!"}, status=status.HTTP_200_OK)

class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        otp = generate_otp()
        EmailOTP.objects.create(email=email, otp=otp)
        send_otp_email(email, otp)
        return Response({'message': 'OTP resent to your email'}, status=status.HTTP_200_OK)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class UserDetailView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class EmailLoginView(APIView):
    def post(self, request):
        import json

        try:
            print("RAW BODY:", request.body)
            print("CONTENT TYPE:", request.content_type)
            data = request.data or json.loads(request.body.decode('utf-8'))
        except Exception as e:
            print("JSON PARSE ERROR:", e)
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

        print("DEBUG LOGIN DATA:", data)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

        from rest_framework.authtoken.models import Token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "username": user.username,
            "email": user.email
        }, status=status.HTTP_200_OK)
