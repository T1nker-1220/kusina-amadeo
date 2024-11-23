import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">107 i Purok 4 Dagatan,</p>
            <p className="mb-2">Amadeo, Cavite</p>
            <p className="mb-2">Phone: +63 960 508 8715</p>
            <p>Email: marquezjohnnathanieljade@gmail.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
            <p className="mb-2">Open Daily</p>
            <p className="mb-2">5:00 AM - 12:00 AM</p>
            <p className="mb-2">Delivery Hours:</p>
            <p>8:00 AM - 10:00 PM</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Kusina De Amadeo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
