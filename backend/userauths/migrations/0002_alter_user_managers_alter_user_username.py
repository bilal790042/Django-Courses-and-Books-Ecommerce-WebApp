# Generated by Django 4.2.7 on 2024-12-01 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userauths", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="user",
            managers=[],
        ),
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
