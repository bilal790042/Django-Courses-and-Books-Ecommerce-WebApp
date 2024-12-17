import random
from django.db import connection
from django.shortcuts import render, redirect
from api import serializer as api_serializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from userauths.models import User, Profile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from api import models as api_models
# import decimal
from decimal import Decimal
import stripe
import requests
# PAYPAL_CLIENT_ID = settings.PAYPAL_CLIENT_ID
# PAYPAL_SECRET_ID = settings.PAYPAL_SECRET_ID


# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer
    

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer

def generate_random_otp (length=7):
    otp = ''.join([str(random.randint(0,9)) for _ in range(length)])
    return otp

class PasswordResetEmailVerifyAPIView(generics.RetrieveAPIView):
   permission_classes = [AllowAny]
   serializer_class = api_serializer.UserSerializer

   def get_object(self):
       email = self.kwargs['email']

       user = User.objects.filter(email = email).first()
       
       if user: 
           uuidb64 = user.pk
           refresh = RefreshToken.for_user(user)
           refresh_token = str(refresh.access_token)
           
           user.refresh_token = refresh_token
           user.otp = generate_random_otp()
           user.save() 

           link = f"http://localhost:5173/create-new-password/?otp={user.otp}&uuidb64= {uuidb64}&refresh_token={refresh_token}"
           merge_data = {
               "link": link,
               "username": user.username
           }
           context = {
            "user": user,
            "reset_url": "http://127.0.0.1:8000/api/v1/user/password-reset/<email>/",  # Replace with your actual reset URL
        }

           subject = "Password Rest Email"
           text_body = render_to_string("email/password_reset.txt", context)
           html_body = render_to_string("email/password_reset.html", context)

           msg = EmailMultiAlternatives(
               subject= subject,
               from_email = settings.FROM_EMAIL,
               to = [user.email],
               body=text_body
           )

           msg.attach_alternative(html_body, "text/html")
           msg.send()

           print("link ======", link)
           return user



class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes =[AllowAny]
    serializer_class = api_serializer.UserSerializer

    def create(self, request, *args, **kwargs):
        otp = request.data['otp']
        uuidb64 = request.data['uuidb64']
        password = request.data['password']

        user = User.objects.get(id = uuidb64, otp= otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()

            return Response({"message": "Password Changed Successfully"}, status= status.HTTP_201_CREATED)
        
        else:
            return Response({"message": "User Does Not Exists"}, status= status.HTTP_404_NOT_FOUND)
            

class CategoryListAPIView(generics.ListAPIView):
    queryset = api_models.Category.objects.filter(active=True)
    serializer_class = api_serializer.CategorySerializer
    permission_classes= [AllowAny]


class CourseListAPIView(generics.ListAPIView):
    queryset = api_models.Course.objects.filter(platform_status="Published", teacher_course_status= "Published")
    serializer_class = api_serializer.CourseSerializer
    permission_classes= [AllowAny]


class CourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes= [AllowAny]
    queryset = api_models.Course.objects.filter(platform_status= "Published", teacher_course_status= "Published")


    def get_object(self):
        slug = self.kwargs['slug']
        course = api_models.Course.objects.get(slug= slug, platform_status= "Published", teacher_course_status= "Published")
        return course
    

class CartAPIView(generics.CreateAPIView):
    queryset = api_models.Cart.objects.all()
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        course_id = request.data.get('course_id', None)
        user_id = request.data.get('user_id', None) 
        price = request.data['price']
        country_name = request.data['country_name']
        cart_id = request.data['cart_id']

        course = api_models.Course.objects.filter(id= course_id).first()

        if user_id:

            user = User.objects.filter(id= user_id).first()

        else:
            user = None

        try:
            country_object = api_models.Country.objects.filter(name= country_name).first()
            country = country_object.name
        except: 
            country_object = api_models.Country.objects.filter(name=country_name).first()
            country = country_object.name if country_object else "United States"


        if country_object:
            tax_rate = country_object.tax_rate / 100

        else:
            tax_rate = 0

        cart = api_models.Cart.objects.filter(cart_id= cart_id, course= course).first()

        if cart:
            cart.course = course
            cart.user = user
            cart.price = price
            cart.tax_fee = Decimal(price or 0) * Decimal(tax_rate or 0)

            cart.country = country
            cart.cart_id = cart_id
            cart.total = Decimal(cart.price) + Decimal(cart.tax_fee)
            cart.save()

            return Response({"message": "Cart Updated Successfully"}, status= status.HTTP_200_OK)

        else:
            cart = api_models.Cart()

            cart.course = course
            cart.user = user
            cart.price = price
            cart.tax_fee = Decimal(price) * Decimal(tax_rate)
            cart.country = country
            cart.cart_id = cart_id
            cart.total = Decimal(cart.tax_fee) + Decimal(cart.price)
            cart.save()

            return Response({"message": "Cart Created Successfully"}, status= status.HTTP_200_OK)


class CartListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]


    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        queryset = api_models.Cart.objects.filter(cart_id= cart_id)
        return queryset
    
