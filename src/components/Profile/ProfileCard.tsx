
import React from 'react';
import { User, Mail, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  zone: string;
}

interface ProfileCardProps {
  userData: UserData | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData }) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle>Informations personnelles</CardTitle>
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src="" alt={userData?.name} />
          <AvatarFallback className="bg-bisko-100 text-bisko-700 dark:bg-bisko-900 dark:text-bisko-300">
            {userData?.name?.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Nom</span>
          </div>
          <p className="font-medium">{userData?.name || 'Non renseigné'}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Email</span>
          </div>
          <p className="font-medium">{userData?.email || 'Non renseigné'}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Award className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Rôle</span>
          </div>
          <p className="font-medium capitalize">{userData?.role || 'Non renseigné'}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Zone géographique</span>
          </div>
          <p className="font-medium">{userData?.zone || 'Non renseignée'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
