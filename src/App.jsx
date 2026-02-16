import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ConstructionBanner } from './components/layout/ConstructionBanner';
import { Home } from './pages/Home';
import { ForCompanies } from './pages/ForCompanies';


import { ForCandidates } from './pages/ForCandidates';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Auth } from './pages/Auth';
import ScrollToTop from './components/utils/ScrollToTop';
import { supabase } from './lib/supabaseClient';

// Helper component to handle auth redirects
const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Only redirect if on public pages like Home or Auth
        if (location.pathname === '/' || location.pathname === '/auth') {
          const role = session?.user?.user_metadata?.role;
          if (role === 'employer') {
            navigate('/companies');
          } else {
            navigate('/candidates');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  return null;
};

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('construction_banner_dismissed');
    if (!isDismissed) {
      setShowBanner(true);
    }
  }, []);

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('construction_banner_dismissed', 'true');
  };

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Setup Required</h1>
        <p className="max-w-md text-gray-700 mb-8">
          The Supabase credentials are missing from the Vercel Environment Variables.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md text-left w-full max-w-lg">
          <p className="font-bold mb-2">Please add these to Vercel Settings:</p>
          <code className="block bg-gray-100 p-2 rounded mb-2 text-sm text-red-500">
            VITE_SUPABASE_URL
          </code>
          <code className="block bg-gray-100 p-2 rounded mb-2 text-sm text-red-500">
            VITE_SUPABASE_ANON_KEY
          </code>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <AuthRedirectHandler />
      <div className="min-h-screen flex flex-col font-sans text-text-main bg-surface-muted">
        {showBanner && <ConstructionBanner onClose={handleDismissBanner} />}

        {/* Pass down style to Navbar to adjust top position if banner is visible */}
        <Navbar style={{ top: showBanner ? '48px' : '0' }} />

        <main className={`flex-grow ${showBanner ? 'pt-[48px]' : 'pt-0'} transition-all duration-300`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/companies" element={<ForCompanies />} />
            <Route path="/candidates" element={<ForCandidates />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
