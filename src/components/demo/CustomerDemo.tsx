'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Star,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalReservations: number;
  lastVisit: string;
  tags: string[];
}

interface CustomerDemoProps {
  isActive?: boolean;
}

export default function CustomerDemo({ isActive = true }: CustomerDemoProps) {
  const [visibleCustomers, setVisibleCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showExportFeedback, setShowExportFeedback] = useState(false);

  const customers: Customer[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Marie Lambert',
        email: 'm.lambert@mail.fr',
        phone: '06 12 34 56 78',
        totalReservations: 24,
        lastVisit: '12/02/2026',
        tags: ['VIP', 'Fidèle'],
      },
      {
        id: 2,
        name: 'Jean Dupont',
        email: 'j.dupont@gmail.com',
        phone: '07 98 76 54 32',
        totalReservations: 18,
        lastVisit: '08/02/2026',
        tags: ['Fidèle'],
      },
      {
        id: 3,
        name: 'Sophie Martin',
        email: 'sophie.m@orange.fr',
        phone: '06 45 67 89 01',
        totalReservations: 12,
        lastVisit: '15/02/2026',
        tags: ['Régulier'],
      },
      {
        id: 4,
        name: 'Thomas Leroy',
        email: 't.leroy@pro.fr',
        phone: '07 23 45 67 89',
        totalReservations: 7,
        lastVisit: '01/02/2026',
        tags: [],
      },
      {
        id: 5,
        name: 'Emma Bernard',
        email: 'emma.b@icloud.com',
        phone: '06 34 56 78 90',
        totalReservations: 31,
        lastVisit: '18/02/2026',
        tags: ['VIP'],
      },
      {
        id: 6,
        name: 'Lucas Petit',
        email: 'l.petit@yahoo.fr',
        phone: '07 56 78 90 12',
        totalReservations: 3,
        lastVisit: '20/01/2026',
        tags: ['À risque'],
      },
    ],
    []
  );

  useEffect(() => {
    if (!isActive) {
      setVisibleCustomers([]);
      setSearchQuery('');
      setIsExporting(false);
      setExportComplete(false);
      setShowExportFeedback(false);
      return;
    }

    const timers = customers.map((cust, index) => {
      return setTimeout(() => {
        setVisibleCustomers((prev) => [...prev, cust]);
      }, index * 300 + 400);
    });

    // Auto-trigger CSV export animation after all customers appear
    const exportTimer = setTimeout(() => {
      setIsExporting(true);
    }, customers.length * 300 + 1200);

    const completeTimer = setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setShowExportFeedback(true);
    }, customers.length * 300 + 2500);

    const hideFeedbackTimer = setTimeout(() => {
      setShowExportFeedback(false);
    }, customers.length * 300 + 4000);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearTimeout(exportTimer);
      clearTimeout(completeTimer);
      clearTimeout(hideFeedbackTimer);
    };
  }, [customers, isActive]);

  const filteredCustomers =
    searchQuery.length > 0
      ? visibleCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : visibleCustomers;

  const tagColor = (tag: string) => {
    switch (tag) {
      case 'VIP':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Fidèle':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Régulier':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'À risque':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-[320px] w-full flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 shadow-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0066FF]/10 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-[#0066FF]" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                Base de données clients
              </span>
              <p className="text-xs text-gray-400">CRM intégré</p>
            </div>
          </div>

          {/* CSV Export button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isExporting
                  ? { scale: [1, 1.1, 1, 1.1, 1] }
                  : visibleCustomers.length > 0 && !exportComplete
                    ? { boxShadow: ['0 0 0 0 rgba(0,102,255,0)', '0 0 0 8px rgba(0,102,255,0)', '0 0 0 0 rgba(0,102,255,0)'] }
                    : {}
              }
              transition={
                isExporting
                  ? { duration: 0.6, repeat: Infinity }
                  : { duration: 2, repeat: Infinity }
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066FF] text-white text-xs rounded-lg hover:bg-[#0052CC] transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>CSV</span>
              <ChevronDown className="h-3 w-3" />
            </motion.button>

            {/* Export feedback toast */}
            <AnimatePresence>
              {showExportFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute right-0 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 flex items-center gap-2"
                >
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>clients-marketing_2026.csv</span>
                  <span className="text-green-400">✓</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mb-3"
        >
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 transition-all"
          />
        </motion.div>

        {/* Customer list */}
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          <AnimatePresence>
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#0066FF]/30 transition-colors group"
              >
                {/* Client info */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-700">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                      {customer.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="h-2.5 w-2.5 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="h-2.5 w-2.5 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Stats + Tags */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-800">
                      {customer.totalReservations}
                    </div>
                    <div className="text-xs text-gray-400">{customer.lastVisit}</div>
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex flex-col gap-0.5 items-end">
                    {customer.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-1.5 py-0.5 rounded-full border ${tagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    animate={isActive ? { x: [0, 3, 0] } : { x: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    className="text-gray-300 group-hover:text-[#0066FF] transition-colors"
                  >
                    <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state when searching */}
          {isActive && searchQuery.length > 0 && filteredCustomers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-400 text-xs"
            >
              Aucun client trouvé
            </motion.div>
          )}
        </div>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500"
        >
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium text-gray-700">{visibleCustomers.length}</span> clients
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>
                {visibleCustomers.filter((c) => !c.tags.includes('À risque')).length} consentent
                marketing
              </span>
            </div>
          </div>

          {/* Export hint */}
          {exportComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Exporté</span>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative badge */}
        {isActive && visibleCustomers.length >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 2.5 }}
            className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1"
          >
            <Star className="h-2.5 w-2.5 fill-white" />
            <span>+{visibleCustomers.filter((c) => c.tags.includes('VIP')).length} VIP</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
