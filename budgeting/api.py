from budgeting.models import Transaction
from rest_framework import viewsets, permissions
from rest_framework import generics
from rest_framework.response import Response
from .serializers import AllTransactionSerializer, TransactionSerializer
from datetime import datetime
from users.models import Profile
from users.serializers import TotalSerializer

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
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        profile = Profile.objects.get(user=self.request.user)
        print(profile.pk)
        if request.data.get("t_type") == "Expense":
            profile.total_amount = float(
                profile.total_amount) - float(request.data.get("amount"))
            profile.total_amount_spent = float(
                profile.total_amount_spent) + float(request.data.get("amount"))
            profile.save()
        else:
            profile.total_amount = float(
                profile.total_amount) + float(request.data.get("amount"))
            profile.total_amount_gained = float(
                profile.total_amount_gained) + float(request.data.get("amount"))
            profile.save()

        return Response()


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
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
