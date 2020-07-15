from rest_framework import serializers
from budgeting.models import *


class AllTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('t_type', 'category', 'source', 'amount', 'notes', 'date_posted')

    # might need to change create and update func, and create a delete func

    # create to be explicit
    def create(self, validated_data):
        transaction = Transaction.objects.create(
            t_type=validated_data['t_type'],
            category=None,
            source=validated_data['source'],
            amount=validated_data['amount'],
            notes=validated_data['notes'],
            date_posted=validated_data['date_posted'],
            author=self.context['request'].user,
            in_history=False,
            year=validated_data['date_posted'].year,
            month=validated_data['date_posted'].month,
        )
        transaction.save()
        return transaction

