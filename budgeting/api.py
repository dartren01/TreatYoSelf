from budgeting.models import Transaction, Categories
from rest_framework import viewsets, permissions
from rest_framework import generics
from rest_framework.response import Response
from .serializers import AllTransactionSerializer, TransactionSerializer, CategoriesSerializer, AllCategorySerializer
from datetime import datetime
from users.models import Profile
from users.serializers import TotalSerializer

# this file is basically views.py

class AllCategoriesViewSet(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = AllCategorySerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            raise Exception("Unauthorized Access")
        # queryset = Transaction.objects.filter(author=user)
        queryset = Categories.objects.filter(author=user)
        return queryset


class CategoriesCreateViewSet(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = CategoriesSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        categories = serializer.save()
        return Response()

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
        self.createTransactionAddTotal(request)

        return Response()

    # helper method for post. When transaction is created, the total model is
    # changed with new transaction added.
    def createTransactionAddTotal(self, request):
        profile = Profile.objects.get(user=self.request.user)
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


class TransactionGetUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = TransactionSerializer

    # update, get, delete
    # gets a set of transaction under the user
    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(author=user)
        return queryset

    # gets a specific transaction
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # deletes a transaction. Updates the delete from the total
    def delete(self, request, *args, **kwargs):
        transaction = Transaction.objects.get(id=self.kwargs.get('pk'))
        self.deleteTransactionFromTotal(request, transaction)
        transaction.delete()
        # add a response
        return Response()

    # update a transaction. Updates total with regards to transaction updated.
    def update(self, request, *args, **kwargs):
        # update transaction
        self.updateTransactiontoTotal(request)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    # changing total model
    # delete transaction amount from total
    def deleteTransactionFromTotal(self, request, transaction):
        profile = Profile.objects.get(user=self.request.user)
        if transaction.t_type == "Expense":
            profile.total_amount = float(
                profile.total_amount) + float(transaction.amount)
            profile.total_amount_spent = float(
                profile.total_amount_spent) - float(transaction.amount)
            profile.save()
        else:
            profile.total_amount = float(
                profile.total_amount) - float(transaction.amount)
            profile.total_amount_gained = float(
                profile.total_amount_gained) - float(transaction.amount)
            profile.save()

    # update transaction amount to total
    def updateTransactiontoTotal(self, request):
        profile = Profile.objects.get(user=self.request.user)
        transaction = Transaction.objects.get(id=self.kwargs.get('pk'))
        if transaction.t_type == "Expense":
            profile.total_amount = float(profile.total_amount) + \
                (float(transaction.amount) - float(request.data.get("amount")))
            profile.total_amount_spent = float(profile.total_amount_spent) - (
                float(transaction.amount) - float(request.data.get("amount")))
            profile.save()
        else:
            profile.total_amount = float(profile.total_amount) - \
                (float(transaction.amount) - float(request.data.get("amount")))
            profile.total_amount_gained = float(profile.total_amount_gained) - (
                float(transaction.amount) - float(request.data.get("amount")))
            profile.save()
