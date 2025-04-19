
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AssignmentsList from '@/components/Admin/Assignments/AssignmentsList';
import CreateAssignmentDialog from '@/components/Admin/Assignments/CreateAssignmentDialog';

const VisitAssignments: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Assignation des visites</CardTitle>
            <CardDescription>
              Gérez les tournées des commerciaux
            </CardDescription>
          </div>
          <CreateAssignmentDialog />
        </CardHeader>
        <CardContent>
          <AssignmentsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitAssignments;
