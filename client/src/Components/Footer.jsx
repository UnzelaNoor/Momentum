// src/Components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="page-footer">
      <div className="container-fluid px-4 py-4">
        <div className="footer-content">
          <div className="footer-left">
            <strong className="d-block small">Momentum</strong>
            <p className="mb-0 text-muted footer-subtitle">
              © 2024 Momentum Productivity. Designed for Focus.
            </p>
          </div>
          <div className="footer-right">
            <a href="/privacy" className="footer-link">Privacy</a>
            <a href="/terms" className="footer-link">Terms</a>
            <a href="/support" className="footer-link">Support</a>
            <a href="/api" className="footer-link">API</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;