class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']

        return api_models.Cart.objects.filter(cart_id= cart_id, id= item_id).first()
    

class CartStatsAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CartSerializer
    permission_classes = [AllowAny]
    lookup_fields = 'cart_id'

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        queryset = api_models.Cart.objects.filter(cart_id= cart_id)
        return queryset
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_price = 0.00
        total_tax = 0.00
        total_total = 0.00

        for cart_item in queryset:
            total_price += float(self.calculate_price(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_total += round(float(self.calculate_total(cart_item)), 2)
        
        data = {
            "price": total_price,
            "tax": total_tax,
            "total": total_total
        }
        return Response(data)
    def calculate_price(self, cart_item):
        return cart_item.price
    
    def calculate_tax(self, cart_item):
        return cart_item.tax_fee
    
    def calculate_total(self, cart_item):
        return cart_item.total
    
class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = api_models.CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        full_name = request.data['full_name']
        email = request.data['email']
        country = request.data['country']
        cart_id = request.data['cart_id']
        user_id = request.data['user_id']


        user = User.objects.filter(id=int(user_id)).first() if user_id and user_id.isdigit() else None


        cart_items = api_models.Cart.objects.filter(cart_id= cart_id)

        total_price = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_initial_total = Decimal(0.00)
        total_total = Decimal(0.00)

        order = api_models.CartOrder.objects.create(
            full_name = full_name,
            email = email,
            country = country,
            student = user
        )

        for c in cart_items:
            api_models.CartOrderItem.objects.create(
                order=order,
                course=c.course,  # Correct field name
                tax_fee=c.tax_fee,
                total=c.total,    # Correct field name
                 initial_total=c.total,
                teacher=c.course.teacher,
                 saved=0.00,  # Provide a value for the `saved` field if required
                applied_coupon=False  # Or set it appropriately
            )

            total_price += Decimal(c.price)
            total_tax += Decimal(c.tax_fee)
            total_initial_total += Decimal(c.total)
            total_total += Decimal(c.total)

            order.teachers.add(c.course.teacher)

        order.sub_total = total_price
        order.tax_fee = total_tax
        order.initial_total = total_initial_total
        order.total = total_total   
        order.save()
        print("Debug Order OID:", order.oid)  # Debugging
        # return Response({"message": "Order created successfully",}, status=status.HTTP_201_CREATED)
        return Response({"message": "Order created successfully", "order_oid": order.oid}, status = status.HTTP_201_CREATED)


class CheckoutAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = api_models.CartOrder.objects.all()
    lookup_field = 'oid'


class CouponApplyAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CouponSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        order_oid = request.data['order_id']
        coupon_code = request.data['coupon_code']

        order = api_models.CartOrder.objects.get(oid = order_oid)
        coupon = api_models.Coupon.objects.get(code = coupon_code)

        if coupon: 
            order_items = api_models.CartOrderItem.objects.filter(order = order, teacher = coupon.teacher)
            for i in order_items:
                if not coupon in i.coupons.all():
                    discount = i.total * coupon.discount /100
                    i.total -= discount
                    i.price -= discount
                    i.saved += discount
                    i.applied_coupon = True
                    i.coupons.add(coupon)

                    order.coupons.add(coupon)
                    order.total -= discount
                    order.sub_total -= discount
                    order.saved += discount

                    i.save()
                    order.save()
                    coupon.used_by.add(order.student)
                    
                    return Response({"message": "Coupon Found and Activated"}, status = status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Coupon Already Applied"}, status = status.HTTP_200_OK)
                    
        
        else:
            return Response({"message": "Coupon Not Found"}, status = status.HTTP_404_NOT_FOUND)
        

# class StripeCheckoutAPIView(generics.CreateAPIView):
#     serializer_class = api_serializer.CartOrderSerializer
#     permission_classes = [AllowAny]

#     def create(self, request, *args, **kwargs):

#         order_oid = self.kwargs['order_oid']
#         order = api_models.CartOrder.objects.gt(oid= order_oid)

#         if not order:
#             return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         try:
#             checkout_session = stripe.checkout.Session.create(
#                 customer_email= order.email,
#                 payment_method_type = ['card'],
#                 line_items = [
#                     {
#                         "price_data": {
#                             'currency': 'usd',
#                             'product_data': {
#                                 'name': order.full_name,
#                             },
#                             'unit_amount': int(order.total * 100)
#                         },
#                         'quantity':1
#                     }
#                 ],
#                 mode = 'payment'
#                 suceess_url = settings.FRONTEND_SITE_URL + 'payment-success/' + order_oid + '?session_id={CHECKOUT_SESSION_ID}'
#                 cancel_url = settings.FRONTEND_SITE_URL + 'payment-failed/'
#             )
#             order.stripe_session_id = checkout_session.id

#             return redirect(checkout_session.url)
#         except stripe.errors.StripeError as e:
#             return Response({"message": f"Something went wrong when trying to make payment. Error: {str(e)}"})


def get_access_token(client_id, secret_key):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {'grant_type': 'client_credientials'}
    auth = (client_id, secret_key)

    response = requests.post(token_url, data=data, auth=auth)

    if response.status_code == 200:
        print("Access Token ===",  response.json()['access_token'])
        return response.json()['access_token']

    else:
        raise Exception("Failed to get access token from paypal {response.status_code}")


class PaymentSuccessAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CartOrderSerializer
    queryset = api_models.CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        order_oid = request.data['order_oid']
        session_id = request.data['session_id']
        paypal_order_id = request.data['paypal_order_id']

        try:
             order = api_models.CartOrder.objects.get(oid=order_oid)
        except api_models.CartOrder.DoesNotExist:
            return Response({"message": "Order does not exist"}, status=404)
        order_items = api_models.CartOrderItem.objects.filter(order = order)


        if paypal_order_id != "null":
            paypal_api_url = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}"
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {get_access_token(PAYPAL_CLIENT_ID, PAYPAL_SECRET_ID)}"
            }
            response = requests.get(paypal_api_url, headers=headers)
            if response.status_code == 200:
                paypal_order_data = response.json()
                paypal_payment_status = paypal_order_data['status']
                if paypal_payment_status == "COMPLETED":
                    if order.payment_status == "Processing":
                        order.payment_status = "Paid"
                        order.save()
                        api_models.Notification.objects.create(user=order.student, order = order, type = "Course Enrollment Completed" )
                        
                        for i in order_items:
                            api_models.Notification.objects.create(
                                teacher = i.teacher,
                                order = order,
                                order_item = i,
                                type = "New Order",
                            )

                            api_models.EnrolledCourse.objects.create(
                                course = i.course,
                                user = order.student,
                                teacher = i.teacher,
                                order_item = i,
                            )
                    else:
                        return Response({"message": "You have already paid, Thanks"})
                    
                else:
                    return Response({"message": "Payment Not Successfull"})
            else:
                return Response({"message": "An Api Error occured from paypal"})
            

        if session_id != 'null':
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "Paid":
                if order.payment_status == "Processing":
                    order.payment_status = "Paid"
                    order.save()
                    api_models.Notification.objects.create(user=order.student, order = order, type = "Course Enrollment Completed" )    
                    for i in order_items:
                        api_models.Notification.objects.create(
                            teacher = i.teacher,
                            order = order,
                            order_item = i,
                            type = "New Order",
                        )

                        api_models.EnrolledCourse.objects.create(
                            course = i.course,
                            user = order.student,
                            teacher = i.teacher,
                            order_item = i
                        )
                    return Response({"message": "Payment Successfull"})
                
                else:
                    return Response({"message": "Already paid"})
                
            else:
                return Response({"message": "Payment Failed"})
            

class SearchCourseAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get('query')
        
        return api_models.Course.objects.filter(title__icontains=query, platform_status= "Published", teacher_course_status= "Published")
    

class StudentSummeryAPIView(generics.ListAPIView):
    serializer_class = api_serializer.StudentSummerySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id= user_id)

        total_courses = api_models.EnrolledCourse.objects.filter(user = user).count()
        completed_lesson = api_models.CompletedLesson.objects.filter(user= user).count()
        achieved_certificates = api_models.Certificate.objects.filter(user=user).count()

        return [{
            "total_courses": total_courses,
            "completed_lessons": completed_lesson,
            "achieved_certificates": achieved_certificates,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many= True)
        return Response(serializer.data)
    

class StudentCourseListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [AllowAny]


    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        return api_models.EnrolledCourse.objects.filter(user = user)

class StudentCourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [AllowAny]

    lookup_fields = 'enrollment_id'

    def get_object(self):
        user_id = self.kwargs['user_id']
        enrollment_id = self.kwargs['enrollment_id']

        user = User.objects.get(id=user_id)
        return api_models.EnrolledCourse.objects.get(user= user, enrollment_id= enrollment_id)

