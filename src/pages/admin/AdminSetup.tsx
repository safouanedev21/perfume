import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Database, CheckCircle } from 'lucide-react';
import { seedProducts } from '@/scripts/seedData';

const AdminSetup = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedProducts();
      setSeeded(true);
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-purple/10 via-background to-luxury-gold/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-luxury-cream-dark">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-luxury-purple rounded-full flex items-center justify-center">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Configuration Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configurez votre base de données avec des données d'exemple
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Package className="h-6 w-6 text-luxury-purple" />
              <div>
                <h3 className="font-semibold">Produits d'exemple</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez des produits de démonstration à votre catalogue
                </p>
              </div>
            </div>
          </div>

          {seeded ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Données d'exemple ajoutées avec succès ! Vous pouvez maintenant gérer vos produits.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Cette action va ajouter des produits d'exemple à votre base de données. 
                  Vous pourrez les modifier ou les supprimer plus tard depuis le panneau d'administration.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleSeedData}
                disabled={isSeeding}
                className="w-full bg-luxury-purple hover:bg-luxury-purple-light text-white"
              >
                {isSeeding ? 'Ajout en cours...' : 'Ajouter des produits d\'exemple'}
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" asChild>
              <a href="/admin/dashboard">
                Aller au tableau de bord
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;