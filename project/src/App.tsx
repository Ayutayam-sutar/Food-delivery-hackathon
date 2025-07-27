import React, { useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import FloatingActionButton from './components/FloatingActionButton';
import { GuidedTour } from './components/GuidedTour';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { InventoryPage } from './pages/InventoryPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SurplusPage } from './pages/SurplusPage';
import { RequestsPage } from './pages/RequestsPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAppState } from './hooks/useAppState';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  isAuthenticated: boolean 
}> = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};


const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, actions } = useAppState();
  

  const showFloatingButton = useMemo(() => 
    ['/dashboard', '/inventory', '/suppliers', '/surplus'].includes(location.pathname),
    [location.pathname]
  );

  const handleNavigation = useCallback((path: string) => {
    // Ensure path starts with /
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    navigate(fullPath);
  }, [navigate]);

  const handleAddInventory = useCallback(() => {
    navigate('/inventory');
  }, [navigate]);

  const handlePostSurplus = useCallback(() => {
    navigate('/surplus');
  }, [navigate]);

  const handleFindSupplier = useCallback(() => {
    navigate('/suppliers');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    actions.logout();
    navigate('/');
  }, [actions, navigate]);

  return (
    <>
    <Header
        state={state}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      {children}

      {/* Floating Action Button */}
      {showFloatingButton && (
        <div className="floating-action-button">
          <FloatingActionButton
            onAddInventory={handleAddInventory}
            onPostSurplus={handlePostSurplus}
            onFindSupplier={handleFindSupplier}
          />
        </div>
      )}

      {/* Guided Tour */}
      <GuidedTour
        isVisible={state.showGuidedTour}
        onComplete={actions.completeTour}
      />
    </>
  );
};

// Navigation wrapper for pages that need navigate
const NavigationWrapper: React.FC<{ children: (navigate: (path: string) => void) => React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const handleNavigate = useCallback((path: string) => {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    navigate(fullPath);
  }, [navigate]);
  
  return <>{children(handleNavigate)}</>;
};

const APP_STYLES = `
  .App {
    scroll-behavior: smooth;
  }
  
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .parallax-element {
    will-change: transform;
    transition: transform 0.1s ease-out;
  }
  
  .btn-ripple {
    position: relative;
    overflow: hidden;
  }
  
  .btn-ripple::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .btn-ripple:active::before {
    width: 300px;
    height: 300px;
  }
  
  @keyframes ring {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(15deg); }
    20% { transform: rotate(-15deg); }
    30% { transform: rotate(15deg); }
    40% { transform: rotate(-15deg); }
    50% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
  
  .notification-bell:hover {
    animation: ring 1s ease-in-out;
  }
  
  .card-grid-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .card-grid-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-out;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
  
  .shimmer {
    background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-size: 800px 104px;
    animation: shimmer 1s linear infinite;
  }
  
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  .confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    background: #ff6b35;
    animation: confetti-fall 3s linear infinite;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #ff6b35;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #e55a2b;
  }

  .btn-ripple:focus {
    outline: 2px solid #ff6b35;
    outline-offset: 2px;
  }

  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Main App Component
function App() {
  const { state, actions } = useAppState();

  const isAuthenticated = useMemo(() => 
    state.user !== null || state.isDemo, 
    [state.user, state.isDemo]
  );

  useEffect(() => {
    const styleId = 'app-dynamic-styles';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = APP_STYLES;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, []);

  const handleExploreDemo = useCallback(() => {
    actions.enterDemo();
  }, [actions]);

  const handleLogin = useCallback((userData: any) => {
    actions.login(userData);
  }, [actions]);

  return (
    <div className="App min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Public Routes */}
         
          <Route 
            path="/" 
            element={
              <NavigationWrapper>
                {(navigate) => (
                  <LandingPage
                    onExploreDemo={handleExploreDemo}
                    onNavigate={navigate}
                  />
                )}
              </NavigationWrapper>
            } 
          />
          
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <NavigationWrapper>
                  {(navigate) => (
                    <AuthPage
                      onLogin={handleLogin}
                      onNavigate={navigate}
                    />
                  )}
                </NavigationWrapper>
              )
            } 
          />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <NavigationWrapper>
                  {(navigate) => (
                    <Dashboard
                      state={state}
                      onNavigate={navigate}
                    />
                  )}
                </NavigationWrapper>
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <InventoryPage
                  state={state}
                  onUpdateInventory={actions.updateInventory}
                />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/suppliers" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <SuppliersPage
                  state={state}
                  onAddRequest={actions.addRequest}
                />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/surplus" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <SurplusPage
                  state={state}
                />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/requests" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <RequestsPage
                  state={state}
                  onUpdateRequestStatus={actions.updateRequestStatus}
                />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/insights" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <InsightsPage
                  state={state}
                />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout>
                <NavigationWrapper>
                  {(navigate) => (
                    <ProfilePage
                      state={state}
                      onNavigate={navigate}
                    />
                  )}
                </NavigationWrapper>
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;