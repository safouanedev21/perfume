import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-luxury-cream-dark border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Parfumerie
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre destination de confiance pour les parfums de luxe en Algérie. 
              Nous proposons une collection soigneusement sélectionnée des meilleures fragrances.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-luxury-purple">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-luxury-purple">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-luxury-purple">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-luxury-purple transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-luxury-purple transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-luxury-purple transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-luxury-purple transition-colors">Guide des Tailles</a></li>
              <li><a href="#" className="hover:text-luxury-purple transition-colors">Politique de Retour</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Service Client</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+213 553 883 301</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@parfumerie.dz</span>
              </li>
            </ul>
           
          </div>

          
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-luxury-cream-dark">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Parfumerie. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-luxury-purple transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="hover:text-luxury-purple transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-luxury-purple transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;