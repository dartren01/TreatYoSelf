from django.urls import path
from .api import AllTransactionViewSet, TransactionViewSet


urlpatterns = [
     path('all_transactions/', AllTransactionViewSet.as_view()),
     path('create/income', TransactionViewSet.as_view()),
     path('create/expense', TransactionViewSet.as_view())
]
