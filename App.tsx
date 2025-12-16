import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { UserSession, ProductType, DraggableItem, CartItem, CheckoutDetails } from './types';
import { Button } from './components/Button';
import { getGeminiStyleAdvice } from './services/geminiService';
import { ShirtIcon, TieIcon, KeychainIcon } from './components/Icons';
import { Heart, ShoppingBag, Wand2, ArrowRight, User, CheckCircle, GripHorizontal, Sparkles, Mail, Lock, Star, Plus, X, Trash2, Receipt as ReceiptIcon, LogIn, LogOut, Settings, Phone, MapPin, QrCode, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

// --- Utility: Currency Formatter ---
const formatIDR = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

// --- Utility: Random Sweet Notes ---
const getSweetNote = () => {
  const notes = [
    "Adorable-nesss is now yours!",
    "Stay adoreable^^",
    "XOXO",
    "You look lovely with this!",
    "Sending you huge hugs!",
    "Have a-dorable day!"
  ];
  return notes[Math.floor(Math.random() * notes.length)];
};

// --- Shared Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <img 
    src="https://ibb.co.com/HprqQ2pT" 
    alt="ADOREMY" 
    className={`h-12 object-contain filter drop-shadow-sm ${className}`} 
  />
);

// --- Navbar Component ---
const Navbar = ({ 
  session, 
  cartCount, 
  onOpenCart, 
  onOpenStudio, 
  onOpenProfile, 
  onLogout 
}: { 
  session: UserSession, 
  cartCount: number, 
  onOpenCart: () => void, 
  onOpenStudio: () => void,
  onOpenProfile: () => void,
  onLogout: () => void
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isApp = location.pathname === '/app';
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-adore-pink/30 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div onClick={() => navigate(session.isLoggedIn ? '/app' : '/')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <Logo />
          </div>
          
          {/* Custom Button (Only visible in App mode) */}
          {session.isLoggedIn && isApp && (
             <button 
               onClick={onOpenStudio}
               className="hidden md:flex items-center gap-2 px-6 py-2 bg-adore-mint/30 hover:bg-adore-mint text-adore-mintDark font-bold rounded-full transition-all hover:scale-105"
             >
               <Plus size={18} />
               <span>Create Custom</span>
             </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {session.isLoggedIn ? (
            <>
              {/* Cart Trigger */}
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-adore-slate hover:text-adore-pinkDark transition-colors group"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-adore-pinkDark text-white text-xs font-bold flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity"
                >
                  <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hello</p>
                    <p className="font-bold text-adore-slate leading-none">{session.username}</p>
                  </div>
                  <div className="w-10 h-10 bg-adore-pink rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                     {session.avatar ? (
                        <img src={session.avatar} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <User size={20} className="text-adore-pinkDark" />
                     )}
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 animate-fade-in-up p-2">
                       <button 
                         onClick={() => { setIsProfileMenuOpen(false); onOpenProfile(); }}
                         className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-xl text-adore-slate text-sm font-bold transition-colors"
                       >
                         <Settings size={16} /> Edit Profile
                       </button>
                       <button 
                         onClick={() => { setIsProfileMenuOpen(false); onLogout(); }}
                         className="flex items-center gap-2 w-full p-2 hover:bg-red-50 text-red-400 rounded-xl text-sm font-bold transition-colors"
                       >
                         <LogOut size={16} /> Logout
                       </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-4">
               <button 
                 onClick={() => navigate('/login')} 
                 className="hidden md:flex items-center gap-2 px-6 py-2 bg-white border-2 border-adore-slate/10 rounded-full text-adore-slate font-bold hover:border-adore-pink hover:text-adore-pinkDark transition-all"
               >
                 Log In
               </button>
               <Button onClick={() => navigate('/login')} className="shadow-lg shadow-adore-pink/20 rounded-full px-8">
                 Sign Up
               </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Footer Component ---
const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-display font-bold text-adore-slate text-lg mb-6">Resources</h4>
          <ul className="space-y-4 text-gray-500 font-medium text-sm">
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Design Inspiration</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Pastel Trends</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Fabric Care</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Bulk Orders</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-adore-slate text-lg mb-6">Help</h4>
          <ul className="space-y-4 text-gray-500 font-medium text-sm">
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Get Help</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Payment Options</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-adore-slate text-lg mb-6">Company</h4>
          <ul className="space-y-4 text-gray-500 font-medium text-sm">
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">About ADOREMY</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">News</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-adore-pinkDark transition-colors">Partners</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-adore-slate text-lg mb-6">Follow Us</h4>
          <div className="flex gap-4">
             <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-adore-pink hover:text-adore-pinkDark transition-all"><Instagram size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-adore-pink hover:text-adore-pinkDark transition-all"><Twitter size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-adore-pink hover:text-adore-pinkDark transition-all"><Facebook size={20}/></a>
             <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-adore-pink hover:text-adore-pinkDark transition-all"><Youtube size={20}/></a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <Logo className="h-8" />
        <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
           <a href="#" className="hover:text-adore-pinkDark">Privacy Policy</a>
           <a href="#" className="hover:text-adore-pinkDark">Terms of Sale</a>
           <a href="#" className="hover:text-adore-pinkDark">Settings</a>
        </div>
        <p className="text-gray-400 text-xs font-bold">© 2025 ADOREMY. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

// --- Landing Page ---
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-adore-pink selection:text-adore-pinkDark flex flex-col">
      <Navbar 
        session={{ isLoggedIn: false, username: '', email: '' }} 
        cartCount={0} 
        onOpenCart={() => {}} 
        onOpenStudio={() => {}} 
        onOpenProfile={() => {}}
        onLogout={() => {}}
      />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-b from-adore-mint/10 via-white to-adore-pink/10">
        
        {/* Floating Decor */}
        <div className="absolute top-20 left-[5%] w-32 h-32 text-6xl animate-float opacity-60 pointer-events-none">☁️</div>
        <div className="absolute bottom-40 right-[10%] w-32 h-32 text-6xl animate-float opacity-60 pointer-events-none" style={{animationDelay: '2s'}}>🎀</div>

        <div className="text-center z-10 max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full text-adore-pinkDark font-bold mb-8 shadow-sm border border-white hover:scale-105 transition-transform cursor-default">
            <Sparkles size={16} />
            <span className="text-sm tracking-wide uppercase">Your Pastel Fashion Studio</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-adore-slate leading-[1.1] mb-8 tracking-tight">
            Design Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-adore-pinkDark to-adore-peachDark">Pastel Dreams</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-adore-slate/80 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
            Create custom shirts, ties, and keychains that match your aesthetic. 
            Simple, adorable, and uniquely yours.
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => navigate('/login')} className="text-lg px-12 py-4 shadow-xl shadow-adore-pink/30 hover:shadow-adore-pink/50 flex items-center gap-2">
              Start Creating <ArrowRight size={20} />
            </Button>
            <button onClick={() => document.getElementById('explore')?.scrollIntoView({behavior: 'smooth'})} className="text-adore-slate font-bold px-8 py-4 hover:bg-white/50 rounded-full transition-all">
              See Products
            </button>
          </div>
        </div>

        {/* Hero Cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 z-10">
           {/* Card 1 */}
           <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="h-40 bg-adore-mint/20 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-adore-mint/40 transition-colors">
                <ShirtIcon className="w-24 h-24 text-adore-mintDark drop-shadow-sm transform group-hover:scale-110 transition-transform" color="currentColor" />
              </div>
              <h3 className="font-display font-bold text-2xl text-adore-slate">Cute Shirts</h3>
              <p className="text-gray-500 mt-2">Comfortable fits with your custom palette.</p>
           </div>
           
           {/* Card 2 */}
           <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 md:-mt-12 group">
              <div className="h-40 bg-adore-pink/20 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-adore-pink/40 transition-colors">
                <TieIcon className="w-24 h-24 text-adore-pinkDark drop-shadow-sm transform group-hover:scale-110 transition-transform" color="currentColor" />
              </div>
              <h3 className="font-display font-bold text-2xl text-adore-slate">Cool Ties</h3>
              <p className="text-gray-500 mt-2">Professional yet adorable. Stand out softly.</p>
           </div>

           {/* Card 3 */}
           <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="h-40 bg-adore-cream/50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-adore-cream transition-colors">
                <KeychainIcon className="w-24 h-24 text-adore-creamDark drop-shadow-sm transform group-hover:scale-110 transition-transform" color="currentColor" />
              </div>
              <h3 className="font-display font-bold text-2xl text-adore-slate">Tiny Charms</h3>
              <p className="text-gray-500 mt-2">Accessorize your bags with custom keychains.</p>
           </div>
        </div>
      </header>

      {/* Explore Section */}
      <section id="explore" className="py-24 px-4 bg-white relative flex-grow">
         <div className="max-w-6xl mx-auto">
            {/* About & Contact Info */}
            <div className="bg-adore-slate rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-adore-pink/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                 <div>
                   <h3 className="text-3xl font-display font-bold mb-6 flex items-center gap-3"><Sparkles/> About ADOREMY</h3>
                   <p className="text-gray-200 text-lg leading-relaxed mb-6">
                     Welcome to ADOREMY, a space built to celebrate the joy of self-expression. Created independently to spark your creativity, 
                     this platform lets you mix, match, and customize high-quality fashion items with a kawaii twist. 
                     Here, fashion isn't just about what you wear; it's about the fun of creating it yourself.
                   </p>
                   <div className="flex gap-4">
                     <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10">Eco-Friendly</span>
                     <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10">Handmade</span>
                   </div>
                 </div>
                 <div>
                   <h3 className="text-3xl font-display font-bold mb-6 flex items-center gap-3"><Mail/> Contact Us</h3>
                   <p className="text-gray-300 mb-6">Have a question? We'd love to hear from you!</p>
                   <ul className="space-y-4 text-gray-200 font-medium">
                     <li className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
                       <Mail size={20} className="text-adore-pink" /> 
                       hello@adoremystudio.com
                     </li>
                     <li className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
                       <Star size={20} className="text-adore-pink" /> 
                       @adoremystudio
                     </li>
                   </ul>
                 </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Login Page ---
const LoginPage = ({ setSession }: { setSession: (s: UserSession) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setTimeout(() => {
        setSession({ username: name, email: email || 'user@example.com', isLoggedIn: true });
        navigate('/app');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative px-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-adore-mint/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-adore-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-lg border border-white relative z-10 animate-fade-in-up">
        
        <button 
           onClick={() => navigate('/')} 
           className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-10">
           <div className="inline-block p-4 bg-white rounded-[2rem] shadow-sm mb-6 border border-gray-50">
             <Logo className="scale-75 origin-center" />
           </div>
          <h2 className="text-3xl font-display font-black text-adore-slate mb-3">
            {isSignUp ? "Join the Club" : "Welcome, dear!"}
          </h2>
          <p className="text-gray-500 font-medium">
            {isSignUp ? "Create your pastel profile!" : "Ready to be adorable?"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">
              {isSignUp ? "Choose a Username" : "Username"}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User className="text-gray-300 group-focus-within:text-adore-pinkDark transition-colors" size={20} />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-bold placeholder-gray-300"
                placeholder="e.g. MoonChild"
                required
              />
            </div>
          </div>
          
          <div className="animate-fade-in-up">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Email Address</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="text-gray-300 group-focus-within:text-adore-pinkDark transition-colors" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-bold placeholder-gray-300"
                    placeholder="hello@adoremy.com"
                  />
               </div>
          </div>

           <div className="relative">
              <label htmlFor="pass" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Password</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="text-gray-300 group-focus-within:text-adore-pinkDark transition-colors" size={20} />
                  </div>
                  <input
                    type="password"
                    id="pass"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-bold placeholder-gray-300"
                    placeholder="••••••••"
                  />
               </div>
            </div>

          <Button type="submit" fullWidth disabled={!name.trim()} className="mt-6 py-4 text-lg shadow-xl shadow-adore-pink/20 hover:shadow-adore-pink/40">
            {isSignUp ? "Sign Up Free" : "Log In"}
          </Button>
        </form>

        <div className="mt-8 text-center bg-gray-50/50 p-4 rounded-2xl">
          <p className="text-gray-500 font-medium text-sm">
            {isSignUp ? "Already a member?" : "New here?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-bold text-adore-pinkDark hover:text-adore-peachDark transition-colors ml-1 underline decoration-dashed underline-offset-4"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard (New View) ---
const Dashboard = ({ onOpenStudio, onAddToCart }: { onOpenStudio: () => void, onAddToCart: (item: CartItem) => void }) => {
  const products = [
    { id: 1, name: "Minty Fresh Tee", price: 150000, type: ProductType.SHIRT, color: "#e0f7fa", icon: ShirtIcon },
    { id: 2, name: "Business Pink", price: 75000, type: ProductType.TIE, color: "#fce4ec", icon: TieIcon },
    { id: 3, name: "Sunny Charm", price: 35000, type: ProductType.KEYCHAIN, color: "#fffde7", icon: KeychainIcon },
    { id: 4, name: "Lilac Dreams", price: 150000, type: ProductType.SHIRT, color: "#f3e5f5", icon: ShirtIcon },
    { id: 5, name: "Peachy Day", price: 150000, type: ProductType.SHIRT, color: "#fff3e0", icon: ShirtIcon },
    { id: 6, name: "Sky High", price: 75000, type: ProductType.TIE, color: "#e3f2fd", icon: TieIcon },
  ];

  const handleQuickAdd = (p: any) => {
    onAddToCart({
      id: Date.now().toString(),
      product: p.type,
      baseColor: p.color,
      items: [],
      price: p.price,
      timestamp: Date.now()
    });
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-display font-black text-adore-slate mb-4">Latest Drops</h2>
        <p className="text-gray-400 font-medium">Get inspired by our pastel collection or create your own.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Create Your Own Card */}
        <div 
          onClick={onOpenStudio}
          className="col-span-1 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-adore-pink to-adore-peach rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center text-adore-slate relative overflow-hidden group border-4 border-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md group-hover:scale-110 transition-transform duration-500">
               <Sparkles className="text-adore-pinkDark" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Custom Studio</h3>
            <p className="mb-6 text-sm font-semibold opacity-70">Design it exactly how you want it.</p>
            <div className="px-6 py-2 bg-white rounded-full font-bold text-adore-pinkDark text-sm inline-flex items-center gap-2">
              Start Designing <ArrowRight size={14}/>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        {products.map((p) => (
          <div 
            key={p.id} 
            onClick={() => handleQuickAdd(p)}
            className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-adore-pink/30 transition-all hover:-translate-y-1 group cursor-pointer"
          >
            <div className="h-64 rounded-[2rem] mb-6 flex items-center justify-center relative overflow-hidden" style={{backgroundColor: p.color}}>
              <p.icon className="w-32 h-32 drop-shadow-md group-hover:scale-110 transition-transform duration-500 text-adore-slate/50" color="currentColor" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                {p.type}
              </div>
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white text-adore-slate font-bold px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
                  <ShoppingBag size={14}/> Quick Add
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="font-display font-bold text-lg text-adore-slate">{p.name}</h3>
                <p className="text-gray-400 text-sm font-medium">In Stock</p>
              </div>
              <span className="font-display font-bold text-adore-pinkDark bg-adore-pink/20 px-4 py-2 rounded-xl text-sm">
                {formatIDR(p.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Studio Component (Overlay) ---
const Studio = ({ session, onClose, onAddToCart }: { session: UserSession, onClose: () => void, onAddToCart: (item: CartItem) => void }) => {
  const [product, setProduct] = useState<ProductType>(ProductType.SHIRT);
  const [baseColor, setBaseColor] = useState<string>('#fce4ec'); 
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getBasePrice = (type: ProductType) => {
    switch(type) {
      case ProductType.SHIRT: return 150000;
      case ProductType.TIE: return 75000;
      case ProductType.KEYCHAIN: return 35000;
      default: return 100000;
    }
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    const suggestion = await getGeminiStyleAdvice(session.username, product);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDragId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setItems(prev => prev.map(item => item.id === dragId ? { ...item, x, y } : item));
  };

  const addItem = (content: string, type: 'sticker' | 'text') => {
    const newItem: DraggableItem = {
      id: Date.now().toString(),
      type,
      content,
      x: 200, 
      y: 200,
      scale: 1,
    };
    setItems([...items, newItem]);
  };

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      product,
      baseColor,
      items,
      price: getBasePrice(product),
      timestamp: Date.now()
    };
    onAddToCart(newItem);
    onClose();
  };

  const colors = [
    { name: 'Mint', hex: '#e0f7fa' },
    { name: 'Cream', hex: '#fffde7' },
    { name: 'Peach', hex: '#fff3e0' },
    { name: 'Pink', hex: '#fce4ec' },
    { name: 'Lilac', hex: '#f3e5f5' },
    { name: 'White', hex: '#ffffff' },
  ];

  const stickers = ['🌸', '🎀', '⭐', '🐱', '💖', '🍓', '🥑', '✨', '🍄', '☁️', '🐰', '🍒', '🍭', '🦄', '🌵', '🎵'];

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col md:flex-row animate-fade-in-up overflow-hidden">
      
      {/* Top Mobile Nav */}
      <div className="md:hidden p-4 flex justify-between items-center border-b border-gray-100">
        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs">Studio Mode</span>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
      </div>

      {/* LEFT: Controls */}
      <div className="w-full md:w-80 bg-white border-r border-gray-100 p-6 overflow-y-auto h-full shadow-[4px_0_40px_rgba(0,0,0,0.02)] z-10">
        <div className="hidden md:flex items-center gap-2 mb-8 text-gray-300 hover:text-gray-500 cursor-pointer" onClick={onClose}>
          <ArrowRight className="rotate-180" size={20} />
          <span className="font-bold text-sm uppercase tracking-wide">Back to Shop</span>
        </div>

        <div className="mb-8">
           <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-adore-pink text-adore-pinkDark flex items-center justify-center text-xs">1</span>
             Pick Base
           </h3>
           <div className="grid grid-cols-3 gap-3">
            {[ProductType.SHIRT, ProductType.TIE, ProductType.KEYCHAIN].map((p) => (
              <button
                key={p}
                onClick={() => { setProduct(p); setItems([]); }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${product === p ? 'bg-adore-pink text-adore-pinkDark shadow-inner' : 'bg-gray-50 hover:bg-gray-100 text-gray-400'}`}
              >
                <div className="transform scale-75 mb-1">
                  {p === ProductType.SHIRT && <ShirtIcon className="w-8 h-8" color="currentColor" />}
                  {p === ProductType.TIE && <TieIcon className="w-8 h-8" color="currentColor" />}
                  {p === ProductType.KEYCHAIN && <KeychainIcon className="w-8 h-8" color="currentColor" />}
                </div>
                <span className="text-[10px] font-bold uppercase">{p}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-adore-cream text-adore-creamDark flex items-center justify-center text-xs">2</span>
            Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setBaseColor(c.hex)}
                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${baseColor === c.hex ? 'border-gray-400 scale-110' : 'border-gray-100'}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-adore-mint text-adore-mintDark flex items-center justify-center text-xs">3</span>
             Decorate
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => addItem(sticker, 'sticker')}
                className="text-2xl p-2 bg-gray-50 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90 border border-transparent hover:border-gray-100"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER: Canvas */}
      <div 
        className="flex-1 bg-gray-50/50 relative flex items-center justify-center overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragId(null)}
        onMouseLeave={() => setDragId(null)}
      >
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ab47bc 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        {/* Helper UI */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-20">
           <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-400 flex items-center gap-2">
             <GripHorizontal size={14}/> Drag stickers to position
           </div>
        </div>

        <div 
          ref={canvasRef}
          className="relative w-[400px] h-[500px] flex items-center justify-center"
        >
          {/* Base */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-2xl filter saturate-[1.05]">
             {product === ProductType.SHIRT && <ShirtIcon className="w-full h-full" color={baseColor} />}
             {product === ProductType.TIE && <TieIcon className="w-2/3 h-full" color={baseColor} />}
             {product === ProductType.KEYCHAIN && <KeychainIcon className="w-2/3 h-2/3" color={baseColor} />}
          </div>

          {/* Items */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  transform: 'translate(-50%, -50%)',
                  cursor: dragId === item.id ? 'grabbing' : 'grab',
                }}
                className="select-none text-5xl hover:scale-110 transition-transform drop-shadow-sm filter hover:brightness-110"
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
        
        {items.length > 0 && (
          <button 
             onClick={() => setItems([])}
             className="absolute bottom-6 right-6 p-3 bg-white text-red-400 rounded-full shadow-lg hover:bg-red-50 transition-colors z-20"
             title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* RIGHT: Action & AI */}
      <div className="w-full md:w-80 bg-white border-l border-gray-100 p-6 flex flex-col z-10 shadow-[-4px_0_40px_rgba(0,0,0,0.02)]">
        <div className="mb-auto">
          <div className="bg-gradient-to-br from-adore-pink/10 to-adore-lilac/10 p-6 rounded-3xl mb-6 relative overflow-hidden border border-adore-pink/20">
            <h3 className="font-display font-bold text-adore-pinkDark flex items-center gap-2 mb-3">
              <Wand2 size={18} /> AI Stylist
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed font-medium">
              Stuck? Let our kawaii AI suggest a vibe!
            </p>
            {aiSuggestion && (
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl text-sm italic text-adore-slate mb-4 border border-white shadow-sm">
                "{aiSuggestion}"
              </div>
            )}
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={handleAskAI}
              disabled={isAiLoading}
              className="text-xs py-3 font-bold uppercase tracking-wide shadow-none hover:shadow-md bg-white text-adore-slate border border-gray-100 hover:bg-gray-50"
            >
              {isAiLoading ? 'Thinking...' : 'Inspire Me ✨'}
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">Price</span>
            <span className="text-3xl font-display font-black text-adore-slate">{formatIDR(getBasePrice(product))}</span>
          </div>
          <Button fullWidth onClick={handleAddToCart} className="py-4 text-lg shadow-xl shadow-adore-pink/20 hover:shadow-adore-pink/40 rounded-2xl">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Cart Drawer ---
const CartDrawer = ({ 
  items, 
  isOpen, 
  onClose, 
  onRemove, 
  onCheckout 
}: { 
  items: CartItem[], 
  isOpen: boolean, 
  onClose: () => void, 
  onRemove: (id: string) => void,
  onCheckout: () => void 
}) => {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <div className="fixed inset-0 bg-adore-slate/20 backdrop-blur-sm z-[70]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col animate-fade-in-up md:animate-none md:transition-transform">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-display font-black text-adore-slate flex items-center gap-2">
            <ShoppingBag className="text-adore-pinkDark" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                 <ShoppingBag size={40} className="opacity-20" />
               </div>
               <p className="font-medium">Your cart is empty.</p>
               <p className="text-sm max-w-xs">Looks like you haven't added any cuteness yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-3xl border border-gray-100 bg-white hover:shadow-md transition-shadow relative group">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{backgroundColor: item.baseColor + '40'}}>
                     {item.product === ProductType.SHIRT && <ShirtIcon className="w-12 h-12" color={item.baseColor} />}
                     {item.product === ProductType.TIE && <TieIcon className="w-12 h-12" color={item.baseColor} />}
                     {item.product === ProductType.KEYCHAIN && <KeychainIcon className="w-12 h-12" color={item.baseColor} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-adore-slate truncate pr-4">Custom {item.product}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Color: {item.baseColor}</p>
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {item.items.slice(0, 3).map((decor, i) => (
                        <span key={i} className="text-xs bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{decor.content}</span>
                      ))}
                      {item.items.length > 3 && <span className="text-xs text-gray-400 flex items-center">+{item.items.length - 3}</span>}
                    </div>
                    <p className="text-adore-pinkDark font-bold mt-2 text-right">{formatIDR(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
           <div className="flex justify-between items-center mb-6">
             <span className="text-gray-500 font-bold">Total</span>
             <span className="text-3xl font-display font-black text-adore-slate">{formatIDR(total)}</span>
           </div>
           <Button fullWidth onClick={onCheckout} disabled={items.length === 0} className="py-4 text-lg shadow-xl shadow-adore-pink/20 hover:shadow-adore-pink/40 rounded-2xl">
             Proceed to Checkout
           </Button>
        </div>
      </div>
    </>
  );
};

// --- Checkout Modal (Address & Phone) ---
const CheckoutModal = ({ isOpen, onClose, onPayment, initialDetails }: { isOpen: boolean, onClose: () => void, onPayment: (details: CheckoutDetails) => void, initialDetails?: CheckoutDetails }) => {
  if (!isOpen) return null;

  const [address, setAddress] = useState(initialDetails?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(initialDetails?.phoneNumber || '');
  const [notes, setNotes] = useState(initialDetails?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment({ address, phoneNumber, notes });
  };

  return (
    <div className="fixed inset-0 bg-adore-slate/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden relative border border-white">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <h2 className="text-2xl font-display font-black text-adore-slate flex items-center gap-2">
            <MapPin className="text-adore-pinkDark" /> Shipping Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Full Address</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-medium resize-none h-32"
              placeholder="Street, City, Zip Code..."
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Phone Number</label>
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Phone className="text-gray-300 group-focus-within:text-adore-pinkDark transition-colors" size={20} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-bold placeholder-gray-300"
                  placeholder="+62 812 3456 7890"
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Order Notes (Optional)</label>
            <input 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-adore-pink focus:ring-4 focus:ring-adore-pink/10 outline-none transition-all bg-gray-50/50 text-gray-700 font-medium"
              placeholder="Any special requests?"
            />
          </div>

          <div className="pt-4">
             <Button type="submit" fullWidth className="py-4 text-lg shadow-xl shadow-adore-mint/20 bg-adore-mintDark hover:bg-adore-mintDark/90">
               Proceed to Payment
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- QRIS Modal ---
const QRISModal = ({ isOpen, onClose, onConfirm, amount }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, amount: number }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-adore-slate/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl animate-fade-in-up overflow-hidden relative flex flex-col items-center p-8 text-center">
         <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
           <X className="text-gray-300 hover:text-gray-500"/>
         </div>

         <h2 className="text-xl font-display font-black text-adore-slate mb-1">Scan to Pay</h2>
         <p className="text-gray-400 text-sm mb-6">Use your favorite e-wallet to scan QRIS</p>

         <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-inner mb-6 relative group">
            {/* Mock QRIS Pattern */}
            <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-2 border-4 border-white rounded-md"></div>
               <div className="absolute top-2 left-2 w-10 h-10 border-4 border-white bg-gray-900 z-10"></div>
               <div className="absolute top-2 right-2 w-10 h-10 border-4 border-white bg-gray-900 z-10"></div>
               <div className="absolute bottom-2 left-2 w-10 h-10 border-4 border-white bg-gray-900 z-10"></div>
               <QrCode size={80} className="text-white relative z-20"/>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
               <span className="font-bold text-adore-slate">ADOREMY STORE</span>
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" className="h-6 object-contain" />
            </div>
         </div>

         <div className="mb-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-3xl font-display font-black text-adore-pinkDark">{formatIDR(amount)}</p>
         </div>

         <Button onClick={onConfirm} fullWidth className="py-3 bg-adore-slate hover:bg-gray-800 shadow-xl">
           I Have Paid
         </Button>
      </div>
    </div>
  );
};

// --- Receipt Modal ---
const ReceiptModal = ({ isOpen, onClose, items, note, details }: { isOpen: boolean, onClose: () => void, items: CartItem[], note: string, details?: CheckoutDetails }) => {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="fixed inset-0 bg-adore-slate/40 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-fade-in-up overflow-hidden relative">
        {/* Receipt Header Style */}
        <div className="bg-adore-slate p-8 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
             <ReceiptIcon size={32} />
           </div>
           <h2 className="text-2xl font-display font-bold">Payment Successful!</h2>
           <p className="text-white/60 text-sm mt-1">Order #ADR-{Math.floor(Math.random() * 10000)}</p>
        </div>
        
        {/* Zig Zag Separator */}
        <div className="h-4 bg-adore-slate relative">
          <div className="absolute top-0 w-full h-4 bg-white" style={{clipPath: 'polygon(0 100%, 2% 0, 4% 100%, 6% 0, 8% 100%, 10% 0, 12% 100%, 14% 0, 16% 100%, 18% 0, 20% 100%, 22% 0, 24% 100%, 26% 0, 28% 100%, 30% 0, 32% 100%, 34% 0, 36% 100%, 38% 0, 40% 100%, 42% 0, 44% 100%, 46% 0, 48% 100%, 50% 0, 52% 100%, 54% 0, 56% 100%, 58% 0, 60% 100%, 62% 0, 64% 100%, 66% 0, 68% 100%, 70% 0, 72% 100%, 74% 0, 76% 100%, 78% 0, 80% 100%, 82% 0, 84% 100%, 86% 0, 88% 100%, 90% 0, 92% 100%, 94% 0, 96% 100%, 98% 0, 100% 100%)'}}></div>
        </div>

        <div className="p-8">
           <div className="text-center mb-8">
             <h3 className="font-handwriting text-2xl font-bold text-adore-pinkDark mb-2 rotate-2">"{note}"</h3>
             <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">A sweet note for you</p>
           </div>

           <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm">
             <p className="font-bold text-adore-slate mb-1">Shipping to:</p>
             <p className="text-gray-500">{details?.address}</p>
             <p className="text-gray-500 mt-1"><span className="font-bold">Phone:</span> {details?.phoneNumber}</p>
           </div>

           <div className="space-y-3 mb-8 border-t border-dashed border-gray-200 pt-6">
             <div className="flex justify-between text-gray-500 font-medium">
               <span>Total Items</span>
               <span>{items.length}</span>
             </div>
             <div className="flex justify-between text-2xl font-bold text-adore-slate">
               <span>Total Paid</span>
               <span>{formatIDR(total)}</span>
             </div>
           </div>

           <Button onClick={onClose} fullWidth className="py-4 shadow-lg shadow-green-100 bg-green-500 hover:bg-green-600">
             Back to Home
           </Button>
        </div>
      </div>
    </div>
  );
};

// --- Profile Modal ---
const ProfileModal = ({ isOpen, onClose, session, onUpdate }: { isOpen: boolean, onClose: () => void, session: UserSession, onUpdate: (s: UserSession) => void }) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState(session.username);
  const [email, setEmail] = useState(session.email);
  const [phone, setPhone] = useState(session.phoneNumber || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...session, username, email, phoneNumber: phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-adore-slate/20 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-fade-in-up p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        
        <h2 className="text-2xl font-display font-black text-adore-slate mb-6 flex items-center gap-2">
          <Settings className="text-adore-pinkDark" /> Edit Profile
        </h2>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-adore-pink border-4 border-white shadow-md flex items-center justify-center relative group cursor-pointer overflow-hidden">
             {session.avatar ? (
                 <img src={session.avatar} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                 <User size={40} className="text-adore-pinkDark" />
             )}
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Change</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Username</label>
             <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-adore-pink outline-none bg-gray-50"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Email</label>
             <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-adore-pink outline-none bg-gray-50"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Phone</label>
             <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-adore-pink outline-none bg-gray-50"/>
           </div>
           
           <div className="pt-4">
             <Button type="submit" fullWidth className="shadow-lg shadow-adore-pink/20">Save Changes</Button>
           </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App Layout ---
const MainAppLayout = ({ 
  session, 
  cart, 
  onOpenCart, 
  onOpenStudio,
  onOpenProfile,
  onLogout
}: { 
  session: UserSession, 
  cart: CartItem[], 
  onOpenCart: () => void, 
  onOpenStudio: () => void,
  onOpenProfile: () => void,
  onLogout: () => void
}) => {
  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Wrapper to inject props into Dashboard
  const DashboardWithProps = () => (
    <Dashboard onOpenStudio={onOpenStudio} onAddToCart={(item) => cart.push(item) /* Note: cart.push is bad react, but this is fixed by parent state update in App component logic passed down, wait. The App component manages state. MainAppLayout receives cart but needs to pass add function. */} />
  );
  // Correct way: The App component passes `addToCart` to `MainAppLayout`, which passes it to `Dashboard`.
  // Wait, `MainAppLayout` in `App` component definition:
  /*
  <MainAppLayout 
    session={session} 
    cart={cart}
    onOpenCart={() => setIsCartOpen(true)}
    onOpenStudio={() => setIsStudioOpen(true)}
    onOpenProfile={() => setIsProfileOpen(true)}
    onLogout={handleLogout}
  />
  */
  // I need to update MainAppLayout props to include `onAddToCart` or pass it down. 
  // Actually, MainAppLayout renders <Navbar> and <Dashboard>.
  // I will modify MainAppLayout to accept onAddToCart.

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans flex flex-col">
      <Navbar 
        session={session} 
        cartCount={cart.length} 
        onOpenCart={onOpenCart} 
        onOpenStudio={onOpenStudio} 
        onOpenProfile={onOpenProfile}
        onLogout={onLogout}
      />
      {/* We need to pass the addToCart function here, but it's not in props. 
          I will change MainAppLayout signature below to include it.
          For now, I'll assume it's passed or I will fix the App component to pass it.
      */}
      {/* Since I can't easily change the prop signature in the middle of this block without context of App component calling it, 
          I will fix it in the App component return statement. 
      */}
      {/* BUT wait, MainAppLayout calls <Dashboard />. Dashboard NOW requires props. 
          So MainAppLayout MUST receive them.
      */}
      <div className="flex-grow">
          {/* Placeholder, will be replaced by actual Dashboard in the App component's route or passed as children? 
              In the previous code, MainAppLayout rendered <Dashboard /> directly.
              I will change MainAppLayout to take `children` or `dashboardProps`.
              Actually, easier: modify MainAppLayout to take `onAddToCart`.
          */}
      </div>
       <Footer />
    </div>
  );
};

// --- Root Component ---
const App = () => {
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('adoremy_user');
    return saved ? JSON.parse(saved) : { username: '', email: '', isLoggedIn: false };
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Data States
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | undefined>(undefined);
  const [receiptNote, setReceiptNote] = useState("");
  const [receiptItems, setReceiptItems] = useState<CartItem[]>([]);

  useEffect(() => {
    localStorage.setItem('adoremy_user', JSON.stringify(session));
  }, [session]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
    setIsStudioOpen(false); 
    setIsCartOpen(true); 
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleStartCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentInfo = (details: CheckoutDetails) => {
    setCheckoutDetails(details);
    setIsCheckoutOpen(false);
    setIsQRISOpen(true);
  };

  const handlePaymentConfirm = () => {
    setIsQRISOpen(false);
    setReceiptItems([...cart]);
    setReceiptNote(getSweetNote());
    setCart([]);
    setIsReceiptOpen(true);
  };

  const handleLogout = () => {
    setSession({ username: '', email: '', isLoggedIn: false });
    localStorage.removeItem('adoremy_user');
    window.location.hash = '/'; 
  };

  const handleUpdateProfile = (newSession: UserSession) => {
    setSession(newSession);
  };

  // Modified MainAppLayout to accept addToCart and pass it to Dashboard
  const AppLayout = () => (
    <div className="min-h-screen bg-gray-50/30 font-sans flex flex-col">
      <Navbar 
        session={session} 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenStudio={() => setIsStudioOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />
      <div className="flex-grow">
        <Dashboard onOpenStudio={() => setIsStudioOpen(true)} onAddToCart={addToCart} />
      </div>
      <Footer />
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setSession={setSession} />} />
        <Route path="/app" element={
          session.isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />
        } />
      </Routes>

      {/* Global Overlays */}
      {isStudioOpen && (
        <Studio 
          session={session} 
          onClose={() => setIsStudioOpen(false)} 
          onAddToCart={addToCart} 
        />
      )}

      <CartDrawer 
        items={cart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onRemove={removeFromCart}
        onCheckout={handleStartCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onPayment={handlePaymentInfo}
        initialDetails={checkoutDetails}
      />

      <QRISModal 
        isOpen={isQRISOpen} 
        onClose={() => setIsQRISOpen(false)} 
        onConfirm={handlePaymentConfirm} 
        amount={cart.reduce((acc, item) => acc + item.price, 0)}
      />

      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        items={receiptItems}
        note={receiptNote}
        details={checkoutDetails}
      />

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        session={session}
        onUpdate={handleUpdateProfile}
      />

    </HashRouter>
  );
};

export default App;
