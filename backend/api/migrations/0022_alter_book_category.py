# Generated by Django 4.2.7 on 2025-02-11 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_book_pdf_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='category',
            field=models.CharField(choices=[('Technology', 'Technology'), ('Adventure', 'Adventure'), ('Science', 'Science'), ('History', 'History'), ('Web Development', 'Web Development'), ('AI', 'AI'), ('ML', 'ML'), ('Python', 'Python'), ('Mobile App', 'Mobile App'), ('Deep Learning', 'Deep Learning')], max_length=50),
        ),
    ]
