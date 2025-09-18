from rest_framework import serializers
from .models import Task, EmailOTP
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EmailOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            otp_obj = EmailOTP.objects.get(email=data['email'])
            if otp_obj.otp != data['otp']:
                raise serializers.ValidationError("Invalid OTP.")
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("OTP not found for this email.")
        return data

class CustomLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        data['user'] = user
        return data
