from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser
# from django.db import models
from django.db import models
from django.conf import settings
from simple_history.models import HistoricalRecords


class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError("The given username must be set")
        email = self.normalize_email(email)
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None
    isCustomer = False
    isWorker = False
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()


class Customer(models.Model):

    phone = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name

    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class Business(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    lng = models.DecimalField(max_digits=18, decimal_places=15)
    lat = models.DecimalField(max_digits=18, decimal_places=15)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Worker(models.Model):

    phone = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name

    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class Service(models.Model):
    name = models.CharField(max_length=100)
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE,  related_name='services')

    def __str__(self):
        return self.name

# class Manager(models.Model):
#     user = models.OneToOneField(
#         settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
#     business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name = 'manager', null=True)

#     def __str__(self):
#         return self.user.email


class Queue(models.Model):
    QUEUE_STATUS_WAITING = 'W'
    QUEUE_STATUS_COMPLETE = 'C'
    QUEUE_STATUS_FAILED = 'F'
    QUEUE_STATUS_CHOICES = [
        (QUEUE_STATUS_WAITING, 'Waiting'),
        (QUEUE_STATUS_COMPLETE, 'Complete'),
        (QUEUE_STATUS_FAILED, 'Failed')
    ]

    placed_at = models.DateTimeField(auto_now_add=True)
    queue_status = models.CharField(
        max_length=1, choices=QUEUE_STATUS_CHOICES, default=QUEUE_STATUS_WAITING)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    history = HistoricalRecords()

    class Meta:
        permissions = [
            ('cancel_queue', 'Can cancel queue')
        ]


# class CustomForm(models.Model):
#     name = models.CharField(max_length=100)
#     service = models.ForeignKey(Service, on_delete=models.CASCADE,  blank=False)

#     @admin.display()
#     def business(self):
#         return self.service.business


#     def __str__(self) -> str:
#         return f'{self.service.business.name}-> {self.name}'

# class FormColumn(models.Model):
#     name = models.CharField(max_length=50)
#     form = models.ForeignKey(CustomForm, on_delete=models.CASCADE, related_name='column', blank=False)

#     def __str__(self) -> str:
#         return f'{self.form}-> {self.name}'

# class FormData(models.Model):
#     data = models.JSONField()
#     form = models.ForeignKey(CustomForm, on_delete=models.CASCADE, blank=False)
