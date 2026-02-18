import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#2A2A2A] text-white py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logo_512.png"
                alt="TableMaster Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-light">TableMaster</span>
            </div>
            <p className="text-white/70 font-light leading-relaxed text-sm">
              La solution de réservation la plus abordable et complète pour restaurants.
            </p>
          </div>

          <div>
            <h3 className="font-normal mb-4">Produit</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-white/70 hover:text-white font-light text-sm">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-white font-light text-sm">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#custom-dev" className="text-white/70 hover:text-white font-light text-sm">
                  Développement sur mesure
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-normal mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/signup" className="text-white/70 hover:text-white font-light text-sm">
                  S&apos;inscrire
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 hover:text-white font-light text-sm">
                  Connexion
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@tablemaster.fr"
                  className="text-white/70 hover:text-white font-light text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-normal mb-4">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal" className="text-white/70 hover:text-white font-light text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white font-light text-sm">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/70 hover:text-white font-light text-sm">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-white/70 hover:text-white font-light text-sm">
                  Conditions Générales de Vente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/70 text-sm font-light">
            © {new Date().getFullYear()} TableMaster. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
