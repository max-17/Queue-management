from .models import Business, CustomForm, Customer, FormColumn, Queue, FormData, Service
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id','email','first_name', 'last_name', 'password',
                  ]


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'first_name', 'last_name']


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'phone', 'birth_date']

class WorkerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'email']
class ManagerSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['user', 'email']

class QueueSerializer(serializers.ModelSerializer):
    # customer = CustomerSerializer()
    class Meta:
        model = Queue
        fields = ['id', 'customer', 'queue_status', 'placed_at']

class CustomFormSerializer(serializers.ModelSerializer):
    column = serializers.HyperlinkedIdentityField(many=True, view_name='formColumns-detail', read_only=True)
    class Meta:
        model = CustomForm
        fields = ['id', 'name', 'service', 'column']

        

class FormColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormColumn
        fields = ['id', 'form', 'name',]

class FormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormData
        fields = ['id', 'form', 'data',]

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['name', 'location', 'address', 'city']

class GetServiceSerializer(serializers.ModelSerializer):
    business = serializers.StringRelatedField()
    class Meta:
        model = Service
        fields = ['name', 'business',]

