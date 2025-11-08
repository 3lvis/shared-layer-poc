import { describe, it, expect } from 'vitest';
import { addToCart, removeFromCart, calcTotal, catalog } from '..';
describe('cart reducer pure functions', () => {
    it('adds new line when product not in cart', () => {
        const next = addToCart([], 'apl');
        expect(next).toEqual([{ productId: 'apl', qty: 1 }]);
    });
    it('increments qty when product exists', () => {
        const start = [{ productId: 'apl', qty: 1 }];
        const next = addToCart(start, 'apl');
        expect(next).toEqual([{ productId: 'apl', qty: 2 }]);
    });
    it('removes line when qty goes to zero', () => {
        const start = [{ productId: 'apl', qty: 1 }];
        const next = removeFromCart(start, 'apl');
        expect(next).toEqual([]);
    });
    it('decrements qty when above one', () => {
        const start = [{ productId: 'apl', qty: 3 }];
        const next = removeFromCart(start, 'apl');
        expect(next).toEqual([{ productId: 'apl', qty: 2 }]);
    });
    it('calculates total correctly', () => {
        const price = catalog['apl'].priceNOK;
        const cart = [{ productId: 'apl', qty: 3 }];
        expect(calcTotal(cart)).toBe(price * 3);
    });
});
