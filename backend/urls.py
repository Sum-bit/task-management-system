from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from tasks import views as task_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),  # This includes TaskViewSet, etc.
    

    # dj-rest-auth built-ins (optional if you're not using them)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Your custom auth views
    path('api/auth/register/', task_views.RegisterWithEmailView.as_view()),
    path('api/auth/verify-otp/', task_views.VerifyOTPView.as_view()),
    path('api/auth/resend-otp/', task_views.ResendOTPView.as_view()),
    path('api/auth/login/', task_views.EmailLoginView.as_view()),  # 👈 add this

    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', obtain_auth_token),
]
