from rest_framework import serializers
from budgeting.models import *
from datetime import datetime


class AllTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ('t_type', 'category', 'source',
                  'amount', 'notes', 'date_posted')

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

    def update(self, instance, validated_data):
        transactionDate = datetime.strptime(
            str(validated_data.get("date_posted")), '%Y-%m-%d')
        instance.category = validated_data.get("category")
        instance.source = validated_data.get("source")
        instance.amount = validated_data.get("amount")
        instance.date_posted = validated_data.get("date_posted")
        instance.notes = validated_data.get("notes")
        instance.year = transactionDate.year
        instance.month = transactionDate.month

        instance.save()
        return instance
