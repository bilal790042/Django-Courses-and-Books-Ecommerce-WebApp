from api import views as api_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("user/token/", api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", api_views.RegisterView.as_view()),
    path("user/password-reset/<email>/", api_views.PasswordResetEmailVerifyAPIView.as_view()),
    path("user/password-change/", api_views.PasswordChangeAPIView.as_view()),

    path("course/category/", api_views.CategoryListAPIView.as_view()),
    path("course/course-list/", api_views.CourseListAPIView.as_view()),
    path("course/course-details/<slug>/", api_views.CourseDetailAPIView.as_view()),
    path("course/cart/", api_views.CartAPIView.as_view()),
    path("course/cart-list/<cart_id>/", api_views.CartListAPIView.as_view()),
    path("course/cart-item-delete/<cart_id>/<item_id>/", api_views.CartItemDeleteAPIView.as_view()),
    path("cart/stats/<cart_id>/", api_views.CartStatsAPIView.as_view()),
    path("order/create-order/", api_views.CreateOrderAPIView.as_view()),
    path("order/checkout/<order_oid>/", api_views.CheckoutAPIView.as_view()),
    path("order/coupon/", api_views.CouponApplyAPIView.as_view()),
    # path("payment/stripe-checkoutt/<order_oid>/", api_views.StripeCheckoutAPIView.as_view()),
    path("payment/payment-success/", api_views.PaymentSuccessAPIView.as_view()),
    
    # students api
    path("student/summery/<user_id>/", api_views.StudentSummeryAPIView.as_view()),
    path("student/course-list/<user_id>/", api_views.StudentCourseListAPIView.as_view()),
    path("student/course-detail/<user_id>/<enrollment_id>/", api_views.StudentCourseDetailAPIView.as_view()),
]
