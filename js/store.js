const supabaseClient = window.SABA_CONFIGURED
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
  : null;

async function getProducts() {
  if (!supabaseClient) return getDemoProducts();
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

function getDemoProducts() {
  return [
    { id: "demo-1", name: "Bismark Chain - 7 GMS", category: "Chains", weight: "7 GMS", price: 0, description: "Price will be managed from the admin panel.", image_url: "assets/catalog-bismark.jpeg" },
    { id: "demo-2", name: "Valentino Chain", category: "Chains", weight: "3 TO 4 GMS", price: 0, description: "Price will be managed from the admin panel.", image_url: "assets/catalog-valentino.jpeg" },
    { id: "demo-3", name: "Clover Earrings", category: "Earrings", weight: "", price: 0, description: "Elegant clover design.", image_url: "assets/earrings-clover.jpeg" },
    { id: "demo-4", name: "Cross Earrings", category: "Earrings", weight: "", price: 0, description: "Elegant cross design.", image_url: "assets/earrings-cross.jpeg" }
  ];
}

function euro(value) {
  const n = Number(value);
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}
