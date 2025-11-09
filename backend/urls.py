from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from tasks import views as task_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🟢 Custom auth views FIRST — these override dj-rest-auth
    path('api/auth/register/', task_views.RegisterWithEmailView.as_view()),
    path('api/auth/verify-otp/', task_views.VerifyOTPView.as_view()),
    path('api/auth/resend-otp/', task_views.ResendOTPView.as_view()),
    path('api/auth/login/', task_views.EmailLoginView.as_view()),  # ✅ your login handler

    # 🟡 Task endpoints
    path('api/', include('tasks.urls')),

    # 🔵 dj-rest-auth built-ins (keep BELOW your custom endpoints)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # 🔵 DRF browsable API + token
    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', obtain_auth_token),
]
