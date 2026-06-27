import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-white">RaiseTogether</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Empowering dreams through community funding. Join us to make a difference today.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Platform</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Discover Campaigns</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Start a Campaign</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RaiseTogether. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
