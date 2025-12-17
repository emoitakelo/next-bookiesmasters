import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Predictions", path: "/predictions" },
  ];

  // 🕒 Wait silently until logo loads — no "Loading..." text
  if (!logoLoaded) {
    return (
      <div className="h-20 bg-gray-900 flex items-center justify-center">
        <img
          src={logo}
          alt="Preload Logo"
          className="hidden"
          onLoad={() => setLogoLoaded(true)}
        />
      </div>
    );
  }

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        {/* 🏆 Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="BookiesMasters Logo"
            className="h-16 sm:h-18 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {/* 💻 Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-300 hover:text-white transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          className="md:hidden text-teal-400 hover:text-[#99f6e4] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* 📋 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col px-4 py-3 space-y-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
