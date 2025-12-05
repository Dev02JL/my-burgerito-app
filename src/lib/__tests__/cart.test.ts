import { expect, it, describe } from '@jest/globals';
import { CartItem } from '../cart';

describe('Cart Types', () => {
  it('should create a valid cart item', () => {
    const item: CartItem = {
      id: 1,
      title: 'Test Burger',
      price: 10.50,
      image: 'test.jpg',
      qty: 1,
    };

    expect(item.id).toBe(1);
    expect(item.title).toBe('Test Burger');
    expect(item.price).toBe(10.50);
    expect(item.qty).toBe(1);
  });

  it('should handle cart item with multiple quantities', () => {
    const item: CartItem = {
      id: 2,
      title: 'Another Burger',
      price: 12.90,
      image: 'test2.jpg',
      qty: 3,
    };

    expect(item.qty).toBe(3);
    expect(item.price * item.qty).toBe(38.70);
  });
});

