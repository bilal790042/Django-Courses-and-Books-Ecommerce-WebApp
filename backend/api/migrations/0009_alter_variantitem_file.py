# Generated by Django 4.2.7 on 2024-12-15 01:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_cartorderitem_coupons_country_slug_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='variantitem',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='course-file'),
        ),
    ]
