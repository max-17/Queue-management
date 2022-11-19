
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthenticatedOrCreate
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.filters import SearchFilter

from core.models import *
from core.serializers import *


class CustomerViewSet(RetrieveUpdateDestroyAPIView):

    serializer_class = CustomerSerializer

    def get_object(self):
        return get_object_or_404(Customer, user_id=self.request.user.id)

    # def get_permissions(self):
    #     """
    #     Instantiates and returns the list of permissions that this view requires.
    #     """
    #     if self.action == 'list':
    #         permission_classes = [IsAdminUser]
    #     else:
    #         permission_classes = []
    #     return [permission() for permission in permission_classes]

    # @action(detail=False, methods=['GET', 'PATCH'])
    # def me(self, request):
    #         customer = Customer.objects.get(user_id=request.user.id)
    #         if request.method == 'GET':
    #             serializer = CustomerSerializer(customer)
    #             return Response(serializer.data)
    #         elif request.method == 'PATCH':
    #             serializer = CustomerSerializer(customer, data=request.data, context = {"user_id": request.user.id})
    #             serializer.is_valid(raise_exception=True)
    #             serializer.save()
    #             return Response(serializer.data)


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


# class fViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
#     queryset = Manager.objects.all()
#     serializer_class = ManagerSerializer

#     @action(detail=False, methods=['GET', 'PUT'])
#     def me(self, request):
#         manager = Manager.objects.get(user_id=request.user.id)
#         if request.method == 'GET':
#             serializer = CustomerSerializer(manager)
#             return Response(serializer.data)
#         elif request.method == 'PUT':
#             serializer = CustomerSerializer(manager, data=request.data)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             return Response(serializer.data)


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


# class FormViewSet(ModelViewSet):
#     queryset = CustomForm.objects.all()
#     serializer_class = CustomFormSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         user = self.request.user
#         if user.is_superuser:
#             return CustomForm.objects.all()
#         business = Business.objects.only('id').get(manager = user.id)
#         return CustomForm.objects.select_related('service').filter(service__business = business)

# class FormColumnViewSet(ModelViewSet):
#     queryset = FormColumn.objects.all()
#     serializer_class = FormColumnSerializer
#     # permission_classes = [IsAuthenticated]

# class FormDataViewSet(ModelViewSet):
#     queryset = FormData.objects.all()
#     serializer_class = FormDataSerializer
#     # permission_classes = [IsAuthenticated]
#     # filter_backends = [SearchFilter]
#     # search_fields = ['data']

# class ServiceViewSet(ModelViewSet):
#     queryset = Service.objects.all()
#     serializer_class = GetServiceSerializer
#     # permission_classes = [IsAuthenticated]
#     filter_backends = [SearchFilter]
#     search_fields = ['name', 'business__name']


class BusinessViewSet(CreateModelMixin,
                      GenericViewSet):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticatedOrCreate]
    queryset = Business.objects.prefetch_related('services')

    def get_object(self):
        return Business.objects.get(user__id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        user = {'email': request.data['email'],
                'password': request.data['password']}
        userSerializer = UserCreateSerializer(data=user)
        userSerializer.is_valid(raise_exception=True)
        userSerializer.save()

        data = {'user': User.objects.get(email=request.data['email']).id,
                'name': request.data['name'],
                'address': request.data['address'],
                'city': request.data['city'],
                'lat': request.data['lat'],
                'lng': request.data['lng'],

                }

        serializer = BusinessCreateSerializer(data=data)

        if (not serializer.is_valid()):
            User.objects.get(email=user['email']).delete()

        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['GET', 'PUT', 'DELETE'])
    def instance(self, request, *args, **kwargs):

        instance = get_object_or_404(
            self.get_queryset(), user__id=request.user.id)

        if request.method == 'GET':
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        if request.method == 'PUT':
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    # @action(methods=['get', 'post','patch', 'delete'], detail=True)
    # def services(self, request, pk):
    #     services = Service.objects.filter(business_id=pk)
    #     serializer = ServiceSerializer(services, many=True)
    #     return ServiceViewSet.list(self, request)

    from datetime import date

    today = date.today()
    print("Today's date:", today)


class ServiceViewSet(ModelViewSet):
    """Viewset of service"""
    serializer_class = ServiceSerializer

    def get_business_id(self):

        return Business.objects.get(user__id=self.request.user.id).id

    def get_serializer_context(self):
        context = super(ServiceViewSet, self).get_serializer_context()
        context.update({'business_id': self.get_business_id()})
        return context

    def get_queryset(self, *args, **kwargs):
        return Service.objects.filter(business=self.get_business_id())


class ServiceListView(ListModelMixin, GenericViewSet):
    """List view of service"""

    queryset = Service.objects.select_related('business').all()
    serializer_class = ListServiceSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'business__name', 'business__address']
