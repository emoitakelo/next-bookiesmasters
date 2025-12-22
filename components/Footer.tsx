"use client";

import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black  text-gray-400 md:justify-center px-2">
      {/* Main section */}
      <div className="max-w-3xl mx-auto py-1 grid grid-cols-1 md:grid-cols-3 gap-2 md:w-max md:mx-auto">


        {/* Brand */}
        <div className="md:text-center">
          <h5 className="text-sm font-semibold text-gray-350 ">Bookiesmasters</h5>
          <p className="text-xs leading-relaxed">
            Get guided football predictions, fixtures, odds, events, livescores and insights powered by data — all in one place.
          </p>
        </div>

        {/* Contact + Socials */}
        <div className="md:text-center">
          <h5 className="text-sm font-semibold text-gray-350">Stay connected</h5>
          <p className="text-xs text-gray-400 ">
            Have questions? Reach us anytime.
          </p>

          <a
            href="mailto:support@bookiesmasters.com"
            className="flex items-center text-[#5eead4] hover:text-teal-300 text-xs md:justify-center"
          >
            <Mail size={16} className="mr-2" /> support@bookiesmasters.com
          </a>

          <div className="flex space-x-5 mt-1 md:justify-center">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Facebook size={16} />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Twitter size={16} />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:text-center">
          <h5 className="text-sm font-semibold text-gray-350 ">Quick links</h5>
          <ul className="text-xs ">
            <li>
              <Link href="/terms-of-service" className="hover:text-teal-400 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-teal-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-teal-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-teal-400 transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center text-gray-500 text-xs py-4">
        © {new Date().getFullYear()} Bookiesmasters. All rights reserved.
      </div>
    </footer>
  );
}
