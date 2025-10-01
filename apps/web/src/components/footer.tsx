import { Link } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { CONTACT_INFO, FOOTER_CONTENT } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-transparent text-xl">
              {FOOTER_CONTENT.COMPANY.NAME}
            </h3>
            <p className="mb-4 text-gray-300 text-sm leading-relaxed">
              {FOOTER_CONTENT.COMPANY.DESCRIPTION}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                title={FOOTER_CONTENT.COMPANY.SOCIAL_LINKS.INSTAGRAM_TITLE}
                className="rounded-full bg-blue-600 p-2 transition-colors hover:bg-blue-700"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                title={FOOTER_CONTENT.COMPANY.SOCIAL_LINKS.FACEBOOK_TITLE}
                className="rounded-full bg-blue-600 p-2 transition-colors hover:bg-blue-700"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                title={FOOTER_CONTENT.COMPANY.SOCIAL_LINKS.TWITTER_TITLE}
                className="rounded-full bg-blue-600 p-2 transition-colors hover:bg-blue-700"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-lg">
              {FOOTER_CONTENT.QUICK_LINKS.TITLE}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  {FOOTER_CONTENT.QUICK_LINKS.ITEMS.HOME}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  {FOOTER_CONTENT.QUICK_LINKS.ITEMS.ABOUT}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  {FOOTER_CONTENT.QUICK_LINKS.ITEMS.SERVICES}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  {FOOTER_CONTENT.QUICK_LINKS.ITEMS.CONTACT}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-lg">
              {FOOTER_CONTENT.POPULAR_SERVICES.TITLE}
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {FOOTER_CONTENT.POPULAR_SERVICES.ITEMS.map((service) => (
                <li key={service}>• {service}</li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-lg">{CONTACT_INFO.TITLE}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                <p className="text-gray-300">
                  {CONTACT_INFO.ADDRESS.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < CONTACT_INFO.ADDRESS.split("\n").length - 1 && (
                        <br />
                      )}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <p className="text-gray-300">{CONTACT_INFO.PHONE}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <p className="text-gray-300">{CONTACT_INFO.EMAIL}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <div>
                  <p className="text-gray-300">{CONTACT_INFO.HOURS}</p>
                  <p className="text-gray-300">{CONTACT_INFO.HOURS2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-gray-800 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-gray-400 text-sm md:text-left">
              <p>
                © {currentYear} {FOOTER_CONTENT.BOTTOM_SECTION.COPYRIGHT}
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>{FOOTER_CONTENT.BOTTOM_SECTION.MADE_WITH_LOVE.PREFIX}</span>
              <Heart className="h-4 w-4 fill-current text-red-500" />
              <span>{FOOTER_CONTENT.BOTTOM_SECTION.MADE_WITH_LOVE.SUFFIX}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-6 text-gray-500 text-xs md:justify-start">
            <a href="#" className="transition-colors hover:text-blue-400">
              {FOOTER_CONTENT.BOTTOM_SECTION.LEGAL_LINKS.PRIVACY_POLICY}
            </a>
            <a href="#" className="transition-colors hover:text-blue-400">
              {FOOTER_CONTENT.BOTTOM_SECTION.LEGAL_LINKS.TERMS_OF_SERVICE}
            </a>
            <a href="#" className="transition-colors hover:text-blue-400">
              {FOOTER_CONTENT.BOTTOM_SECTION.LEGAL_LINKS.COOKIE_POLICY}
            </a>
            <a href="#" className="transition-colors hover:text-blue-400">
              {FOOTER_CONTENT.BOTTOM_SECTION.LEGAL_LINKS.HELP}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
