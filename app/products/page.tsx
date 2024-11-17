import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = await createClient();
    const { data: products, error } = await supabase.from('products').select();

    if (error) {
        console.error("Error fetching products:", error.message);
        return <p className="text-red-500">Failed to load products.</p>;
    }

    if (!products) {
        return <p>Loading...</p>;
    }

    return <pre>{JSON.stringify(products, null, 2)}</pre>;
}