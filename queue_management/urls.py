"""queue_management URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar
# from rest_framework import routers
from rest_framework_nested import routers
from core.views import *



router = routers.SimpleRouter()
# router.register('customers', CustomerViewSet.as_view(), basename='customer')
router.register('businesses', BusinessViewSet,)

business_router = routers.NestedSimpleRouter(router, r'businesses', lookup='business')
business_router.register(r'services', ServiceViewSet, basename='business-services')

router.register('services', ServiceListView)
router.register('workers', WorkerViewSet)
# router.register('managers', ManagerViewSet)
router.register('queue', QueueViewSet)
# router.register('forms', FormViewSet, basename='forms')
# router.register('formColums', FormColumnViewSet, basename='formColumns')
# router.register('formData', FormDataViewSet,)


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('/', include('core.urls')),
    path('__debug__/', include('debug_toolbar.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('customer', CustomerViewSet.as_view()),
    # path('customer', CustomerDetailView.as_view()),
   
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + router.urls + business_router.urls



