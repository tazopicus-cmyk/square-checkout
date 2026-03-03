'use client';

import { useState } from 'react';
import { products, Product } from '@/lib/products';

export default function Home() {
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((id) => id !== productId));
  };

  const cartTotal = cart.reduce((total, id) => {
    const product = products.find((p) => p.id === id);
    return total + (product?.price ?? 0);
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: cart }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-2xl">
              🛒
            </div>
            <h1 className="text-xl font-bold text-white">AI Agents Store</h1>
          </div>
          <button
            onClick={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg font-semibold"
          >
            Cart ({cart.length})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCart={cart.includes(product.id)}
              onAdd={() => addToCart(product.id)}
            />
          ))}
        </div>

        {/* Cart Section */}
        <div id="cart" className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="text-slate-400">Your cart is empty. Add some products!</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map((id) => {
                  const product = products.find((p) => p.id === id);
                  if (!product) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-slate-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-slate-400 text-sm">${(product.price / 100).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ${(cartTotal / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-semibold py-4 rounded-lg transition-all text-lg"
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ProductCard({
  product,
  inCart,
  onAdd,
}: {
  product: Product;
  inCart: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-amber-500 transition-all">
      <div className="text-4xl mb-4">{product.icon}</div>
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-slate-400 mb-4">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-amber-400">
          ${(product.price / 100).toFixed(2)}
        </span>
        <button
          onClick={onAdd}
          disabled={inCart}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            inCart
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-white'
          }`}
        >
          {inCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
