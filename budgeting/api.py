from budgeting.models import Transaction
from rest_framework import viewsets, permissions
from rest_framework import generics
from rest_framework.response import Response
from .serializers import AllTransactionSerializer, TransactionSerializer
from datetime import datetime

# this file is basically views.py

class AllTransactionViewSet(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = AllTransactionSerializer

    def get_queryset(self):
        user = self.request.user
        print(user)
        if user.is_anonymous:
            raise Exception("Unauthorized Access")
        # queryset = Transaction.objects.filter(author=user)
        queryset = Transaction.objects.filter(author=user)
        return queryset.order_by('date_posted')


class TransactionCreateViewSet(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TransactionSerializer

    # create


class TransactionGetUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TransactionSerializer

    # update, get, delete
    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(author=user)
        return queryset

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def delete(self, request, *args, **kwargs):
        Transaction.objects.get(id=self.kwargs.get('pk')).delete()
        return Response()

    def update(self, request, *args, **kwargs):
        # update transaction
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        transactionDate = datetime.strptime(request.data.get("date_posted"), '%Y-%m-%d')
        instance.category = request.data.get("category")
        instance.source = request.data.get("source")
        instance.amount = request.data.get("amount")
        instance.date_posted = request.data.get("date_posted")
        instance.notes = request.data.get("notes")
        instance.year = transactionDate.year
        instance.month = transactionDate.month

        instance.save()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

