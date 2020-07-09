from djongo import models
from django.contrib.auth.models import User
from PIL import Image


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    initial_amount = models.CharField(max_length=100, default="0")
    total_amount = models.CharField(max_length=100, default="0")
    total_amount_gained = models.CharField(max_length=100, default="0")
    total_amount_spent = models.CharField(max_length=100, default="0")


