import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AppRouter />
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </Router>
        </NotificationProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
