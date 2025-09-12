import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signIn(email, password);
      console.log('signIn response:', response);
      if (response?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error during signIn:', err);
      setError('Une erreur inattendue est survenue');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-purple/10 via-background to-luxury-gold/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-luxury-cream-dark">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-luxury-purple rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Administration
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@parfumerie.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-luxury-cream-dark focus:ring-luxury-purple"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-luxury-cream-dark focus:ring-luxury-purple"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-luxury-purple hover:bg-luxury-purple-light text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;