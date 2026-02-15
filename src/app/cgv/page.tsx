import Link from 'next/link';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - TableMaster',
  description:
    "Conditions Générales de Vente et d'Utilisation de TableMaster. Droits et obligations, tarifs, support.",
  openGraph: {
    title: 'Conditions Générales de Vente - TableMaster',
    description: "Conditions Générales de Vente et d'Utilisation de TableMaster.",
    type: 'article',
    url: 'https://tablemaster.fr/cgv',
  },
  twitter: {
    card: 'summary',
    title: 'Conditions Générales de Vente - TableMaster',
    description: "Conditions Générales de Vente et d'Utilisation de TableMaster.",
  },
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white border-2 border-[#E5E5E5] p-10">
          <div className="mb-10">
            <h1 className="text-4xl font-light text-[#2A2A2A] mb-4">
              Conditions Générales de Vente (CGV) - TableMaster
            </h1>
            <p className="text-[#666666] font-light">Dernière mise à jour : 11/02/2026</p>
            <p className="text-[#666666] font-light text-sm mt-2">
              Arrête de chercher, voilà ton armure juridique. J&apos;ai rédigé ça pour qu&apos;un
              restaurateur de mauvaise foi ne puisse pas te traîner dans la boue parce qu&apos;il a
              raté une réservation de 10 personnes un samedi soir.
            </p>
            <p className="text-[#666666] font-light text-sm mt-2">
              C&apos;est sec, c&apos;est protecteur, et c&apos;est adapté à ton statut
              d&apos;auto-entrepreneur (Franchise en base de TVA).
            </p>
            <p className="text-[#666666] font-light text-sm mt-2">
              Conseil de ton conseiller : Ne change pas un mot sans comprendre l&apos;implication.
              Copie-colle ça sur une page /cgv et assure-toi que tes clients doivent cocher une case
              &quot;J&apos;accepte les CGV&quot; avant de sortir leur carte bleue sur Stripe.
            </p>
          </div>

          <div className="space-y-8 font-light text-[#666666] leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 1 - PRÉSENTATION ET OBJET
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  Les présentes Conditions Générales de Vente (CGV) régissent les relations
                  contractuelles entre l&apos;entreprise KIKIDEV, représentée par Killian Lecrut
                  (ci-après « TableMaster »), et tout professionnel (ci-après « le Client »)
                  souscrivant aux services de la plateforme TableMaster.
                </p>
                <p className="font-light mt-2">
                  TableMaster est un outil SaaS de gestion de réservations et d&apos;automatisation
                  d&apos;avis clients. Les présentes s&apos;appliquent à l&apos;exclusion de toutes
                  autres conditions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 2 - ACCEPTATION DES CONDITIONS
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  La souscription à un abonnement TableMaster implique l&apos;acceptation pleine et
                  entière des présentes CGV. Le Client reconnaît en avoir pris connaissance et les
                  accepter sans réserve avant toute transaction en cochant la case prévue à cet
                  effet lors de la création de son compte.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 3 - SERVICES ET TARIFS
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">Les services sont décrits sur le site tablemaster.fr.</p>
                <p className="font-light mt-2">
                  <strong>Plans d&apos;abonnement :</strong> Starter (39€/mois) et Pro (69€/mois).
                </p>
                <p className="font-light mt-2">
                  <strong>Prix :</strong> Les prix sont indiqués en Euros Hors Taxes (HT).
                </p>
                <p className="font-light mt-2">
                  <strong>TVA :</strong> En vertu de l&apos;article 293 B du Code Général des
                  Impôts, la TVA est non applicable (&quot;TVA non applicable, art. 293 B du
                  CGI&quot;).
                </p>
                <p className="font-light mt-2">
                  <strong>Révision :</strong> TableMaster se réserve le droit de modifier ses tarifs
                  à tout moment. Les abonnés actuels seront informés 30 jours avant toute
                  modification tarifaire.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 4 - PAIEMENT ET FACTURATION
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  Le paiement s&apos;effectue par carte bancaire via le prestataire sécurisé Stripe.
                </p>
                <p className="font-light mt-2">
                  L&apos;abonnement est prélevé mensuellement à la date anniversaire du premier
                  paiement.
                </p>
                <p className="font-light mt-2">
                  En cas de défaut de paiement (carte expirée, solde insuffisant), l&apos;accès au
                  service est suspendu automatiquement après 3 tentatives infructueuses de Stripe.
                </p>
                <p className="font-light mt-2">
                  Les factures sont disponibles dans l&apos;espace client.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 5 - DURÉE, RÉSILIATION ET NON-REMBOURSEMENT
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">L&apos;offre TableMaster est sans engagement.</p>
                <p className="font-light mt-2">
                  <strong>Résiliation :</strong> Le Client peut résilier son abonnement à tout
                  moment via son tableau de bord ou par email. La résiliation prend effet à la fin
                  de la période mensuelle en cours.
                </p>
                <p className="font-light mt-2">
                  <strong>Politique de non-remboursement :</strong> Aucun remboursement prorata
                  temporis n&apos;est effectué. Tout mois entamé est intégralement dû. Le service
                  reste accessible jusqu&apos;à l&apos;expiration de la période payée.
                </p>
                <p className="font-light mt-2">
                  <strong>Absence de droit de rétractation :</strong> Conformément à l&apos;article
                  L221-28 du Code de la consommation, les prestations de services numériques fournis
                  à des professionnels ne bénéficient pas du droit de rétractation de 14 jours, dès
                  lors que l&apos;exécution a commencé.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 6 - RESPONSABILITÉ ET LIMITATIONS
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  C&apos;est ici que la responsabilité de TableMaster est strictement limitée :
                </p>
                <p className="font-light mt-2">
                  <strong>Disponibilité :</strong> TableMaster décline toute responsabilité en cas
                  d&apos;interruption du service liée à l&apos;hébergeur (Hostinger), au prestataire
                  de paiement (Stripe) ou à des opérations de maintenance.
                </p>
                <p className="font-light mt-2">
                  <strong>Gestion des réservations :</strong> TableMaster est un outil technique. Le
                  Client est seul responsable de la validation, du suivi et de l&apos;accueil de ses
                  clients. TableMaster ne pourra être tenu responsable des pertes de chiffre
                  d&apos;affaires, de clients ou de réputation liées à un bug, une mauvaise
                  configuration ou une notification non reçue.
                </p>
                <p className="font-light mt-2">
                  <strong>Avis Google :</strong> TableMaster facilite la demande d&apos;avis mais ne
                  garantit aucun résultat sur la note finale ou le volume d&apos;avis obtenus.
                </p>
                <p className="font-light mt-2">
                  <strong>Plafond de responsabilité :</strong> En cas de litige avéré, la
                  responsabilité de TableMaster est limitée au montant total des sommes versées par
                  le Client au cours des trois (3) derniers mois.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 7 - DÉVELOPPEMENT SUR MESURE (PREMIUM)
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  Pour toute prestation de création de site web personnalisé :
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Un devis spécifique sera établi.</li>
                  <li>
                    Le paiement d&apos;un acompte de 50% est requis avant le début des travaux.
                  </li>
                  <li>Le solde est dû à la livraison.</li>
                  <li>
                    Aucun remboursement d&apos;acompte ne sera effectué après le début du
                    développement.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 8 - DONNÉES PERSONNELLES (RGPD)
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  <strong>TableMaster en tant que sous-traitant :</strong> Le Client est responsable
                  du traitement des données de ses propres clients (noms, emails, téléphones).
                  TableMaster s&apos;engage à ne jamais revendre ou utiliser ces données pour son
                  propre compte.
                </p>
                <p className="font-light mt-2">
                  <strong>Sécurité :</strong> TableMaster met en œuvre les moyens nécessaires pour
                  sécuriser les données, mais ne peut garantir une sécurité absolue face aux risques
                  d&apos;intrusion informatique.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 9 - PROPRIÉTÉ INTELLECTUELLE
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  Tous les éléments du site et du logiciel (code source, design, logo) sont la
                  propriété exclusive de KIKIDEV. Toute reproduction ou &quot;reverse
                  engineering&quot; est strictement interdite sous peine de poursuites.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2A2A2A] mb-4">
                ARTICLE 10 - LOI APPLICABLE ET LITIGES
              </h2>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                <p className="font-light">
                  Les présentes CGV sont soumises au droit français. Tout litige relatif à leur
                  interprétation ou leur exécution, à défaut de résolution amiable, sera porté
                  devant les tribunaux compétents du ressort du siège social de KIKIDEV.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E5E5E5] flex justify-between">
            <Link
              href="/privacy"
              className="inline-flex items-center text-[#0066FF] hover:underline font-light"
            >
              ← Politique de confidentialité
            </Link>
            <Link
              href="/legal"
              className="inline-flex items-center text-[#0066FF] hover:underline font-light"
            >
              Mentions légales →
            </Link>
          </div>
        </div>
      </main>
      <Footer />{' '}
    </div>
  );
}
