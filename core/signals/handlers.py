
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import Customer, User

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_customer_for_new_user(sender, **kwargs):
#     user = kwargs['instance']
#     update_fields = kwargs['update_fields']
#     if kwargs['created']:
#         if not(user.is_staff or user.is_superuser):
#             Customer.objects.create(user=user)
    
#     if update_fields:
#         if('is_staff' in update_fields or 'is_superuser' in update_fields):
#             # try:
#                 Customer.objects.get(user=user.id).delete()
#             # except:
#             #     pass   
            