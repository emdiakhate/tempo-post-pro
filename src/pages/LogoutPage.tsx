/**
 * Page de déconnexion
 * Gère la déconnexion de l'utilisateur et redirige vers la page de login
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [logoutSuccess, setLogoutSuccess] = React.useState(false);

  useEffect(() => {
    // Si pas d'utilisateur connecté, rediriger vers login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Déconnexion automatique après 2 secondes
    const timer = setTimeout(() => {
      handleLogout();
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Simuler un délai de déconnexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Effectuer la déconnexion
      logout();
      
      setLogoutSuccess(true);
      
      // Rediriger vers login après 1.5 secondes
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleLogoutNow = () => {
    handleLogout();
  };

  const handleCancel = () => {
    navigate(-1); // Retour à la page précédente
  };

  if (!currentUser) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Déconnexion
          </CardTitle>
          <CardDescription>
            Vous êtes sur le point de vous déconnecter de votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!logoutSuccess ? (
            <>
              {/* Informations utilisateur */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentUser.role} • {currentUser.team}
                    </p>
                  </div>
                </div>
              </div>

              {/* Avertissement */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Attention
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Vous perdrez l'accès à vos données en temps réel</li>
                      <li>• Les posts en cours de création seront sauvegardés</li>
                      <li>• Vous devrez vous reconnecter pour continuer</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleCancel}
                  variant="outline" 
                  className="flex-1"
                  disabled={isLoggingOut}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleLogoutNow}
                  className="flex-1"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </>
                  )}
                </Button>
              </div>

              {/* Compte à rebours */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Déconnexion automatique dans <span className="font-mono font-bold text-blue-600">2</span> secondes
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Succès */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Déconnexion réussie
                  </h3>
                  <p className="text-gray-600">
                    Vous avez été déconnecté avec succès. Redirection vers la page de connexion...
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutPage;
