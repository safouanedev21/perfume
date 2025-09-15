import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-perfumes.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-luxury-cream via-background to-luxury-cream-dark">
      {/* Custom animations inside the component */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }
          .fade-in {
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}
      </style>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* === Text Content === */}
          <div className="space-y-8 fade-in-up">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-4 w-4 text-luxury-gold animate-pulse" />
              <span className="text-sm font-medium text-luxury-gold">
                Nouvelle Collection 2024
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-luxury-purple via-luxury-purple-light to-luxury-gold bg-clip-text text-transparent">
                  Parfums de
                </span>
                <br />
                <span className="text-foreground">Luxe en Algérie</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Découvrez notre collection exclusive de parfums authentiques des
                plus grandes marques mondiales. Livraison rapide dans toute
                l&apos;Algérie avec paiement à la livraison.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-luxury-purple to-luxury-purple-light hover:from-luxury-purple-dark hover:to-luxury-purple text-white shadow-luxury group transition-transform duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/products")}
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-luxury-purple text-luxury-purple hover:bg-luxury-purple hover:text-white transition-colors duration-300"
                onClick={() => (window.location.href = "/products?sale=true")}
              >
                Offres Spéciales
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-luxury-cream-dark">
              {[
                { value: "500+", label: "Parfums" },
                { value: "50+", label: "Marques" },
                { value: "10k+", label: "Clients Satisfaits" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-luxury-purple">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === Hero Image === */}
          <div className="relative fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-luxury group">
              <img
                src={heroImage}
                alt="Collection de parfums de luxe"
                className="w-full h-[600px] object-cover transform transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-purple/20 via-transparent to-transparent" />
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-luxury-purple/30 to-luxury-purple/10 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
