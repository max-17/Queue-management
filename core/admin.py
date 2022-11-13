from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from simple_history.admin import SimpleHistoryAdmin
from django.db.models.aggregates import Count
from .models import *
from django.utils.translation import gettext_lazy as _
# Register your models here.

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name",)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name','last_name','email','password1', 'password2',),
        }),
    )
    list_display = ("email", "first_name", "last_name", "is_staff", 'id')
   
    ordering = ['email']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'user_id']
    list_per_page = 10
    list_select_related = ['user']
    ordering = ['user__first_name', 'user__last_name']
    search_fields = ['first_name__istartswith', 'last_name__istartswith']


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name']
    list_per_page = 10
    list_select_related = ['user']
    ordering = ['user__first_name', 'user__last_name']
    search_fields = ['first_name__istartswith', 'last_name__istartswith']

    

# @admin.register(Manager)
# class ManagerAdmin(admin.ModelAdmin):
#     list_display = ['user', 'business']
#     list_per_page = 10
#     list_select_related = ['user']


class QueueHistoryAdmin(SimpleHistoryAdmin):
    list_display = ["id", "name", "status"]
    history_list_display = ["status"]
    search_fields = ['name', 'user__username']

@admin.register(Queue)
class QueueAdmin(QueueHistoryAdmin):
    autocomplete_fields = ['customer']
    list_display = ['customer', 'placed_at',  'service', 'queue_status', ]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'business']

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'lng', 'lat']

# @admin.register(CustomForm)
# class FormAdmin(admin.ModelAdmin):
#     list_display = ['name', 'service', 'business']

# @admin.register(FormColumn)
# class FormColumnAdmin(admin.ModelAdmin):
#     list_display = ['form','name']

# @admin.register(FormData)
# class FormDataAdmin(admin.ModelAdmin):
#     list_display = ['form','data']
