export interface ItemOption {
    id: number;
    name: string;
    price: number;
    category_id: number;
    category_name: string;
    image: string | null;
    available_stock: number;
}

export interface CategoryOption {
    id: number;
    name: string;
}

export type CartItem = { itemId: number; name: string; price: number; qty: number; note: string; maxStock: number };