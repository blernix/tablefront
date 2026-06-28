export interface CityData {
  slug: string;
  name: string;
  region: string;
  population: string;
  nbRestaurants: string;
  quartiers: string[];
  specialites: string;
  introTitle: string;
  introText: string;
  pourquoi: string[];
  faq: { question: string; answer: string }[];
}

export const cities: CityData[] = [
  {
    slug: 'paris',
    name: 'Paris',
    region: 'Île-de-France',
    population: '2 100 000',
    nbRestaurants: '14 000',
    quartiers: ['Le Marais', 'Montmartre', 'Saint-Germain-des-Prés', 'Bastille', 'Champs-Élysées'],
    specialites: 'bistronomie, cuisine fusion, gastronomie étoilée',
    introTitle: 'Logiciel de réservation pour restaurants à Paris',
    introText:
      'Avec plus de 14 000 restaurants répartis dans ses 20 arrondissements, Paris est la capitale mondiale de la gastronomie. De la brasserie traditionnelle du Marais au bistrot contemporain de Bastille, chaque établissement fait face à une concurrence intense et à une clientèle exigeante. TableMaster aide les restaurateurs parisiens à digitaliser leur service de réservation sans payer de commission par couvert, un avantage décisif dans une ville où chaque euro compte.',
    pourquoi: [
      'Gérez jusqu\'à 3 services par jour (midi et deux services le soir), un rythme typiquement parisien',
      'Widget de réservation multilingue (français, anglais, espagnol) pour votre clientèle internationale',
      'Intégration en 5 minutes sur votre site WordPress, Wix ou sur-mesure',
      'Forfait fixe à 39€/mois, sans commission — économisez en moyenne 450€/mois vs TheFork',
    ],
    faq: [
      {
        question: 'Comment gérer les réservations de dernière minute dans un restaurant parisien ?',
        answer:
          'TableMaster propose une confirmation instantanée avec notification push sur votre téléphone. Vous pouvez bloquer des créneaux ou les libérer en un clic depuis l\'application mobile, idéal pour les annulations de dernière minute fréquentes à Paris.',
      },
      {
        question: 'Le widget est-il adapté aux touristes étrangers qui réservent depuis l\'étranger ?',
        answer:
          'Oui, le widget de réservation est disponible en français, anglais et espagnol. Les touristes peuvent réserver depuis n\'importe quel fuseau horaire, et les horaires s\'affichent automatiquement dans leur langue.',
      },
      {
        question: 'Puis-je synchroniser TableMaster avec mon site existant si je suis sur WordPress ?',
        answer:
          'Absolument. TableMaster fournit un plugin WordPress dédié et un script JavaScript universel. L\'intégration prend moins de 5 minutes, et le widget s\'adapte automatiquement au design de votre site.',
      },
    ],
  },
  {
    slug: 'marseille',
    name: 'Marseille',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '870 000',
    nbRestaurants: '3 500',
    quartiers: ['Vieux-Port', 'Le Panier', 'La Corniche', 'Cours Julien', 'Vallon des Auffes'],
    specialites: 'bouillabaisse, cuisine méditerranéenne, poissons grillés',
    introTitle: 'Solution de réservation de table à Marseille',
    introText:
      'Deuxième ville de France, Marseille allie cuisine méditerranéenne authentique et scène gastronomique en plein essor. Avec ses 3 500 restaurants, du cabanon sur la Corniche à la table étoilée du Vieux-Port, les restaurateurs marseillais cherchent des outils modernes pour gérer leurs réservations sans exploser leur budget. TableMaster propose une solution complète à prix fixe, pensée pour les indépendants et les petites équipes.',
    pourquoi: [
      'Gérez les périodes de forte affluence (saison estivale, matchs de l\'OM, congrès) avec des créneaux flexibles',
      'Notification push instantanée à chaque nouvelle réservation — ne manquez plus jamais un client',
      'Tableau de bord simple pour visualiser votre taux d\'occupation en temps réel',
      'Zéro commission : vous gardez 100 % de votre chiffre d\'affaires, contrairement aux plateformes qui prélèvent 2€ par couvert',
    ],
    faq: [
      {
        question: 'Comment gérer l\'affluence estivale à Marseille avec un logiciel de réservation ?',
        answer:
          'TableMaster vous permet de créer des plages horaires élargies en été, de bloquer automatiquement les jours fériés, et d\'activer une liste d\'attente intelligente. Vous pouvez ajuster vos disponibilités en temps réel depuis votre téléphone.',
      },
      {
        question: 'Puis-je utiliser TableMaster pour mon restaurant de plage saisonnier ?',
        answer:
          'Oui, vous pouvez activer et désactiver votre widget de réservation selon la saison. Pas d\'engagement, vous ne payez que les mois où votre restaurant est ouvert. La résiliation se fait en un clic.',
      },
      {
        question: 'Est-ce que le système fonctionne même sans connexion internet stable ?',
        answer:
          'Le widget de réservation fonctionne côté client (sur le téléphone du client). La synchronisation se fait dès que la connexion est rétablie. Vos réservations sont stockées en local et synchronisées automatiquement.',
      },
    ],
  },
  {
    slug: 'lyon',
    name: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    population: '520 000',
    nbRestaurants: '4 000',
    quartiers: ['Vieux Lyon', 'La Croix-Rousse', 'Brotteaux', 'Presqu\'île', 'Confluence'],
    specialites: 'bouchons lyonnais, cuisine bourgeoise, quenelles',
    introTitle: 'Système de réservation pour restaurants lyonnais',
    introText:
      'Capitale mondiale de la gastronomie selon le critique Curnonsky, Lyon compte plus de 4 000 restaurants dont une vingtaine de bouchons traditionnels. Entre tradition culinaire et innovation, les restaurateurs lyonnais doivent jongler entre réservations téléphoniques et services en ligne. TableMaster simplifie cette gestion avec un outil tout-en-un qui respecte l\'identité de chaque établissement, du bouchon de la Croix-Rousse au restaurant gastronomique de la Presqu\'île.',
    pourquoi: [
      'Réservation en ligne disponible 24h/24, complément idéal au téléphone pour les bouchons très sollicités',
      'Affichage automatique des disponibilités en fonction de vos horaires d\'ouverture (midi et soir)',
      'Gestion des tables et de leur disposition pour optimiser le placement des convives',
      'Essai gratuit de 14 jours, puis 39€/mois sans engagement',
    ],
    faq: [
      {
        question: 'Comment TableMaster s\'adapte-t-il aux bouchons lyonnais qui fonctionnent beaucoup par téléphone ?',
        answer:
          'TableMaster propose un mode hybride : vous pouvez saisir manuellement les réservations téléphoniques dans le planning, et le widget en ligne se met à jour automatiquement. Le planning unifié vous donne une vue complète de toutes vos réservations.',
      },
      {
        question: 'Puis-je personnaliser le widget pour qu\'il corresponde à l\'ambiance de mon restaurant ?',
        answer:
          'Oui, vous pouvez choisir les couleurs, la police, l\'arrondi des boutons, et même ajouter votre logo. Le widget s\'adapte au design de votre site pour une expérience de marque cohérente.',
      },
      {
        question: 'Le système gère-t-il les grands groupes, fréquents dans les restaurants d\'affaires lyonnais ?',
        answer:
          'Tout à fait. Vous pouvez définir des tables de grande capacité et autoriser les réservations jusqu\'à 20 couverts. Le système vérifie automatiquement la disponibilité pour éviter les conflits de placement.',
      },
    ],
  },
  {
    slug: 'toulouse',
    name: 'Toulouse',
    region: 'Occitanie',
    population: '500 000',
    nbRestaurants: '2 800',
    quartiers: ['Capitole', 'Saint-Cyprien', 'Carmes', 'Minimes', 'Saint-Georges'],
    specialites: 'cassoulet, cuisine du Sud-Ouest, violettes',
    introTitle: 'Logiciel de gestion des réservations à Toulouse',
    introText:
      'Toulouse, la Ville Rose, séduit par sa gastronomie du Sud-Ouest et son art de vivre. Avec près de 2 800 restaurants, des institutions centenaires autour du Capitole aux néo-bistrots de Saint-Cyprien, la demande de digitalisation est forte. TableMaster offre aux restaurateurs toulousains une plateforme intuitive pour gérer leurs réservations, sans les frais cachés des grandes plateformes. Idéal pour les établissements qui veulent préserver leur indépendance.',
    pourquoi: [
      'Gestion simplifiée des services du midi et du soir avec créneaux personnalisables',
      'Statistiques de fréquentation pour anticiper les périodes creuses et adapter votre offre',
      'Rappels automatiques par email pour réduire le taux de no-show',
      'Support client basé en France, disponible par chat et téléphone',
    ],
    faq: [
      {
        question: 'Puis-je tester TableMaster gratuitement avant de m\'engager ?',
        answer:
          'Bien sûr, vous bénéficiez d\'une période d\'essai gratuite de 14 jours, sans carte bancaire requise. Vous avez accès à 100 % des fonctionnalités pendant l\'essai pour évaluer l\'outil en conditions réelles.',
      },
      {
        question: 'Combien de temps faut-il pour installer le système de réservation sur mon site ?',
        answer:
          'L\'installation prend moins de 10 minutes. Vous copiez-collez un script sur votre site et le widget apparaît automatiquement. Nos équipes peuvent vous assister gratuitement pour la mise en place.',
      },
    ],
  },
  {
    slug: 'nice',
    name: 'Nice',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '343 000',
    nbRestaurants: '2 200',
    quartiers: ['Vieux Nice', 'Promenade des Anglais', 'Port Lympia', 'Cimiez', 'Libération'],
    specialites: 'cuisine niçoise, socca, salade niçoise, pissaladière',
    introTitle: 'Outil de réservation pour restaurants à Nice',
    introText:
      'Sur la Côte d\'Azur, Nice allie tourisme international et gastronomie ensoleillée. Avec plus de 2 200 établissements du Vieux Nice à la Promenade des Anglais, les restaurateurs doivent gérer un flux constant de clients tout au long de l\'année. TableMaster leur permet d\'automatiser les réservations, de réduire les appels téléphoniques et de se concentrer sur l\'essentiel : la cuisine.',
    pourquoi: [
      'Gestion des pics de fréquentation touristique avec créneaux horaires flexibles',
      'Widget responsive : vos clients réservent depuis leur mobile sur la plage',
      'Rappels SMS et email pour limiter les réservations fantômes en haute saison',
      'Dashboard en temps réel accessible depuis n\'importe quel appareil',
    ],
    faq: [
      {
        question: 'Le widget de réservation fonctionne-t-il bien sur mobile, même sur la plage ?',
        answer:
          'Oui, le widget est entièrement responsive et optimisé pour mobile. Il se charge rapidement même sur une connexion 4G. Vos clients peuvent réserver en 30 secondes depuis leur téléphone.',
      },
      {
        question: 'Puis-je fermer les réservations en ligne quand mon restaurant est complet ?',
        answer:
          'Bien sûr, vous pouvez bloquer des créneaux en un clic depuis votre téléphone. Vous pouvez également définir des fermetures exceptionnelles (jours fériés, travaux, congés) à l\'avance.',
      },
    ],
  },
  {
    slug: 'nantes',
    name: 'Nantes',
    region: 'Pays de la Loire',
    population: '320 000',
    nbRestaurants: '1 800',
    quartiers: ['Bouffay', 'Île de Nantes', 'Graslin', 'Chantenay', 'Trentemoult'],
    specialites: 'cuisine nantaise, beurre blanc, gâteau nantais, Muscadet',
    introTitle: 'Réservation en ligne pour restaurants à Nantes',
    introText:
      'Nantes, élue plusieurs fois ville la plus agréable de France, possède une scène culinaire dynamique et créative. Du bistrot branché de l\'Île de Nantes au restaurant gastronomique du centre-ville, les 1 800 établissements nantais bénéficient d\'une clientèle jeune et connectée. TableMaster répond à cette attente avec un système de réservation digital qui s\'intègre parfaitement aux sites web et réseaux sociaux des restaurateurs.',
    pourquoi: [
      'Adapté aux restaurants éco-responsables : confirmation par email, pas d\'impression papier',
      'Gestion multi-établissements si vous avez plusieurs adresses à Nantes',
      'Collecte automatique des avis clients pour booster votre e-réputation',
      'Prix fixe sans surprise, contrairement aux commissions variables des plateformes',
    ],
    faq: [
      {
        question: 'Comment puis-je récolter les avis de mes clients après leur repas ?',
        answer:
          'TableMaster envoie automatiquement un email de remerciement après le service, avec un lien vers votre fiche Google. Vous pouvez personnaliser le message et le délai d\'envoi (le lendemain, par exemple).',
      },
      {
        question: 'Est-ce que je peux connecter TableMaster à ma page Facebook et Instagram ?',
        answer:
          'Oui, vous obtenez un lien de réservation direct que vous pouvez partager sur vos réseaux sociaux, dans votre bio Instagram, ou via un QR code affiché en vitrine.',
      },
    ],
  },
  {
    slug: 'montpellier',
    name: 'Montpellier',
    region: 'Occitanie',
    population: '300 000',
    nbRestaurants: '1 700',
    quartiers: ['Écusson', 'Antigone', 'Port Marianne', 'Beaux-Arts', 'Aiguelongue'],
    specialites: 'cuisine méditerranéenne, brasucade, tielles sétoises',
    introTitle: 'Outil de réservation de table à Montpellier',
    introText:
      'Avec sa population étudiante et son dynamisme économique, Montpellier est l\'une des villes les plus attractives du sud de la France. Ses 1 700 restaurants, concentrés dans l\'Écusson et les nouveaux quartiers comme Port Marianne, attirent une clientèle jeune, connectée et spontanée. TableMaster permet aux restaurateurs montpelliérains de capter cette clientèle digitale avec un widget de réservation moderne et sans engagement.',
    pourquoi: [
      'Ciblez la clientèle étudiante et jeune active qui réserve exclusivement en ligne',
      'Gérez votre planning en temps réel sur mobile, idéal pour les restaurateurs souvent en déplacement',
      'Intégration simple sur les sites WordPress majoritairement utilisés par les restaurateurs locaux',
      'Pas de frais d\'installation, pas de matériel requis, tout se fait en ligne',
    ],
    faq: [
      {
        question: 'Le système est-il assez simple pour un restaurateur peu habitué au digital ?',
        answer:
          'Absolument. TableMaster a été conçu pour être utilisé sans formation. L\'interface est en français, les boutons sont explicites, et vous pouvez tout gérer depuis un simple navigateur web. Notre support est disponible si vous avez la moindre question.',
      },
      {
        question: 'Puis-je limiter les réservations à certains horaires uniquement ?',
        answer:
          'Oui, vous définissez précisément vos créneaux de réservation (ex : 12h-14h pour le midi, 19h-22h pour le soir). Vous pouvez même avoir des horaires différents selon les jours de la semaine.',
      },
    ],
  },
  {
    slug: 'strasbourg',
    name: 'Strasbourg',
    region: 'Grand Est',
    population: '290 000',
    nbRestaurants: '1 500',
    quartiers: ['Petite France', 'Krutenau', 'Cathédrale', 'Neustadt', 'Orangerie'],
    specialites: 'choucroute, tarte flambée, baeckeoffe, kougelhopf',
    introTitle: 'Réservation en ligne pour restaurants à Strasbourg',
    introText:
      'Capitale européenne, Strasbourg séduit par son ambiance unique mêlant tradition alsacienne et rayonnement international. Avec 1 500 restaurants, de la winstub de la Petite France au restaurant contemporain de la Neustadt, la ville accueille chaque année des milliers de touristes et de professionnels. TableMaster aide les restaurateurs strasbourgeois à gérer efficacement leurs réservations, notamment pendant le célèbre marché de Noël et les sessions parlementaires.',
    pourquoi: [
      'Gestion des périodes de forte affluence (marché de Noël, sessions parlementaires)',
      'Widget multilingue (français, allemand, anglais) pour la clientèle transfrontalière',
      'Planning partagé entre le gérant et l\'équipe en salle pour une coordination parfaite',
      'Rappels automatiques pour réduire les no-shows, fréquents en période touristique',
    ],
    faq: [
      {
        question: 'Le widget est-il disponible en allemand pour mes clients d\'outre-Rhin ?',
        answer:
          'Oui, le widget de réservation supporte le français, l\'allemand et l\'anglais. Les clients allemands peuvent réserver dans leur langue, ce qui améliore significativement le taux de conversion.',
      },
      {
        question: 'Comment gérez-vous la forte demande pendant le marché de Noël ?',
        answer:
          'TableMaster permet de créer des plages horaires spécifiques pour les périodes événementielles, avec des intervalles de réservation plus courts. Vous pouvez aussi activer un système de dépôt de garanti pour limiter les réservations non honorées.',
      },
    ],
  },
  {
    slug: 'bordeaux',
    name: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    population: '260 000',
    nbRestaurants: '1 800',
    quartiers: ['Chartrons', 'Saint-Pierre', 'Saint-Michel', 'Bastide', 'Ginko'],
    specialites: 'entrecôte bordelaise, cannelés, lamproie, vins de Bordeaux',
    introTitle: 'Solution de réservation de table à Bordeaux',
    introText:
      'Capitale mondiale du vin, Bordeaux allie patrimoine classé UNESCO et gastronomie d\'exception. Avec 1 800 restaurants, du bistrot à vins des Chartrons à la table étoilée du centre historique, les restaurateurs bordelais évoluent dans un écosystème exigeant. TableMaster leur apporte un outil de réservation moderne qui valorise leur image de marque et simplifie leur gestion quotidienne, le tout à un tarif fixe et transparent.',
    pourquoi: [
      'Idéal pour les bars à vins et restaurants qui veulent un système élégant à leur image',
      'Gestion des caves et des menus spéciaux (accords mets-vins) communiquée aux clients',
      'Statistiques détaillées pour analyser la fréquentation selon les jours et les services',
      'Service client premium, basé en France, joignable par téléphone et email',
    ],
    faq: [
      {
        question: 'Puis-je afficher mes suggestions d\'accords mets-vins sur le widget de réservation ?',
        answer:
          'Le widget de réservation est focalisé sur la prise de rendez-vous. Cependant, une fois le client inscrit, vous pouvez lui envoyer un email automatique avec votre carte des vins et vos suggestions. Le lien de votre menu numérique peut être intégré dans la confirmation de réservation.',
      },
      {
        question: 'TableMaster est-il adapté aux restaurants gastronomiques ?',
        answer:
          'Tout à fait. Vous pouvez exiger une empreinte bancaire, gérer des préférences alimentaires détaillées, et même créer un questionnaire personnalisé pour préparer l\'expérience de vos convives.',
      },
    ],
  },
  {
    slug: 'lille',
    name: 'Lille',
    region: 'Hauts-de-France',
    population: '235 000',
    nbRestaurants: '1 500',
    quartiers: ['Vieux Lille', 'Wazemmes', 'Vauban', 'Bois Blancs', 'Saint-Maurice'],
    specialites: 'moules-frites, carbonade flamande, welsh, gaufres',
    introTitle: 'Logiciel de réservation pour restaurants lillois',
    introText:
      'Lille, carrefour de l\'Europe du Nord, possède une gastronomie généreuse et une scène culinaire en pleine renaissance. Des estaminets du Vieux Lille aux brasseries contemporaines de Wazemmes, les 1 500 restaurants lillois attirent une clientèle variée : étudiants, cadres, touristes belges et britanniques. TableMaster facilite la gestion des réservations dans cette ville dense et dynamique où chaque table compte.',
    pourquoi: [
      'Adapté au rythme nordiste : deux services le midi pour les pauses déjeuner des entreprises',
      'Widget responsive : vos clients réservent pendant la Grande Braderie ou depuis le métro',
      'Gestion des réservations de groupe pour les afterworks et événements d\'entreprise',
      'Fonctionne avec tous les types de cuisine : brasserie, gastronomique, rapide haut de gamme',
    ],
    faq: [
      {
        question: 'Puis-je bloquer mon restaurant pendant la Grande Braderie de Lille ?',
        answer:
          'Oui, vous pouvez définir une fermeture exceptionnelle pour n\'importe quelle date en quelques clics. Le widget affichera automatiquement "Restaurant fermé" pour cette journée.',
      },
      {
        question: 'Est-ce que je peux gérer les réservations de grands groupes (15+ personnes) ?',
        answer:
          'Oui, TableMaster permet de créer des tables de grande capacité et d\'accepter les réservations jusqu\'à 20 personnes en ligne. Pour les très grands groupes, vous pouvez activer une demande de devis par email.',
      },
    ],
  },
  {
    slug: 'rennes',
    name: 'Rennes',
    region: 'Bretagne',
    population: '225 000',
    nbRestaurants: '1 200',
    quartiers: ['Sainte-Anne', 'Saint-Georges', 'Thabor', 'Colombier', 'Maurepas'],
    specialites: 'galettes, crêpes, kouign-amann, cidre breton',
    introTitle: 'Outil de gestion des réservations à Rennes',
    introText:
      'Rennes, capitale bretonne dynamique et étudiante, offre une scène culinaire ancrée dans la tradition tout en étant ouverte aux tendances. Avec 1 200 restaurants, de la crêperie du centre historique au restaurant bistronomique près du Thabor, les restaurateurs rennais font face à une demande croissante de digitalisation. TableMaster leur apporte une solution simple et abordable, conforme à l\'esprit indépendant des restaurateurs bretons.',
    pourquoi: [
      'Simplicité d\'utilisation : prise en main en 10 minutes, sans formation',
      'Tarif fixe sans surprise, parfait pour les crêperies et restaurants familiaux',
      'Widget léger qui ne ralentit pas le chargement de votre site',
      'Support téléphonique basé en France, réactif et disponible',
    ],
    faq: [
      {
        question: 'Le système est-il adapté aux crêperies qui fonctionnent sans réservation habituellement ?',
        answer:
          'Oui, même pour les établissements qui ne prennent habituellement pas de réservation, TableMaster peut servir de file d\'attente virtuelle. Les clients réservent un créneau et sont prévenus 10 minutes avant leur table.',
      },
      {
        question: 'Combien de temps prend la configuration initiale ?',
        answer:
          'La configuration de base (horaires, nombre de tables, créneaux) prend environ 10 minutes. Le widget est prêt à être installé immédiatement. Vous pouvez peaufiner les réglages par la suite à tout moment.',
      },
    ],
  },
  {
    slug: 'reims',
    name: 'Reims',
    region: 'Grand Est',
    population: '180 000',
    nbRestaurants: '800',
    quartiers: ['Centre-ville', 'Boulingrin', 'Saint-Remi', 'Cernay', 'Croix-Rouge'],
    specialites: 'biscuits roses, champagne, jambon de Reims, pieds de porc',
    introTitle: 'Système de réservation en ligne pour restaurants à Reims',
    introText:
      'Capitale du champagne, Reims attire chaque année des milliers de visiteurs venus découvrir ses caves et sa cathédrale. Avec 800 restaurants, des brasseries élégantes du centre-ville aux tables gastronomiques des abords des vignobles, les restaurateurs rémois doivent gérer une clientèle touristique exigeante. TableMaster leur offre une plateforme de réservation moderne qui valorise leur établissement et simplifie leur organisation.',
    pourquoi: [
      'Gestion simplifiée des réservations pendant les périodes touristiques (vendanges, fêtes de fin d\'année)',
      'Idéal pour les maisons de champagne disposant d\'un restaurant : gestion multi-services',
      'Empreinte bancaire optionnelle pour sécuriser les réservations des tables gastronomiques',
      'Personnalisation complète du widget aux couleurs de votre établissement',
    ],
    faq: [
      {
        question: 'Puis-je demander une empreinte bancaire pour les réservations dans mon restaurant gastronomique ?',
        answer:
          'Oui, TableMaster permet d\'activer la pré-autorisation bancaire via Stripe. Le montant n\'est pas débité, mais cela réduit considérablement les réservations non honorées.',
      },
      {
        question: 'Comment puis-je gérer les réservations de groupes qui visitent les caves de champagne ?',
        answer:
          'Vous pouvez créer des créneaux dédiés aux groupes avec des règles spécifiques (nombre minimum/maximum, délai de réservation). Idéal pour les tours operators et les événements d\'entreprise.',
      },
    ],
  },
  {
    slug: 'saint-etienne',
    name: 'Saint-Étienne',
    region: 'Auvergne-Rhône-Alpes',
    population: '173 000',
    nbRestaurants: '700',
    quartiers: ['Centre-ville', 'Crêt de Roc', 'Bellevue', 'Châteaucreux', 'Terrenoire'],
    specialites: 'cervelas stéphanois, bugnes, sarasson, fourme de Montbrison',
    introTitle: 'Logiciel de réservation de table à Saint-Étienne',
    introText:
      'Saint-Étienne, ancienne cité industrielle en pleine transformation, cultive une gastronomie du terroir sincère et généreuse. Avec 700 restaurants, la ville offre un équilibre entre tables traditionnelles et nouvelle scène culinaire émergente. Les restaurateurs stéphanois peuvent désormais bénéficier de la même technologie de réservation que les grandes villes, à un tarif accessible et sans commission. TableMaster démocratise la réservation en ligne pour tous.',
    pourquoi: [
      'Tarif accessible (39€/mois) adapté aux restaurants familiaux et aux indépendants',
      'Pas de matériel coûteux : tout fonctionne sur votre téléphone et votre ordinateur existants',
      'Support français réactif pour vous accompagner au quotidien',
      'Essai gratuit de 14 jours, sans engagement ni carte bancaire',
    ],
    faq: [
      {
        question: 'TableMaster est-il rentable pour un petit restaurant de 30 couverts ?',
        answer:
          'Absolument. Pour 39€ par mois, vous économisez sur les appels téléphoniques, réduisez les no-shows (qui coûtent cher à un petit établissement), et captez une nouvelle clientèle qui ne réserve qu\'en ligne. Le retour sur investissement est généralement constaté dès le premier mois.',
      },
      {
        question: 'Ai-je besoin d\'un site web pour utiliser TableMaster ?',
        answer:
          'Pas obligatoirement. TableMaster vous fournit une page de réservation publique avec votre propre URL (tablemaster.fr/votre-restaurant) que vous pouvez partager sur vos réseaux sociaux et Google Maps.',
      },
    ],
  },
  {
    slug: 'le-havre',
    name: 'Le Havre',
    region: 'Normandie',
    population: '170 000',
    nbRestaurants: '600',
    quartiers: ['Centre-ville', 'Saint-François', 'Les Docks', 'Sainte-Adresse', 'Le Perrey'],
    specialites: 'moules, fruits de mer, poissons frais, brioche du Havre',
    introTitle: 'Outil de réservation en ligne au Havre',
    introText:
      'Porte océane de la Normandie, Le Havre séduit par son architecture Perret classée UNESCO et sa gastronomie tournée vers la mer. Avec 600 restaurants, des fruits de mer du quartier Saint-François aux tables contemporaines des Docks, les restaurateurs havrais méritent des outils à la hauteur de leur cadre exceptionnel. TableMaster leur apporte une solution de réservation complète, aussi solide que l\'architecture de la ville.',
    pourquoi: [
      'Interface intuitive pensée pour les restaurateurs, pas pour les informaticiens',
      'Installation express : votre widget de réservation est en ligne en 5 minutes',
      'Parfait pour les restaurants de poisson : les clients peuvent préciser leurs allergies (crustacés, etc.)',
      'Planning hebdomadaire clair, idéal pour les équipes réduites',
    ],
    faq: [
      {
        question: 'Les clients peuvent-ils indiquer leurs allergies alimentaires lors de la réservation ?',
        answer:
          'Oui, un champ "Notes" est disponible lors de la réservation. Les clients peuvent y mentionner leurs allergies ou préférences alimentaires. Vous pouvez aussi ajouter des questions personnalisées au formulaire de réservation.',
      },
      {
        question: 'Puis-je avoir plusieurs comptes pour mon équipe en salle ?',
        answer:
          'Oui, vous pouvez créer des comptes "Serveur" pour votre personnel. Ils pourront consulter et gérer les réservations sans accéder aux paramètres sensibles du restaurant.',
      },
    ],
  },
  {
    slug: 'toulon',
    name: 'Toulon',
    region: 'Provence-Alpes-Côte d\'Azur',
    population: '180 000',
    nbRestaurants: '750',
    quartiers: ['Mourillon', 'Vieille Ville', 'Haute Ville', 'Pont du Las', 'Saint-Roch'],
    specialites: 'cuisine provençale, bouillabaisse, cade toulonnaise, pissaladière',
    introTitle: 'Réservation en ligne pour restaurants toulonnais',
    introText:
      'Entre mer et montagne, Toulon offre une gastronomie provençale authentique loin des clichés de la Côte d\'Azur. Avec 750 restaurants, du cabanon les pieds dans l\'eau au Mourillon à la table gastronomique de la Vieille Ville, les restaurateurs toulonnais cultivent un art de vivre méditerranéen. TableMaster leur permet d\'ajouter la réservation en ligne à leur palette de services, simplement et sans changer leurs habitudes.',
    pourquoi: [
      'Gestion des services du midi (clientèle militaire et civile) et du soir (touristes et locaux)',
      'Adapté aux petits restaurants familiaux comme aux établissements haut de gamme',
      'Statistiques simples pour comprendre les habitudes de réservation de vos clients',
      'Modification des disponibilités en temps réel, même depuis la plage',
    ],
    faq: [
      {
        question: 'Puis-je arrêter l\'abonnement à tout moment ?',
        answer:
          'Oui, il n\'y a aucun engagement. Vous pouvez résilier votre abonnement en un clic depuis votre espace. Vous ne serez pas facturé le mois suivant, et vous pourrez réactiver votre compte quand vous voulez.',
      },
      {
        question: 'Le widget fonctionne-t-il sur tous les types de sites web ?',
        answer:
          'Oui, le widget TableMaster s\'intègre sur WordPress, Wix, Shopify, Squarespace, et tout site HTML personnalisé. Un simple copier-coller d\'un extrait de code suffit.',
      },
    ],
  },
  {
    slug: 'grenoble',
    name: 'Grenoble',
    region: 'Auvergne-Rhône-Alpes',
    population: '158 000',
    nbRestaurants: '850',
    quartiers: ['Hyper-centre', 'Saint-Laurent', 'Île Verte', 'Championnet', 'Europole'],
    specialites: 'gratin dauphinois, ravioles du Royans, noix de Grenoble, chartreuse',
    introTitle: 'Gestion des réservations de restaurant à Grenoble',
    introText:
      'Nichée au cœur des Alpes, Grenoble est une ville dynamique où se croisent étudiants, ingénieurs et amoureux de la montagne. Avec 850 restaurants, des tables gastronomiques de l\'hyper-centre aux auberges de montagne des environs, la demande de services digitaux est forte. TableMaster propose aux restaurateurs grenoblois une solution de réservation fiable, qui fonctionne aussi bien dans la vallée qu\'en station.',
    pourquoi: [
      'Parfait pour les établissements saisonniers en station : activez/désactivez selon vos périodes d\'ouverture',
      'Interface mobile-first pour gérer vos réservations depuis les pistes ou la cuisine',
      'API ouverte pour connecter TableMaster à vos outils existants',
      'Support 7j/7 pour ne jamais rester bloqué',
    ],
    faq: [
      {
        question: 'TableMaster est-il adapté aux restaurants d\'altitude et aux refuges ?',
        answer:
          'Oui ! Le widget fonctionne même en connexion limitée. Les réservations sont synchronisées dès que le réseau est disponible. Vous pouvez gérer votre planning en mode hors-ligne depuis l\'application mobile.',
      },
      {
        question: 'Puis-je avoir un numéro de téléphone pour le support technique ?',
        answer:
          'Tout à fait, le support technique est disponible par chat et par email. Un accompagnement téléphonique est proposé pour la mise en place initiale. Notre équipe est basée en France.',
      },
    ],
  },
  {
    slug: 'dijon',
    name: 'Dijon',
    region: 'Bourgogne-Franche-Comté',
    population: '160 000',
    nbRestaurants: '700',
    quartiers: ['Centre-ville', 'Place Wilson', 'Toison d\'Or', 'République', 'Vieux Dijon'],
    specialites: 'bœuf bourguignon, escargots, moutarde de Dijon, pain d\'épices',
    introTitle: 'Réservation en ligne pour restaurants à Dijon',
    introText:
      'Capitale de la Bourgogne, Dijon est une ville d\'art et d\'histoire réputée pour sa gastronomie et ses vins prestigieux. Avec 700 restaurants, des caves voûtées du Vieux Dijon aux tables contemporaines de la place Wilson, les restaurateurs dijonnais perpétuent un savoir-faire culinaire unique. TableMaster leur apporte une touche de modernité avec un système de réservation qui respecte l\'âme de leur établissement.',
    pourquoi: [
      'Valorisez votre cave à vins : les clients peuvent être informés de vos accords mets-vins',
      'Gérez les réservations pendant la Vente des Vins des Hospices, un pic d\'activité majeur',
      'Système de rappels automatiques pour confirmer les réservations la veille',
      'Planning hebdomadaire exportable pour votre brigade en cuisine',
    ],
    faq: [
      {
        question: 'Comment gérer l\'affluence pendant les grands événements comme la Vente des Vins ?',
        answer:
          'TableMaster permet de créer des créneaux horaires spéciaux pour les périodes événementielles, avec des règles de réservation adaptées (délai minimum, nombre de couverts). Vous activez ce mode spécial en un clic et le désactivez une fois l\'événement terminé.',
      },
      {
        question: 'Puis-je envoyer des confirmations automatiques à mes clients ?',
        answer:
          'Oui, chaque réservation déclenche automatiquement un email de confirmation personnalisable. Vous pouvez également activer un email de rappel la veille du service pour réduire les oublis.',
    },
    ],
  },
  {
    slug: 'angers',
    name: 'Angers',
    region: 'Pays de la Loire',
    population: '155 000',
    nbRestaurants: '600',
    quartiers: ['Doutre', 'Centre-ville', 'Saint-Serge', 'Belle-Beille', 'Roseraie'],
    specialites: 'quernons d\'ardoise, rillauds d\'Anjou, fouées, Coteaux du Layon',
    introTitle: 'Outil de réservation de table à Angers',
    introText:
      'Angers, cité du roi René au patrimoine médiéval remarquable, possède une scène culinaire qui cultive l\'excellence et la proximité. Avec 600 restaurants, du bistrot du Doutre à la table gastronomique du centre-ville, les restaurateurs angevins bénéficient d\'une clientèle fidèle et exigeante. TableMaster les aide à fidéliser encore plus leurs clients et à en attirer de nouveaux grâce à la réservation en ligne.',
    pourquoi: [
      'Interface conçue pour être utilisée quotidiennement, même par les moins technophiles',
      'Prix fixe ultra-compétitif, adapté au marché local des restaurants indépendants',
      'Widget personnalisable aux couleurs de votre établissement pour une intégration parfaite',
      'Pas de matériel requis : fonctionne sur n\'importe quel ordinateur, tablette ou téléphone',
    ],
    faq: [
      {
        question: 'Est-ce facile à utiliser si je ne suis pas à l\'aise avec l\'informatique ?',
        answer:
          'TableMaster est conçu spécifiquement pour les restaurateurs. L\'interface est simple, en français, avec des boutons explicites. Si vous savez utiliser un téléphone ou envoyer un email, vous saurez utiliser TableMaster.',
      },
      {
        question: 'Les clients reçoivent-ils un SMS de confirmation ?',
        answer:
          'Pour l\'instant, les confirmations sont envoyées par email. Les SMS sont disponibles en option pour le forfait Pro (69€/mois). L\'email est gratuit et illimité quel que soit votre forfait.',
      },
    ],
  },
  {
    slug: 'nimes',
    name: 'Nîmes',
    region: 'Occitanie',
    population: '150 000',
    nbRestaurants: '650',
    quartiers: ['Écusson', 'Jean Jaurès', 'Pissevin', 'Costières', 'Capitole'],
    specialites: 'brandade de morue, gardianne de taureau, croquants de Nîmes, vins des Costières',
    introTitle: 'Système de réservation de restaurant à Nîmes',
    introText:
      'Nîmes, la Rome française, conjugue héritage antique et gastronomie ensoleillée. Avec 650 restaurants répartis entre l\'Écusson historique et les quartiers périphériques, les restaurateurs nîmois profitent d\'une activité touristique soutenue toute l\'année grâce aux arènes et aux ferias. TableMaster leur offre une solution digitale qui s\'adapte au rythme singulier de la ville, entre calme hivernal et effervescence estivale.',
    pourquoi: [
      'Gestion dynamique des capacités : augmentez vos couverts pendant les ferias en un clic',
      'Widget responsive pour les réservations de dernière minute des visiteurs sur mobile',
      'Liste d\'attente automatique quand votre restaurant est complet',
      'Rapports mensuels pour analyser votre activité et ajuster votre stratégie',
    ],
    faq: [
      {
        question: 'Puis-je créer une liste d\'attente pour les soirs de feria où tout est complet ?',
        answer:
          'Oui, lorsque tous vos créneaux sont pris, le widget affiche automatiquement "Complet" avec une option pour rejoindre la liste d\'attente. Vous êtes notifié dès qu\'une table se libère, et vous pouvez contacter le client en un clic.',
      },
      {
        question: 'Combien de réservations puis-je accepter par mois avec le forfait de base ?',
        answer:
          'Le forfait Starter à 39€/mois inclut les réservations illimitées. Il n\'y a aucune limite de volume, que vous receviez 10 ou 500 réservations par mois. C\'est l\'un des grands avantages par rapport aux plateformes à commission.',
      },
    ],
  },
  {
    slug: 'villeurbanne',
    name: 'Villeurbanne',
    region: 'Auvergne-Rhône-Alpes',
    population: '155 000',
    nbRestaurants: '450',
    quartiers: ['Gratte-Ciel', 'Charpennes', 'Tonkin', 'Cusset', 'Buers'],
    specialites: 'cuisine lyonnaise, spécialités orientales, street-food',
    introTitle: 'Réservation de table en ligne à Villeurbanne',
    introText:
      'Villeurbanne, voisine immédiate de Lyon, est une ville cosmopolite au riche tissu associatif et culturel. Avec 450 restaurants, des adresses historiques du quartier Gratte-Ciel aux tables multiculturelles de Charpennes, la ville offre une diversité culinaire remarquable. TableMaster permet aux restaurateurs villeurbannais de se digitaliser facilement, avec une solution pensée pour les établissements de proximité et les concepts innovants.',
    pourquoi: [
      'Adapté aux restaurants multiculturels : interface simple et multilingue',
      'Prix accessible pour les petits établissements de quartier',
      'Gestion des commandes à emporter couplée aux réservations sur place',
      'Installation rapide pour les restaurants qui ouvrent et veulent démarrer tout de suite',
    ],
    faq: [
      {
        question: 'TableMaster gère-t-il aussi la vente à emporter ?',
        answer:
          'TableMaster est focalisé sur la réservation de tables. Pour la vente à emporter, le champ "Notes" de la réservation peut être utilisé pour indiquer une commande. Une fonctionnalité dédiée est en cours de développement.',
      },
      {
        question: 'Y a-t-il des frais cachés ?',
        answer:
          'Aucun. Le prix affiché (39€/mois en Starter, 69€/mois en Pro) est le prix total, TVA non applicable (article 293 B du CGI). Pas de frais d\'installation, pas de frais de résiliation, pas de commission sur les réservations.',
      },
    ],
  },
];

export const citySlugs = cities.map((c) => c.slug);

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
