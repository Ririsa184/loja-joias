import React, { useState } from 'react';
import { ShoppingCart, User, MessageCircle, Settings, Send } from 'lucide-react';

const App = () => {
  const [cart, setCart] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const produtos = [
    { id: 1, nome: "Terço de Pérolas", preco: 89.90, categoria: "Religioso", img: "https://via.placeholder.com/150" },
    { id: 2, nome: "Brinco Folheado Ouro", preco: 120.00, categoria: "Joia", img: "https://via.placeholder.com/150" },
    { id: 3, nome: "Colar de Contas", preco: 45.00, categoria: "Bijuteria", img: "https://via.placeholder.com/150" },
  ];

  const addToCart = (p) => setCart([...cart, p]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-amber-700">Lumina Joias</h1>
        <div className="flex gap-4">
          <button className="relative"><ShoppingCart /> <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">{cart.length}</span></button>
          <button><User /></button>
          <button onClick={() => window.location.href='/admin'}><Settings size={20} /></button>
        </div>
      </nav>

      {/* Hero Section Mobile Friendly */}
      <header className="bg-amber-50 p-8 text-center">
        <h2 className="text-3xl font-light">Elegância e Fé</h2>
        <p className="text-gray-600">Encontre a peça que toca seu coração.</p>
      </header>

      {/* Catálogo */}
      <main className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {produtos.map(prod => (
          <div key={prod.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <img src={prod.img} alt={prod.nome} className="rounded-md mb-2 w-full h-40 object-cover" />
            <h3 className="font-semibold text-sm">{prod.nome}</h3>
            <p className="text-amber-600 font-bold">R$ {prod.preco.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(prod)}
              className="mt-2 bg-amber-700 text-white py-2 rounded-md text-sm active:bg-amber-800 transition shadow-md"
            >
              Adicionar
            </button>
          </div>
        ))}
      </main>

      {/* Botão WhatsApp Fluindo */}
      <a 
        href="https://wa.me/5511999999999" 
        className="fixed bottom-24 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl z-40 animate-bounce"
        target="_blank" rel="noreferrer"
      >
        <MessageCircle size={28} />
      </a>

      {/* IA Agent Chat */}
      <div className={`fixed bottom-0 right-0 m-4 w-80 bg-white shadow-2xl rounded-t-xl border transition-all ${isChatOpen ? 'h-96' : 'h-12 overflow-hidden'}`}>
        <div className="bg-amber-700 p-3 text-white flex justify-between cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
          <span>Assistente Virtual</span>
          <span>{isChatOpen ? '✕' : '▲'}</span>
        </div>
        <div className="p-4 h-64 overflow-y-auto text-sm text-gray-700">
          <p className="bg-gray-100 p-2 rounded mb-2">Olá! Sou sua guia de estilo. Como posso ajudar hoje?</p>
        </div>
        <div className="p-2 border-t flex">
          <input type="text" placeholder="Pergunte sobre um produto..." className="flex-1 text-sm outline-none" />
          <button className="text-amber-700"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default App;
