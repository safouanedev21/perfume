import { supabase } from '@/integrations/supabase/client';

const sampleProducts = [
  {
    name: "La Vie Est Belle Intense",
    price: 15500,
    stock_quantity: 12,
    description: "Un parfum floral gourmand intense avec des notes de rose, iris et vanille.",
    image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Sauvage Elixir",
    price: 22000,
    stock_quantity: 8,
    description: "Un parfum masculin puissant avec des notes d'épices et de bois précieux.",
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Black Opium Intense",
    price: 17800,
    stock_quantity: 3,
    description: "Un parfum oriental gourmand avec des notes de café, vanille et fleur d'oranger.",
    image_url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Libre",
    price: 16200,
    stock_quantity: 15,
    description: "Un parfum floral moderne avec des notes de lavande, jasmin et vanille.",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0ef7ba26ee2?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Acqua di Giò Profondo",
    price: 14500,
    stock_quantity: 0,
    description: "Un parfum aquatique frais avec des notes d'agrumes et de bois marin.",
    image_url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59de8?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Good Girl",
    price: 18900,
    stock_quantity: 7,
    description: "Un parfum oriental gourmand avec des notes de tuberose, jasmin et cacao.",
    image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Bleu de Chanel",
    price: 19500,
    stock_quantity: 11,
    description: "Un parfum masculin sophistiqué avec des notes d'agrumes, menthe et cèdre.",
    image_url: "https://images.unsplash.com/photo-1595425970377-c9703cf4b5b0?w=400&h=400&fit=crop&crop=center"
  },
  {
    name: "Miss Dior",
    price: 16800,
    stock_quantity: 9,
    description: "Un parfum floral romantique avec des notes de rose, jasmin et patchouli.",
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center"
  }
];

export const seedProducts = async () => {
  try {
    console.log('Seeding products...');
    
    // Clear existing products
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insert sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts);

    if (error) {
      console.error('Error seeding products:', error);
    } else {
      console.log('Products seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Run the seed function if this file is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser environment
  (window as any).seedProducts = seedProducts;
}