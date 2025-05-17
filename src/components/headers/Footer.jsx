import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Linkedin,
  Youtube,
} from "lucide-react";
import logo from "../../assets/dashboard/yoglogo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div>
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <img src={logo} alt="YOGIGURU Logo" className="w-10 h-10" />
            YOGIGURU
          </h2>
          <p className="mt-3 text-sm">
            "Born in Nepal, YOGIGURU is the first platform of its kind to offer
            flexible, personalized yoga experiences—connecting learners with
            certified instructors for online sessions, home visits, or in-person
            classes. We honor the roots of yoga while making it more accessible
            for modern lifestyles."
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", link: "#" },
              { name: "Find Instructors", link: "instructors" },
              { name: "Courses", link: "classes" },
              { name: "Blog", link: "blog" },
              { name: "Shop", link: "shop" },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="flex items-center gap-2 group overflow-hidden relative"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-2 animate-fly">
                    {item.name}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm">
            <Mail className="w-5 h-5" /> contact@yogiguru.com
          </p>
          <p className="flex items-center gap-2 text-sm mt-2">
            <Phone className="w-5 h-5" /> +977-9800000000
          </p>
          <p className="flex items-center gap-2 text-sm mt-2">
            <MapPin className="w-5 h-5" /> Kathmandu, Nepal
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} YOG-GURU. All rights reserved.
      </div>
    </footer>
  );
}
