from django.urls import path
from .views import VerifyOTPView, EmailLoginView, TaskListCreateView
from .views import VerifyOTPView, TaskListCreateView, TaskDetailView, ResendOTPView, RegisterWithEmailView, UserDetailView


urlpatterns = [
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', EmailLoginView.as_view(), name='login'),
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
]
