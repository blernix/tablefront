'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingDown, Euro, Users, RefreshCw, Check } from 'lucide-react';

export default function SavingsCalculatorSection() {
  const [monthlyCovers, setMonthlyCovers] = useState<number>(300);
  const [theforkCommission, setTheforkCommission] = useState<number>(2.0);
  const [zenchefMonthly, setZenchefMonthly] = useState<number>(179);
  const [tablemasterPack, setTablemasterPack] = useState<'base' | 'growth'>('base');

  const [theforkMonthlyCost, setTheforkMonthlyCost] = useState<number>(0);
  const [savingsVsThefork, setSavingsVsThefork] = useState<number>(0);
  const [savingsVsZenchef, setSavingsVsZenchef] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);

  const tablemasterPrice = tablemasterPack === 'base' ? 39 : 69;

  // Calculate costs
  useEffect(() => {
    const theforkCost = monthlyCovers * theforkCommission;

    setTheforkMonthlyCost(theforkCost);

    const savingsThefork = theforkCost - tablemasterPrice;
    const savingsZenchef = zenchefMonthly - tablemasterPrice;

    setSavingsVsThefork(savingsThefork > 0 ? savingsThefork : 0);
    setSavingsVsZenchef(savingsZenchef > 0 ? savingsZenchef : 0);
    setAnnualSavings(Math.max(savingsThefork, savingsZenchef, 0) * 12);
  }, [monthlyCovers, theforkCommission, zenchefMonthly, tablemasterPrice]);

  const handleReset = () => {
    setMonthlyCovers(300);
    setTheforkCommission(2.0);
    setZenchefMonthly(179);
    setTablemasterPack('base');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const restaurantTypes = [
    { label: 'Petit restaurant', covers: 150, description: '~5 couverts/jour' },
    { label: 'Restaurant moyen', covers: 300, description: '~10 couverts/jour' },
    { label: 'Restaurant actif', covers: 600, description: '~20 couverts/jour' },
    { label: 'Grand restaurant', covers: 900, description: '~30 couverts/jour' },
  ];

  const zenchefPlans = [
    { label: 'Starter', price: 129, description: 'Entrée de gamme' },
    { label: 'Standard', price: 179, description: 'Formule moyenne' },
    { label: 'Premium', price: 249, description: 'Formule complète' },
  ];

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-[#0066FF]" />
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A]">
              Calculez vos économies vs TheFork & Zenchef
            </h2>
          </div>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Comparez les coûts réels : TheFork (commission par couvert) vs Zenchef (forfait mensuel)
            vs TableMaster (forfait abordable)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Controls */}
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl p-8">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-light text-[#2A2A2A] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0066FF]" />
                  Nombre de couverts par mois
                </label>
                <span className="text-2xl font-light text-[#0066FF]">{monthlyCovers} couverts</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="10"
                value={monthlyCovers}
                onChange={(e) => setMonthlyCovers(parseInt(e.target.value))}
                className="w-full h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0066FF]"
              />
              <div className="flex justify-between text-sm text-[#666666] font-light mt-2">
                <span>50</span>
                <span>500</span>
                <span>1000</span>
                <span>1500</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* TheFork Commission */}
              <div>
                <label className="text-lg font-light text-[#2A2A2A] mb-3 block">
                  Commission TheFork par couvert
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={theforkCommission}
                    onChange={(e) => setTheforkCommission(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B6B]"
                  />
                  <span className="text-xl font-light text-[#FF6B6B] min-w-[60px]">
                    {theforkCommission.toFixed(1)}€
                  </span>
                </div>
                <div className="text-sm text-[#666666] font-light mt-2">
                  TheFork: 1,50€ à 2,50€ selon négociation
                </div>
              </div>

              {/* Zenchef Monthly */}
              <div>
                <label className="text-lg font-light text-[#2A2A2A] mb-3 block">
                  Forfait mensuel Zenchef
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="129"
                      max="249"
                      step="10"
                      value={zenchefMonthly}
                      onChange={(e) => setZenchefMonthly(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4ECDC4]"
                    />
                    <span className="text-xl font-light text-[#4ECDC4] min-w-[60px]">
                      {zenchefMonthly}€
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {zenchefPlans.map((plan) => (
                      <button
                        key={plan.label}
                        onClick={() => setZenchefMonthly(plan.price)}
                        className={`p-3 border rounded-lg text-center transition-colors ${zenchefMonthly === plan.price ? 'border-[#4ECDC4] bg-[#4ECDC4]/5' : 'border-[#E5E5E5] hover:border-[#4ECDC4]'}`}
                      >
                        <div className="font-light text-[#2A2A2A]">{plan.label}</div>
                        <div className="text-sm text-[#666666] font-light">{plan.price}€</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-[#666666] font-light mt-2">
                  Zenchef: forfait mensuel fixe sans commission
                </div>
              </div>

              {/* TableMaster Pack Selection */}
              <div>
                <label className="text-lg font-light text-[#2A2A2A] mb-3 block">
                  Pack TableMaster
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTablemasterPack('base')}
                    className={`p-6 border rounded-xl text-center transition-all ${tablemasterPack === 'base' ? 'border-[#0066FF] bg-[#0066FF]/5' : 'border-[#E5E5E5] hover:border-[#0066FF]'}`}
                  >
                    <div className="text-2xl font-light text-[#2A2A2A]">39€</div>
                    <div className="text-sm text-[#666666] font-light mt-1">Pack Gestion</div>
                    <div className="mt-4">
                      <Check
                        className={`w-5 h-5 mx-auto ${tablemasterPack === 'base' ? 'text-[#0066FF]' : 'text-[#E5E5E5]'}`}
                      />
                    </div>
                  </button>
                  <button
                    onClick={() => setTablemasterPack('growth')}
                    className={`p-6 border rounded-xl text-center transition-all ${tablemasterPack === 'growth' ? 'border-[#0066FF] bg-[#0066FF]/5' : 'border-[#E5E5E5] hover:border-[#0066FF]'}`}
                  >
                    <div className="text-2xl font-light text-[#2A2A2A]">69€</div>
                    <div className="text-sm text-[#666666] font-light mt-1">Pack Croissance</div>
                    <div className="mt-4">
                      <Check
                        className={`w-5 h-5 mx-auto ${tablemasterPack === 'growth' ? 'text-[#0066FF]' : 'text-[#E5E5E5]'}`}
                      />
                    </div>
                  </button>
                </div>
                <div className="text-sm text-[#666666] font-light mt-2">
                  Forfait mensuel fixe, 0% commission
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[#E5E5E5]">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#E5E5E5] text-[#666666] font-light rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réinitialiser les valeurs
              </button>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {restaurantTypes.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => setMonthlyCovers(type.covers)}
                    className={`p-4 border rounded-lg text-center transition-colors ${monthlyCovers === type.covers ? 'border-[#0066FF] bg-[#0066FF]/5' : 'border-[#E5E5E5] hover:border-[#0066FF]'}`}
                  >
                    <div className="font-light text-[#2A2A2A]">{type.label}</div>
                    <div className="text-sm text-[#666666] font-light mt-1">{type.description}</div>
                    <div className="text-xs text-[#0066FF] font-light mt-2">
                      {type.covers} couverts
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-6 h-6 text-[#0066FF]" />
                <h3 className="text-2xl font-light text-[#2A2A2A]">Coûts mensuels comparés</h3>
              </div>

              <div className="space-y-6">
                {/* TheFork */}
                <div className="border border-[#E5E5E5] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-light text-[#2A2A2A]">TheFork</div>
                      <div className="text-sm text-[#666666] font-light">
                        {monthlyCovers} couverts × {theforkCommission.toFixed(1)}€
                      </div>
                    </div>
                    <div className="text-3xl font-light text-[#FF6B6B]">
                      {formatCurrency(theforkMonthlyCost)}
                    </div>
                  </div>
                  <div className="h-2 bg-[#FF6B6B]/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF6B6B] rounded-full"
                      style={{ width: `${Math.min(100, (theforkMonthlyCost / 3000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Zenchef */}
                <div className="border border-[#E5E5E5] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-light text-[#2A2A2A]">Zenchef</div>
                      <div className="text-sm text-[#666666] font-light">Forfait mensuel fixe</div>
                    </div>
                    <div className="text-3xl font-light text-[#4ECDC4]">
                      {formatCurrency(zenchefMonthly)}
                    </div>
                  </div>
                  <div className="h-2 bg-[#4ECDC4]/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ECDC4] rounded-full"
                      style={{ width: `${Math.min(100, (zenchefMonthly / 3000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* TableMaster */}
                <div className="border-2 border-[#0066FF] rounded-xl p-6 bg-[#0066FF]/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-light text-[#2A2A2A]">TableMaster</div>
                      <div className="text-sm text-[#666666] font-light">Forfait mensuel fixe</div>
                    </div>
                    <div className="text-3xl font-light text-[#0066FF]">
                      {formatCurrency(tablemasterPrice)}
                    </div>
                  </div>
                  <div className="h-2 bg-[#0066FF]/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0066FF] rounded-full"
                      style={{ width: `${Math.min(100, (tablemasterPrice / 3000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="border border-[#E5E5E5] rounded-2xl p-8 bg-gradient-to-br from-[#FAFAFA] to-white">
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-6">Résumé des économies</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <Euro className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-light text-[#2A2A2A]">Économies vs TheFork</div>
                      <div className="text-sm text-green-600 font-light">Chaque mois</div>
                    </div>
                  </div>
                  <div className="text-3xl font-light text-green-600">
                    {formatCurrency(savingsVsThefork)}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Euro className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-light text-[#2A2A2A]">Économies vs Zenchef</div>
                      <div className="text-sm text-blue-600 font-light">Chaque mois</div>
                    </div>
                  </div>
                  <div className="text-3xl font-light text-blue-600">
                    {formatCurrency(savingsVsZenchef)}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="font-light text-[#2A2A2A]">Économies annuelles</div>
                      <div className="text-sm text-purple-600 font-light">Sur 12 mois</div>
                    </div>
                  </div>
                  <div className="text-3xl font-light text-purple-600">
                    {formatCurrency(annualSavings)}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#E5E5E5]">
                <div className="text-center">
                  <p className="text-[#666666] font-light mb-4">
                    Avec {monthlyCovers} couverts par mois, vous économisez{' '}
                    <span className="text-[#0066FF] font-normal">
                      {formatCurrency(Math.max(savingsVsThefork, savingsVsZenchef))}
                    </span>{' '}
                    chaque mois
                  </p>
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#0066FF] text-white font-light rounded-lg hover:bg-[#0052CC] transition-colors text-lg"
                  >
                    <Calculator className="w-5 h-5" />
                    Commencer à économiser
                  </a>
                  <p className="text-sm text-[#666666] font-light mt-4">
                    Essai gratuit de 14 jours, sans carte bancaire
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-[#E5E5E5]">
          <div className="text-center">
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-6">
              Pourquoi choisir TableMaster ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 border border-[#E5E5E5] rounded-xl">
                <div className="text-3xl text-[#0066FF] font-light mb-4">2x moins cher</div>
                <p className="text-[#666666] font-light">
                  À partir de 39€/mois vs 129€+ pour Zenchef. Jusqu&apos;à 90% moins cher que
                  TheFork pour les restaurants actifs.
                </p>
              </div>
              <div className="p-6 border border-[#E5E5E5] rounded-xl">
                <div className="text-3xl text-[#0066FF] font-light mb-4">
                  Fonctionnalités essentielles
                </div>
                <p className="text-[#666666] font-light">
                  Tout ce dont vous avez vraiment besoin : réservations en ligne, gestion mobile,
                  notifications, avis Google.
                </p>
              </div>
              <div className="p-6 border border-[#E5E5E5] rounded-xl">
                <div className="text-3xl text-[#0066FF] font-light mb-4">Simplicité avant tout</div>
                <p className="text-[#666666] font-light">
                  Interface intuitive, configuration en 10 minutes. Pas besoin de formations
                  compliquées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
