from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assignment
from .serializers import AssignmentSerializer


class AssignmentViewSet(viewsets.ViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Assignment.objects.filter(owner=self.request.user)
        return queryset

    def list(self, request):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        assignment = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.serializer_class(assignment)
        return Response(serializer.data)

    def update(self, request, pk=None):
        assignment = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.serializer_class(assignment, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        assignment = get_object_or_404(self.get_queryset(), pk=pk)
        assignment.delete()
        return Response(status=204)
