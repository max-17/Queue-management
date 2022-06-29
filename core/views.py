
from django.db.models import F
from django.contrib.gis.geos import fromstr, Point
from django.contrib.gis.db.models.functions import Distance
from django.views import generic
from rest_framework.response import Response 
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.permissions import AllowAny, DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly, IsAdminUser, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.models import Business, CustomForm, Customer, FormColumn, Queue, FormData, Service, Worker, Manager
from core.serializers import CustomerSerializer, FormColumnSerializer, FormDataSerializer, QueueSerializer, CustomFormSerializer, FormDataSerializer, GetServiceSerializer, BusinessSerializer, WorkerSerializer, ManagerSerializer
# Create your views here.

class CustomerViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        customer = Customer.objects.get(user_id=request.user.id)
        if request.method == 'GET':
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = CustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class WorkerViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        worker = Worker.objects.get(user_id=request.user.id)
        if request.method == 'GET':
            serializer = WorkerSerializer(worker)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = WorkerSerializer(worker, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class ManagerViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        manager = Manager.objects.get(user_id=request.user.id)
        if request.method == 'GET':
            serializer = CustomerSerializer(manager)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = CustomerSerializer(manager, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
            

class QueueViewSet(ModelViewSet):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Queue.objects.all()
        customer_id = Customer.objects.only("id").get(user_id=user.id)
        return Queue.objects.filter(customer_id=customer_id)        

   
class FormViewSet(ModelViewSet):
    queryset = CustomForm.objects.all()
    serializer_class = CustomFormSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:        
            return CustomForm.objects.all()
        business = Business.objects.only('id').get(manager = user.id)
        return CustomForm.objects.select_related('service').filter(service__business = business)
    
class FormColumnViewSet(ModelViewSet):
    queryset = FormColumn.objects.all()
    serializer_class = FormColumnSerializer
    # permission_classes = [IsAuthenticated]
    
class FormDataViewSet(ModelViewSet):
    queryset = FormData.objects.all()
    serializer_class = FormDataSerializer
    # permission_classes = [IsAuthenticated]
    # filter_backends = [SearchFilter]
    # search_fields = ['data']
    
class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = GetServiceSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'business__name']
   
class BusinessViewSet(ModelViewSet):
    
    longitude = -80.191788
    latitude = 25.761681
    user_location = Point(longitude, latitude, srid=4326)

    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    # permission_classes = [IsAuthenticated]
    # filter_backends = [SearchFilter]
    # search_fields = ['name', 'location']
  
   
