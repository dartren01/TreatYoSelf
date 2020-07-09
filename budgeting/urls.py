from django.urls import path



from .api import AllTransactionViewSet


urlpatterns = [
     path('all_transactions/', AllTransactionViewSet.as_view()),
]
