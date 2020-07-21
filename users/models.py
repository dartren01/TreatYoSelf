from djongo import models
from django.contrib.auth.models import User

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)

    initial_amount = models.CharField(max_length=100, default="0")
    total_amount = models.CharField(max_length=100, default="0")
    total_amount_gained = models.CharField(max_length=100, default="0")
    total_amount_spent = models.CharField(max_length=100, default="0")

    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)
