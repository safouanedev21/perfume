import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-perfumes.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-luxury-cream via-background to-luxury-cream-dark">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <span className="text-sm font-medium text-luxury-gold">Nouvelle Collection 2024</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-luxury-purple via-luxury-purple-light to-luxury-gold bg-clip-text text-transparent">
                  Parfums de
                </span>
                <br />
                <span className="text-foreground">Luxe en Algérie</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Découvrez notre collection exclusive de parfums authentiques des plus grandes marques mondiales. 
                Livraison rapide dans toute l'Algérie avec paiement à la livraison.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-luxury-purple to-luxury-purple-light hover:from-luxury-purple-dark hover:to-luxury-purple text-white shadow-luxury group"
                onClick={() => window.location.href = '/products'}
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-luxury-purple text-luxury-purple hover:bg-luxury-purple hover:text-white"
                onClick={() => window.location.href = '/products?sale=true'}
              >
                Offres Spéciales
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-luxury-cream-dark">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-luxury-purple">500+</div>
                <div className="text-sm text-muted-foreground">Parfums</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-luxury-purple">50+</div>
                <div className="text-sm text-muted-foreground">Marques</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-luxury-purple">10k+</div>
                <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-luxury">
              <img 
                src={heroImage} 
                alt="Collection de parfums de luxe" 
                className="w-full h-[600px] object-cover"
              />
              
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-purple/20 via-transparent to-transparent" />
              
              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-luxury-gold font-bold text-lg">-30%</div>
                  <div className="text-xs text-muted-foreground">Sur une sélection</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-luxury-purple/30 to-luxury-purple/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;