# Generated by Django 2.1.5 on 2019-02-10 18:27

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recordings', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measurementrecording',
            name='measurements',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
    ]
