from django.urls import path
from .api import AllTransactionViewSet, TransactionCreateViewSet, TransactionGetUpdateDestroyViewSet


urlpatterns = [
     path('all_transactions/', AllTransactionViewSet.as_view()),
     path('create/income/', TransactionCreateViewSet.as_view()),
     path('create/expense/', TransactionCreateViewSet.as_view()),
     path('transaction/delete/<int:pk>', TransactionGetUpdateDestroyViewSet.as_view()),
     path('transaction/update/<int:pk>', TransactionGetUpdateDestroyViewSet.as_view()),
     path('transaction/get/<int:pk>', TransactionGetUpdateDestroyViewSet.as_view())
]
