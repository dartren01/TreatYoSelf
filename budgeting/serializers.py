from rest_framework import serializers
from budgeting.models import *


class AllTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    #might need to change create and update func, and create a delete func

