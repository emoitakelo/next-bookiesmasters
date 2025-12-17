import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 font-semibold text-gray-400 px-3 mt-5">
      {/* Main footer section */}
      <div className="max-w-3xl mx-auto px-2 md:px-4 py-1 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-700">
        
        {/* Brand / About */}
        <div>
          <h5 className="text-sm text-white mb-1">
            Bookiesmasters
          </h5>
          <p className="text-sm   leading-relaxed">
            Get guided football predictions, fixtures,livescores and insights powered by
            data.All in one place.
          </p>
        </div>

        

        {/* Contact / Socials */}
        <div>
          <h5 className="text-sm text-white mb-1">
            Stay connected
          </h5>
          <p className="text-sm text-gray-400 mb-1">
            Have questions? Reach us anytime.
          </p>
          <a
            href="mailto:support@bookiesmasters.com"
            className="inline-flex items-center text-[#5eead4] hover:text-teal-300 text-sm mb-1"
          >
            <Mail size={18} className="mr-2 " /> support@bookiesmasters.com
          </a>

          {/* Socials (optional) */}
          <div className="flex space-x-4 mt-1">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>

 {/* Quick Links */}
        <div>
          <h5 className="text-sm text-white mb-1">
            Quick links
          </h5>
          <ul className=" text-sm">
<li>
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-teal-400 transition"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-teal-400 transition"
              >
                Privacy Policy
              </Link>
            </li>
<li>
              <Link to="/contact-us" className="text-gray-400 hover:text-teal-400 transition">
                Contact Us
              </Link>
            </li>
            

            <li>
              <Link to="/about" className="text-gray-400 hover:text-teal-400 transition ">
                About Us
              </Link>
            </li>
            
          </ul>
        </div>


      </div>

     
      {/* Bottom bar */}
      <div className="text-center text-gray-500 text-xs py-2">
        © {new Date().getFullYear()} Bookiesmasters. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
