# Generated by Django 4.2.7 on 2025-02-11 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_book_pdf_file_book_preview_pages_book_total_pages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='pdf_file',
            field=models.FileField(blank=True, null=True, upload_to='books/'),
        ),
    ]
