# Generated by Django 4.2.7 on 2024-12-07 06:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import shortuuid.django_fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0005_remove_cartorderitem_coupons_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="CartOrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "tax_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "initial_total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "saved",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("applied_coupon", models.BooleanField(default=False)),
                (
                    "oid",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "coupons",
                    models.ManyToManyField(blank=True, null=True, to="api.coupon"),
                ),
            ],
            options={
                "ordering": ["-date"],
            },
        ),
        migrations.CreateModel(
            name="Course",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "file",
                    models.FileField(blank=True, null=True, upload_to="course-file"),
                ),
                (
                    "image",
                    models.FileField(blank=True, null=True, upload_to="course-file"),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("English", "English"),
                            ("Spanish", "Spanish"),
                            ("French", "French"),
                        ],
                        default="English",
                        max_length=200,
                    ),
                ),
                (
                    "level",
                    models.CharField(
                        choices=[
                            ("Beginner", "Beginner"),
                            ("Intermediate", "Intermediate"),
                            ("Advance", "Advance"),
                        ],
                        default="Beginner",
                        max_length=200,
                    ),
                ),
                (
                    "platform_status",
                    models.CharField(
                        choices=[
                            ("Review", "Review"),
                            ("Disabled", "Disabled"),
                            ("Rejected", "Rejected"),
                            ("Draft", "Draft"),
                            ("Published", "Published"),
                        ],
                        default="Published",
                        max_length=200,
                    ),
                ),
                (
                    "teacher_course_status",
                    models.CharField(
                        choices=[
                            ("Draft", "Draft"),
                            ("Disabled", "Disabled"),
                            ("Published", "Published"),
                        ],
                        default="Published",
                        max_length=200,
                    ),
                ),
                ("featured", models.BooleanField(default=False)),
                (
                    "course_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("slug", models.SlugField(blank=True, null=True, unique=True)),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name="Question_Answer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(blank=True, max_length=1000, null=True)),
                (
                    "qa_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-date"],
            },
        ),
        migrations.CreateModel(
            name="Variant",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=1000)),
                (
                    "varient_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
            ],
        ),
        migrations.AlterField(
            model_name="category",
            name="title",
            field=models.CharField(default=11, max_length=100),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="WishList",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "Course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="VariantItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=1000)),
                ("description", models.TextField(blank=True, null=True)),
                ("file", models.FileField(upload_to="course-file")),
                ("duration", models.DurationField(blank=True, null=True)),
                (
                    "content_duration",
                    models.CharField(blank=True, max_length=1000, null=True),
                ),
                ("preview", models.BooleanField(default=False)),
                (
                    "variant_item_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "variant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variant_items",
                        to="api.variant",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("review", models.TextField()),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "rating",
                    models.IntegerField(
                        choices=[
                            (1, "1 star"),
                            (2, "2 star"),
                            (3, "3 star"),
                            (4, "4  star"),
                            (5, "5 star"),
                        ],
                        default=None,
                    ),
                ),
                ("repy", models.CharField(blank=True, max_length=1000, null=True)),
                ("active", models.BooleanField(default=False)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Question_Answer_Message",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("message", models.TextField(blank=True, null=True)),
                (
                    "qam_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                (
                    "qa_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.question_answer",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["date"],
            },
        ),
        migrations.CreateModel(
            name="Notification",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("New Order", "New Order"),
                            ("New Review", "New Review"),
                            ("New Course Question", "New Course Question"),
                            ("Draft", "Draft"),
                            ("Course Published", "Course Published"),
                            (
                                "Course Enrollment Completed",
                                "Course Enrollment Completed",
                            ),
                        ],
                        max_length=1000,
                    ),
                ),
                ("seen", models.BooleanField(default=False)),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "order",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.cartorder",
                    ),
                ),
                (
                    "order_item",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.cartorderitem",
                    ),
                ),
                (
                    "review",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.review",
                    ),
                ),
                (
                    "teacher",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.teacher",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Note",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(blank=True, max_length=1000, null=True)),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                ("note", models.TextField()),
                (
                    "note_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EnrolledCourse",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "enrollment_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "order_item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.cartorderitem",
                    ),
                ),
                (
                    "teacher",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.teacher",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="course",
            name="category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="api.category",
            ),
        ),
        migrations.AddField(
            model_name="course",
            name="teacher",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.teacher"
            ),
        ),
        migrations.CreateModel(
            name="CompletedLesson",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "variant_item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.variantitem",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Certificate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "certificate_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890",
                        length=6,
                        max_length=20,
                        prefix="",
                        unique=True,
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="cartorderitem",
            name="course",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="order_item",
                to="api.course",
            ),
        ),
        migrations.AddField(
            model_name="cartorderitem",
            name="order",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="orderitem",
                to="api.cartorder",
            ),
        ),
        migrations.AddField(
            model_name="cartorderitem",
            name="teacher",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.teacher"
            ),
        ),
        migrations.CreateModel(
            name="Cart",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "tax_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "total",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                ("country", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "cart_id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet="1234567890", length=6, max_length=20, prefix=""
                    ),
                ),
                ("date", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.course"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
