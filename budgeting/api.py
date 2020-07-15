from budgeting.models import Transaction
from rest_framework import viewsets, permissions
from rest_framework import generics
from rest_framework.response import Response
from .serializers import AllTransactionSerializer, TransactionSerializer

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


class TransactionUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TransactionSerializer

    # update, get, delete
    def delete(self, request, *args, **kwargs):
        Transaction.objects.get(id=self.kwargs.get('id')).delete()
        return Response()

