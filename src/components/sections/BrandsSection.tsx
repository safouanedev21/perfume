const brands = [
  {
    name: "Giorgio Armani",
    logo: "https://static.vecteezy.com/system/resources/previews/023/585/874/original/giorgio-armani-logo-brand-clothes-white-design-fashion-symbol-illustration-with-black-background-free-vector.jpg"
  },
  {
    name: "Invictus",
    logo: "https://tse4.mm.bing.net/th/id/OIP.74UA2CqOA6zfzHj7rCcIBgHaF0?rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
  {
    name: "Azzaro Wanted",
    logo: "https://resim.parfum.gen.tr/mod_gallery/mod_parfum/original/FODJBUfOfYiL42j.jpg"
  },
  {
    name: "Armani Code",
    logo: "https://asset.sephora.co.uk/img/prod/sku/656879/311296_media_swatch_07-08-25-16-59-46.jpg"
  }
];


const BrandsSection = () => {
  return (
    <section className="py-16 bg-luxury-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Nos Marques Partenaires
          </h2>
          <p className="text-muted-foreground">
            Nous travaillons avec les plus grandes marques de parfums au monde
          </p>
        </div>

        {/* Brands Grid */}
        <div className="flex justify-center">
          <div className="my-8 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brands.map((brand, index) => (
          <div 
            key={index}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className="bg-white rounded-lg shadow-sm hover:shadow-luxury transition-all duration-300 cursor-pointer w-full">
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`}
                className="w-full h-full object-cover rounded-lg"
                style={{ aspectRatio: "1/1" }}
              />
            </div>
            <span className="text-xs font-medium text-foreground text-center">
              {brand.name}
            </span>
          </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-purple to-luxury-purple-light rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">100% Authentique</h3>
            <p className="text-sm text-muted-foreground">Tous nos parfums sont garantis authentiques</p>
          </div>

          <div className="space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-luxury-purple-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">Meilleurs Prix</h3>
            <p className="text-sm text-muted-foreground">Prix compétitifs et offres exclusives. Garantie du meilleur prix en Algérie.</p>
          </div>

          <div className="space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-luxury-purple to-luxury-gold rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">Livraison Rapide</h3>
            <p className="text-sm text-muted-foreground">Livraison dans toute l'Algérie en 24-48h. Paiement à la livraison disponible.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;