from django.urls import path
from .api import AllTransactionViewSet, TransactionCreateViewSet, TransactionUpdateDestroyViewSet


urlpatterns = [
     path('all_transactions/', AllTransactionViewSet.as_view()),
     path('create/income/', TransactionCreateViewSet.as_view()),
     path('create/expense/', TransactionCreateViewSet.as_view()),
     path('transaction/delete/<int:id>', TransactionUpdateDestroyViewSet.as_view()),
     path('transaction/update/<int:id>', TransactionUpdateDestroyViewSet.as_view())
]
