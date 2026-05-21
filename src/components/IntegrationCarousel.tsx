'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LinkIcon,
  QrCode,
  Globe,
  Share2,
  Code,
  Palette,
  Mail,
  MapPin,
  Layout,
  ShoppingBag,
  Monitor,
  FileCode,
  ArrowRight,
  Camera,
  Users,
} from 'lucide-react';

interface PlatformItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'direct-link' | 'website-platform';
  description?: string;
}

const platformItems: PlatformItem[] = [
  // Direct Link category
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Camera className="w-6 h-6 sm:w-8 sm:h-8" />,
    category: 'direct-link',
    description: 'Ajoutez le lien dans votre bio',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Users className="w-8 h-8" />,
    category: 'direct-link',
    description: 'Page ou profil professionnel',
  },
  {
    id: 'qr-code',
    name: 'QR Code',
    icon: <QrCode className="w-8 h-8" />,
    category: 'direct-link',
    description: 'Générez un QR code pour vos tables',
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="w-8 h-8" />,
    category: 'direct-link',
    description: 'Bouton "Réserver maintenant"',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    icon: <MapPin className="w-8 h-8" />,
    category: 'direct-link',
    description: 'Lien dans votre profil Google',
  },
  {
    id: 'direct-link',
    name: 'Lien direct',
    icon: <LinkIcon className="w-8 h-8" />,
    category: 'direct-link',
    description: 'Partagez le lien où vous voulez',
  },

  // Website Platforms category
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: <Layout className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Plugin ou code intégré',
  },
  {
    id: 'wix',
    name: 'Wix',
    icon: <Monitor className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Intégration via code HTML',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: <ShoppingBag className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Pour restaurants avec boutique',
  },
  {
    id: 'webflow',
    name: 'Webflow',
    icon: <Palette className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Design personnalisé avancé',
  },
  {
    id: 'html-vanilla',
    name: 'HTML/Vanilla',
    icon: <FileCode className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Code pur pour tout site web',
  },
  {
    id: 'custom-code',
    name: 'Code personnalisé',
    icon: <Code className="w-8 h-8" />,
    category: 'website-platform',
    description: 'Développement sur mesure',
  },
];

interface CarouselProps {
  items: PlatformItem[];
  speed?: number;
  direction?: 'left' | 'right';
}

function Carousel({ items, speed = 20, direction = 'left' }: CarouselProps) {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-4 sm:gap-8"
        animate={{
          x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-40 h-36 sm:w-48 sm:h-40 flex flex-col items-center justify-center bg-white border border-[#E5E5E5] rounded-lg p-4 sm:p-6 hover:border-[#0066FF] hover:shadow-md transition-all"
          >
            <div className="text-[#0066FF] mb-3">{item.icon}</div>
            <h3 className="font-light text-[#2A2A2A] text-lg mb-1 text-center">{item.name}</h3>
            <p className="text-[#666666] font-light text-sm text-center">{item.description}</p>
          </div>
        ))}
      </motion.div>
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default function IntegrationCarousel() {
  const directLinkItems = platformItems.filter((item) => item.category === 'direct-link');
  const websitePlatformItems = platformItems.filter((item) => item.category === 'website-platform');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 text-[#0066FF] text-sm font-light mb-4">
            <Share2 className="w-4 h-4" />
            Compatible partout
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Intégration avec votre écosystème
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Connectez votre système de réservation à toutes vos plateformes, des réseaux sociaux à
            votre site web
          </p>
        </div>

        <div className="space-y-16">
          {/* Direct Links Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-6 h-6 text-[#0066FF]" />
              <h3 className="text-2xl font-light text-[#2A2A2A]">Lien direct & réseaux sociaux</h3>
            </div>
            <p className="text-[#666666] font-light max-w-3xl">
              Partagez votre lien de réservation sur Instagram, Facebook, emails, QR codes, Google
              Maps et plus encore. Parfait pour les restaurants qui veulent une présence digitale
              simple et efficace.
            </p>
            <Carousel items={directLinkItems} speed={25} direction="left" />
          </div>

          {/* Website Platforms Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-[#0066FF]" />
              <h3 className="text-2xl font-light text-[#2A2A2A]">Plateformes de site web</h3>
            </div>
            <p className="text-[#666666] font-light max-w-3xl">
              Intégrez facilement notre formulaire de réservation dans votre site web, quelle que
              soit la plateforme utilisée. Code HTML simple, plugins, ou développement sur mesure.
            </p>
            <Carousel items={websitePlatformItems} speed={30} direction="right" />
          </div>

          {/* Call to action */}
          <div className="text-center pt-8">
            <p className="text-[#666666] font-light mb-6">
              Démarrez en quelques minutes. Aucune compétence technique requise.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
