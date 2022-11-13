
from .models import *
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id','email','first_name', 'last_name', 'password']


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'first_name', 'last_name']


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    
    def get_user_id(self, obj):
        return self.context['user_id']
    
    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'phone', 'birth_date']

class WorkerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'user_id', ]
class ManagerSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(read_only=True)
    
    def get_user_id(self, obj):
        return self.context['user_id']
    class Meta:
        model = Customer
        fields = ['user']

class QueueSerializer(serializers.ModelSerializer):
    # customer = CustomerSerializer()
    class Meta:
        model = Queue
        fields = ['id', 'customer', 'service', 'queue_status', 'placed_at']
        depth = 1

# class CustomFormSerializer(serializers.ModelSerializer):
#     column = serializers.HyperlinkedIdentityField(many=True, view_name='formColumns-detail', read_only=True)
#     class Meta:
#         model = CustomForm
#         fields = ['id', 'name', 'service', 'column']

        

# class FormColumnSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FormColumn
#         fields = ['id', 'form', 'name',]

# class FormDataSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FormData
#         fields = ['id', 'form', 'data',]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','name', 'business']

class BusinessCreateSerializer(serializers.ModelSerializer):
   
  
    class Meta:
        model = Business
        fields = ['id','name', 'lng','lat', 'address', 'city','user',]
class BusinessSerializer(serializers.ModelSerializer):
  
    services = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
     )
    class Meta:
        model = Business
        fields = ['id','name', 'lng','lat', 'address', 'city','services']
        depth = 1 
        
        

class ListServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['name', 'business',]
        depth = 1
      

