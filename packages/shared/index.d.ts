export type Product = {
    id: string;
    name: string;
    priceNOK: number;
};
export type CartLine = {
    productId: string;
    qty: number;
};
export declare const catalog: Record<string, Product>;
export declare function addToCart(cart: CartLine[], productId: string): CartLine[];
export declare function calcTotal(cart: CartLine[]): number;
export type CartAction = {
    type: 'add';
    productId: string;
} | {
    type: 'remove';
    productId: string;
} | {
    type: 'clear';
};
export declare function removeFromCart(cart: CartLine[], productId: string): CartLine[];
export declare function clearCart(): CartLine[];
export declare function cartReducer(state: CartLine[], action: CartAction): CartLine[];
export type CartItemView = {
    id: string;
    name: string;
    priceNOK: number;
    qty: number;
    lineTotalNOK: number;
};
export declare function mapCartItems(cart: CartLine[]): CartItemView[];
export declare function countItems(cart: CartLine[]): number;
export declare function useCart(initial?: CartLine[]): {
    cart: CartLine[];
    items: CartItemView[];
    totalNOK: number;
    itemCount: number;
    add: (productId: string) => void;
    remove: (productId: string) => void;
    clear: () => void;
};
