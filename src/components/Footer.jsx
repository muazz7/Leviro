import { Phone, Mail, MapPin, Facebook } from 'lucide-react';

export default function Footer() {
    // Google Maps URL for the address
    const mapsUrl = 'https://www.google.com/maps/search/Mogbazar+Purbo+Noyatola+Dhaka+Bangladesh+1200';

    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-4">LEVIRO</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premium Panjabis crafted for the modern Bengali man.
                            Tradition meets contemporary elegance in every stitch.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-medium tracking-wider uppercase mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a href="tel:+8801714811255" className="hover:text-white transition-colors">
                                    01714811255
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a href="mailto:levirofashion@gmail.com" className="hover:text-white transition-colors">
                                    levirofashion@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    Mogbazar Purbo Noyatola<br />
                                    Dhaka, Bangladesh - 1200
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <Facebook className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://www.facebook.com/share/1WNmnpqrHE/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    Follow us on Facebook
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-medium tracking-wider uppercase mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#products" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Shop Collection
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Size Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Shipping & Returns
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2026 Leviro. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500">
                            Made with ♥ in Dhaka, Bangladesh
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
