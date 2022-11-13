class CustomerDetailView(APIView):

    def get(self, request, *args, **kwargs):
        print(request.user.id)
        customer = get_object_or_404(Customer, user_id=request.user.id)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        Customer = get_object_or_404(Customer, user_id=request.user.id)
        serializer = CustomerSerializer(Customer, data=request.data, partial=True)
        if serializer.is_valid():
            Customer = serializer.save()
            return Response(CustomerSerializer(Customer).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        customer = get_object_or_404(Customer, user_id=request.user.id)
        customer.delete()
        return Response("Customer deleted", status=status.HTTP_204_NO_CONTENT)