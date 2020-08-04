from budgeting.models import Transaction, Categories
from rest_framework import viewsets, permissions
from rest_framework import generics
from rest_framework.response import Response
from .serializers import AllTransactionSerializer, TransactionSerializer, CategoriesSerializer, AllCategorySerializer
from datetime import datetime
from users.models import Profile
from users.serializers import ProfileSerializer

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

class CategoriesGetUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategoriesSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def update(self, request, *args, **kwargs):
        if request.data.get("new_category") and request.data.get("adding"):
            self.addNewCategory(request)
        elif request.data.get("budget_category") and request.data.get("budgeting"):
            self.addBudgetCategory(request)
        elif request.data.get("delete_category") and request.data.get("deleting"):
            self.deleteCategory(request)
        
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        #self.perform_update(serializer)
            #Not using this because I am updating myself.
        #categories = Categories.objects.get(author = self.request.user)
        return Response(serializer.data)

    #Updates Category by adding a new category
    def addNewCategory(self, request):
        categories = Categories.objects.get(author = self.request.user)
        newCategory = request.data.get("new_category")
        categories.categories[newCategory] = 0
        categories.categories_budget[newCategory] = 0
        categories.categories_monthly[newCategory] = {}
        categories.save()

    #Updates Category budget
    def addBudgetCategory(self,request):
        categories = Categories.objects.get(author = self.request.user)
        budgetCategory = request.data.get("budget_category")
        budget = request.data.get("budget")
        categories.categories_budget[budgetCategory] = budget
        categories.save()
    
    #Delete Category
    def deleteCategory(self,request):
        categories = Categories.objects.get(author = self.request.user)
        deleteCategory = request.data.get("delete_category")
        
        del categories.categories[deleteCategory]
        del categories.categories_budget[deleteCategory]
        del categories.categories_monthly[deleteCategory]
        categories.save()
        
        
    def get_queryset(self):
        user = self.request.user
        print(user)
        if user.is_anonymous:
            raise Exception("Unauthorized Access")
        # queryset = Transaction.objects.filter(author=user)
        queryset = Categories.objects.filter(author=user)
        return queryset.order_by('date_posted')



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
        self.addTransactionCategory(request)

        return Response()

    # helper method for post. When transaction is created, the total model is
    # changed with new transaction added.
    def createTransactionAddTotal(self, request):

        # get the profile for the user
        profile = Profile.objects.get(user=self.request.user)

        # get date
        dateObj = datetime.strptime(
            request.data.get("date_posted"), "%Y-%m-%d").date()
        transactionDate = '{}{}'.format(dateObj.month, dateObj.year)

        if request.data.get("t_type") == "Expense":
            # add to total
            profile.total_amount = float(
                profile.total_amount) - float(request.data.get("amount"))
            profile.total_amount_spent = float(
                profile.total_amount_spent) + float(request.data.get("amount"))

            # add to monthly data
            if transactionDate in profile.monthly_data:
                prevExpense = profile.monthly_data[transactionDate]["monthly_spent"]
                profile.monthly_data[transactionDate]["monthly_spent"] = prevExpense + \
                    float(request.data.get("amount"))
            else:
                profile.monthly_data[transactionDate] = {
                    "monthly_gained": 0.0,
                    "monthly_spent": float(request.data.get("amount"))
                }
            profile.total_amount = round(profile.total_amount, 2)
            profile.total_amount_spent = round(profile.total_amount_spent, 2)
            profile.save()
        else:
            # add to total
            profile.total_amount = float(
                profile.total_amount) + float(request.data.get("amount"))
            profile.total_amount_gained = float(
                profile.total_amount_gained) + float(request.data.get("amount"))

            # add to monthly data
            if transactionDate in profile.monthly_data:
                prevGain = profile.monthly_data[transactionDate]["monthly_gained"]
                profile.monthly_data[transactionDate]["monthly_gained"] = prevGain + \
                    float(request.data.get("amount"))
            else:
                profile.monthly_data[transactionDate] = {
                    "monthly_gained": float(request.data.get("amount")),
                    "monthly_spent": 0.0
                }
            profile.total_amount = round(profile.total_amount, 2)
            profile.total_amount_gained = round(profile.total_amount_gained, 2)
            profile.save()

    def addTransactionCategory(self, request):
        requestCategory = request.data.get("category")
        requestAmount = request.data.get("amount")
        categories = Categories.objects.get(author = self.request.user)
        dateObj = datetime.strptime(
            request.data.get("date_posted"), "%Y-%m-%d").date()
        categoryDate = '{}{}'.format(dateObj.month, dateObj.year)
        """
         categories_monthly = {"Food" : {"00-00-00":1000}}
        """
        #Update categories, run this
        categories.categories[requestCategory] += float(requestAmount)

        #Update categories_monthly
        if categoryDate in categories.categories_monthly[requestCategory]:
            categories.categories_monthly[requestCategory][categoryDate] += float(requestAmount)
        else:
            categories.categories_monthly[requestCategory][categoryDate] = float(requestAmount)
        
        
        categories.save()




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
        self.deleteTransactionFromCategory(request,transaction)
        transaction.delete()
        # add a response
        return Response()

    def deleteTransactionFromCategory(self, request, transaction):
        categories = Categories.objects.get(author = self.request.user)
        now_date = "{}{}".format(transaction.month,transaction.year)
        transCategory = transaction.category
        transAmount = transaction.amount
        categories.categories[transCategory] -= float(transAmount)
        categories.categories_monthly[transCategory][now_date] -= float(transAmount)
        if categories.categories_monthly[transCategory][now_date] == 0:
            del categories.categories_monthly[transCategory][now_date]
        
        categories.save()


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

        transactionDate = '{}{}'.format(
            transaction.date_posted.month, transaction.date_posted.year)

        if transaction.t_type == "Expense":
            # delete from total
            profile.total_amount = float(
                profile.total_amount) + float(transaction.amount)
            profile.total_amount_spent = float(
                profile.total_amount_spent) - float(transaction.amount)

            # delete from monthly data
            prevExpense = profile.monthly_data[transactionDate]["monthly_spent"]
            profile.monthly_data[transactionDate]["monthly_spent"] = prevExpense - \
                float(transaction.amount)

            profile.total_amount = round(profile.total_amount, 2)
            profile.save()

        else:
            # delete from total
            profile.total_amount = float(
                profile.total_amount) - float(transaction.amount)
            profile.total_amount_gained = float(
                profile.total_amount_gained) - float(transaction.amount)

            # delete from monthly data
            prevGain = profile.monthly_data[transactionDate]["monthly_gained"]
            profile.monthly_data[transactionDate]["monthly_gained"] = prevGain - \
                float(transaction.amount)

            profile.total_amount = round(profile.total_amount, 2)
            profile.save()

    # update transaction amount to total
    def updateTransactiontoTotal(self, request):
        profile = Profile.objects.get(user=self.request.user)
        transaction = Transaction.objects.get(id=self.kwargs.get('pk'))

        oldTransactionDate = '{}{}'.format(
            transaction.date_posted.month, transaction.date_posted.year)

        dateObj = datetime.strptime(
            request.data.get("date_posted"), '%Y-%m-%d').date()
        newTransactionDate = '{}{}'.format(dateObj.month, dateObj.year)

        if transaction.t_type == "Expense":
            profile.total_amount = float(profile.total_amount) + \
                (float(transaction.amount) - float(request.data.get("amount")))
            profile.total_amount_spent = float(profile.total_amount_spent) - (
                float(transaction.amount) - float(request.data.get("amount")))

            # update monthly
            # delete transaction amount from current transaction month year
            prevExpense = profile.monthly_data[oldTransactionDate]["monthly_spent"]
            profile.monthly_data[oldTransactionDate]["monthly_spent"] = prevExpense - \
                float(transaction.amount)

            # if the new date exists
            if profile.monthly_data[newTransactionDate]:
                # get the expenses for that month year
                prevExpenseNew = profile.monthly_data[newTransactionDate]["monthly_spent"]
                # update monthly_spend for that month year with new amount
                profile.monthly_data[newTransactionDate]["monthly_spent"] = prevExpenseNew + \
                    float(request.data.get("amount"))

            else:
                # add new date to data with amount
                profile.monthly_data[newTransactionDate] = {
                    "monthly_gained": 0.0,
                    "monthly_spent": float(request.data.get("amount"))
                }

            profile.total_amount = round(profile.total_amount, 2)
            profile.save()
        else:
            profile.total_amount = float(profile.total_amount) - \
                (float(transaction.amount) - float(request.data.get("amount")))
            profile.total_amount_gained = float(profile.total_amount_gained) - (
                float(transaction.amount) - float(request.data.get("amount")))

            # update monthly
            # delete transaction amount from current transaction month year
            prevGain = profile.monthly_data[oldTransactionDate]["monthly_gained"]
            profile.monthly_data[oldTransactionDate]["monthly_gained"] = prevGain - \
                float(transaction.amount)

            # if the new date exists
            if profile.monthly_data[newTransactionDate]:
                # get the expenses for that month year
                prevGainNew = profile.monthly_data[newTransactionDate]["monthly_gained"]
                # update monthly_spend for that month year with new amount
                profile.monthly_data[newTransactionDate]["monthly_gained"] = prevGainNew + \
                    float(request.data.get("amount"))

            else:
                # add new date to data with amount
                profile.monthly_data[newTransactionDate] = {
                    "monthly_gained": float(request.data.get("amount")),
                    "monthly_spent": 0.0
                }

            profile.total_amount = round(profile.total_amount, 2)
            profile.save()
