import { Link } from "wouter";
import { HomeIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <HomeIcon className="h-6 w-6 text-primary-500" />
              <span className="font-bold text-xl">RoomRevive</span>
            </div>
            <p className="mb-4">
              Transform your space with AI-powered interior design. Upload, select a style, and get beautiful redesigns instantly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="ri-facebook-circle-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="ri-pinterest-line text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works">
                  <a className="hover:text-white transition">How It Works</a>
                </Link>
              </li>
              <li>
                <Link href="/#pricing">
                  <a className="hover:text-white transition">Pricing</a>
                </Link>
              </li>
              <li>
                <Link href="/#styles">
                  <a className="hover:text-white transition">Design Styles</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">FAQs</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">GDPR Compliance</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} RoomRevive. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
