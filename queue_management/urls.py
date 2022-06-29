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
import debug_toolbar
from rest_framework import routers

from core.views import CustomerViewSet, FormViewSet, QueueViewSet, FormColumnViewSet, FormDataViewSet, ServiceViewSet, BusinessViewSet, WorkerViewSet, ManagerViewSet


router = routers.DefaultRouter()
router.register('customers', CustomerViewSet)
router.register('workers', WorkerViewSet)
router.register('managers', ManagerViewSet)
router.register('queue', QueueViewSet)
router.register('forms', FormViewSet, basename='forms')
router.register('formColums', FormColumnViewSet, basename='formColumns')
router.register('formData', FormDataViewSet,)
router.register('services', ServiceViewSet,)
router.register('businesses', BusinessViewSet,)


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('/', include('core.urls')),
    path('__debug__/', include(debug_toolbar.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
   
] + router.urls

