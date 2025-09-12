import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export async function deleteProduct(id: string, onSuccess?: () => void) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        toast({
            title: "Succès",
            description: "Produit supprimé avec succès",
            variant: "default",
        });
        
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error('Error deleting product:', error);
        toast({
            title: "Erreur",
            description: "Erreur lors de la suppression du produit",
            variant: "destructive",
        });
    }
}
