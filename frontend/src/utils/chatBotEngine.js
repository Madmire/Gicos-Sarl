/**
 * Moteur de réponses du bot GICOS
 * Conseille les clients et oriente vers les offres / services
 */

import { propertiesAPI, servicesAPI, formatPrice } from '../api';

const CONTACT = {
  phone: '+226 66 39 52 54',
  phoneHref: 'tel:+22666395254',
  email: 'gicossarl10@gmail.com',
  emailHref: 'mailto:gicossarl10@gmail.com',
};

const QUICK_REPLIES = {
  welcome: [
    { id: 'offers', label: 'Voir les offres' },
    { id: 'services', label: 'Nos services' },
    { id: 'buy', label: 'Acheter' },
    { id: 'rent', label: 'Louer' },
    { id: 'contact', label: 'Nous contacter' },
  ],
  afterOffers: [
    { id: 'buy', label: 'Acheter' },
    { id: 'rent', label: 'Louer' },
    { id: 'contact', label: 'Parler à un conseiller' },
  ],
  afterServices: [
    { id: 'offers', label: 'Voir les annonces' },
    { id: 'contact', label: 'Demander un devis' },
  ],
};

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const extractCity = (text) => {
  const cities = [
    'ouagadougou',
    'bobo',
    'bobo-dioulasso',
    'koudougou',
    'banfora',
    'ouahigouya',
    'kaya',
    'dedougou',
    'fada',
  ];
  const n = normalize(text);
  for (const city of cities) {
    if (n.includes(city)) {
      if (city === 'bobo') return 'Bobo-Dioulasso';
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  return null;
};

const detectIntent = (raw) => {
  const text = normalize(raw);

  if (/^(bonjour|bonsoir|salut|hello|hi|hey|coucou)\b/.test(text) || text === 'aide' || text === 'help') {
    return { type: 'greeting' };
  }
  if (/\b(contact|telephone|appeler|joindre|email|mail|adresse|conseiller|humain)\b/.test(text)) {
    return { type: 'contact' };
  }
  if (/\b(service|construction|electricite|carrelage|plomberie|peinture|sonorisation|travaux|devis)\b/.test(text)) {
    return { type: 'services' };
  }
  if (/\b(location|louer|loue|a louer|appartement a louer)\b/.test(text)) {
    return { type: 'properties', property_type: 'location' };
  }
  if (/\b(achat|acheter|vente|vendre|a vendre|investir)\b/.test(text)) {
    return { type: 'properties', property_type: 'vente' };
  }
  if (/\b(annonce|offre|bien|maison|appartement|terrain|villa|immobilier|prix|budget)\b/.test(text)) {
    return { type: 'properties' };
  }
  if (/\b(merci|super|parfait|ok|daccord|d'accord)\b/.test(text)) {
    return { type: 'thanks' };
  }
  if (/\b(qui etes|qui es|gicos|entreprise|societe|a propos)\b/.test(text)) {
    return { type: 'about' };
  }

  return { type: 'properties', search: raw };
};

const mapProperty = (p) => ({
  id: p.id,
  title: p.title,
  price: formatPrice(p.price),
  city: p.city,
  type: p.property_type === 'vente' ? 'Vente' : 'Location',
  category: p.category,
  link: `/annonces/${p.id}`,
  image: p.primary_image,
});

async function fetchOffers(filters = {}) {
  const params = { limit: 4, ...filters };
  try {
    const { data } = await propertiesAPI.getAll(params);
    const list = Array.isArray(data) ? data : data.items || data.properties || [];
    return list.slice(0, 4).map(mapProperty);
  } catch {
    try {
      const { data } = await propertiesAPI.getFeatured(4);
      const list = Array.isArray(data) ? data : [];
      return list.slice(0, 4).map(mapProperty);
    } catch {
      return [];
    }
  }
}

async function fetchServices() {
  try {
    const { data } = await servicesAPI.getAll(true);
    return (Array.isArray(data) ? data : []).map((s) => ({
      name: s.name,
      slug: s.slug,
      short: s.short_description,
      link: '/services',
    }));
  } catch {
    return [];
  }
}

export function getWelcomeMessage() {
  return {
    text:
      "Bonjour ! Je suis l'assistant GICOS. Je peux vous conseiller et vous orienter vers nos annonces ou nos services (immobilier, construction, électricité, etc.).\n\nComment puis-je vous aider ?",
    quickReplies: QUICK_REPLIES.welcome,
    offers: [],
    links: [],
  };
}

const QUICK_IDS = new Set(['offers', 'buy', 'rent', 'services', 'contact', 'greeting']);

function resolveIntent(input) {
  if (typeof input !== 'string') {
    return { type: input, city: null };
  }
  if (QUICK_IDS.has(input)) {
    return { type: input, city: null };
  }
  return { ...detectIntent(input), city: extractCity(input) };
}

export async function processMessage(input) {
  const intent = resolveIntent(input);
  const city = intent.city;

  switch (intent.type) {
    case 'greeting':
      return getWelcomeMessage();

    case 'about':
      return {
        text:
          'GICOS (Galaxie Immobilière Construction et Services) est votre partenaire au Burkina Faso pour l’immobilier, la construction et les services techniques (électricité, carrelage, plomberie, peinture, sonorisation).',
        quickReplies: QUICK_REPLIES.welcome,
        offers: [],
        links: [
          { label: 'Nos services', to: '/services' },
          { label: 'Annonces', to: '/annonces' },
        ],
      };

    case 'contact':
      return {
        text: `Un conseiller GICOS peut vous accompagner.\n\n📞 ${CONTACT.phone}\n✉️ ${CONTACT.email}\n\nOu laissez un message via le formulaire de contact.`,
        quickReplies: [
          { id: 'offers', label: 'Voir les offres' },
          { id: 'services', label: 'Nos services' },
        ],
        offers: [],
        links: [
          { label: 'Page contact', to: '/contact' },
          { label: 'Appeler', href: CONTACT.phoneHref },
        ],
      };

    case 'services': {
      const services = await fetchServices();
      const list =
        services.length > 0
          ? services.map((s) => `• ${s.name} — ${s.short}`).join('\n')
          : 'Immobilier, construction, électricité, carrelage, plomberie, peinture, sonorisation.';
      return {
        text: `Voici nos services :\n\n${list}\n\nSouhaitez-vous un devis ou voir nos annonces immobilières ?`,
        quickReplies: QUICK_REPLIES.afterServices,
        offers: [],
        links: [{ label: 'Page services', to: '/services' }],
      };
    }

    case 'buy':
    case 'properties': {
      const property_type =
        intent.type === 'buy' ? 'vente' : intent.property_type;
      const filters = {};
      if (property_type) filters.property_type = property_type;
      if (city) filters.city = city;
      if (intent.search && !property_type) filters.search = intent.search;

      const offers = await fetchOffers(filters);
      const typeLabel =
        property_type === 'vente' ? 'à vendre' : property_type === 'location' ? 'à louer' : '';
      const cityLabel = city ? ` à ${city}` : '';

      if (offers.length === 0) {
        return {
          text: `Je n’ai pas trouvé d’annonce correspondante pour le moment${cityLabel}. Consultez toutes nos offres ou contactez un conseiller.`,
          quickReplies: QUICK_REPLIES.afterOffers,
          offers: [],
          links: [
            { label: 'Toutes les annonces', to: '/annonces' },
            { label: 'Contact', to: '/contact' },
          ],
        };
      }

      return {
        text: `Voici quelques offres${typeLabel ? ` ${typeLabel}` : ''}${cityLabel} susceptibles de vous intéresser :`,
        quickReplies: QUICK_REPLIES.afterOffers,
        offers,
        links: [{ label: 'Voir toutes les annonces', to: '/annonces' }],
      };
    }

    case 'rent': {
      const filters = { property_type: 'location' };
      if (city) filters.city = city;
      const offers = await fetchOffers(filters);
      return {
        text:
          offers.length > 0
            ? `Voici des biens à louer${city ? ` à ${city}` : ''} :`
            : 'Aucune location disponible pour le moment. Contactez-nous pour vos besoins.',
        quickReplies: QUICK_REPLIES.afterOffers,
        offers,
        links: [{ label: 'Toutes les annonces', to: '/annonces' }],
      };
    }

    case 'offers': {
      const offers = await fetchOffers();
      return {
        text:
          offers.length > 0
            ? 'Voici une sélection de nos offres actuelles :'
            : 'Consultez notre catalogue d’annonces pour découvrir tous nos biens.',
        quickReplies: QUICK_REPLIES.afterOffers,
        offers,
        links: [{ label: 'Catalogue complet', to: '/annonces' }],
      };
    }

    case 'thanks':
      return {
        text: 'Avec plaisir ! N’hésitez pas si vous avez d’autres questions.',
        quickReplies: QUICK_REPLIES.welcome,
        offers: [],
        links: [],
      };

    default:
      return {
        text:
          'Je peux vous aider à trouver une annonce (achat / location), présenter nos services, ou vous mettre en relation avec un conseiller. Que souhaitez-vous ?',
        quickReplies: QUICK_REPLIES.welcome,
        offers: [],
        links: [],
      };
  }
}

export { QUICK_REPLIES, CONTACT };
