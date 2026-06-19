export type Language = "en" | "fr";

const translations = {
  en: {
    nav: {
      home: "Home",
      rooms: "Rooms",
      experiences: "Experiences",
      dining: "Dining",
      gallery: "Gallery",
      about: "About",
      contact: "Contact",
      bookNow: "Book Now",
    },
    langSwitcher: "Français",

    home: {
      heroEyebrow: "Welcome to the Oasis",
      heroHeading: "Where Time Stands Still",
      heroSubtext:
        "Discover a sanctuary of Amazigh heritage, cedar mountain air, and warm hospitality in the heart of the Middle Atlas, Khénifra.",
      suitesHeading: "Signature Suites",
      suitesSubtext:
        "Residences designed for the most discerning travelers, featuring private courtyards and bespoke craftsmanship.",
      discoverSuite: "Discover Suite",
      viewAllRooms: "View All Rooms",
      wellnessEyebrow: "Wellness Sanctuary",
      wellnessHeading: "The Royal Hammam",
      wellnessBody:
        "Surrender to ancient Amazigh rituals in our serene hammam sanctuary. Infused with cedar oil, black soap, and pure argan from the Atlas, our wellness experiences are designed to purify both body and soul.",
      exploreSpa: "Explore Spa Menu",
      guestBook: "Guest Book",
    },

    rooms: {
      heading: "Suites & Rooms",
      subtext:
        "Each of our residences is uniquely designed, featuring authentic Amazigh craftsmanship, handwoven textiles, and modern amenities designed to offer ultimate comfort.",
      categories: {
        all: "All Residences",
        "riad-suite": "Riad Suites",
        "grand-suite": "Grand Suites",
        "deluxe-room": "Deluxe Rooms",
        "royal-pavilion": "Royal Pavilions",
      },
      from: "From",
      perNight: "/ night",
      guests: "guests",
      sqm: "sqm",
      viewSuite: "View Suite",
      noRooms: "No rooms available in this category.",
    },

    experiences: {
      heading: "Curated Experiences",
      subtext:
        "Immerse yourself in the magic of the Middle Atlas with our bespoke selection of wellness rituals, cultural encounters, and exclusive mountain adventures.",
      categories: {
        all: "All Experiences",
        spa: "Spa & Hammam",
        cultural: "Cultural",
        dining: "Culinary",
        tour: "Excursions",
      },
      bookExperience: "Book Experience",
      perPerson: "per person",
      noExperiences: "No experiences found.",
    },

    restaurants: {
      heading: "Fine Dining",
      subtext:
        "From rooftop terraces overlooking the Middle Atlas to intimate courtyard tables — every meal is a ceremony celebrating Amazigh flavors.",
      reserveTable: "Reserve a Table",
      makeReservation: "Make a Reservation",
      date: "Date",
      time: "Time",
      guests: "Number of Guests",
      name: "Your Name",
      email: "Email Address",
      specialRequests: "Special Requests (optional)",
      confirm: "Confirm Reservation",
      reservationConfirmed: "Reservation Confirmed",
      lookForward: "We look forward to welcoming you.",
      reservationFailed: "Reservation Failed",
      tryAgain: "Please try again or contact the concierge.",
    },

    gallery: {
      heading: "Gallery",
      subtext:
        "A visual journey through the exquisite details, mountain landscapes, and quiet opulence of Hotel Le Berbère.",
      categories: {
        all: "All Images",
        rooms: "Residences",
        architecture: "Architecture",
        dining: "Dining",
        spa: "Wellness",
        lifestyle: "Lifestyle",
      },
    },

    about: {
      heading: "Our Story",
      eyebrow: "Born from the Atlas",
      builtRestored: "A new chapter. A timeless spirit.",
      storyPara1:
        "Hotel Le Berbère was born from a deep respect for the Amazigh people and the breathtaking landscape of the Middle Atlas. Nestled in the heart of Khénifra — a city whose identity is inseparable from Amazigh culture — we set out to create a space where authenticity and modern comfort exist in perfect harmony.",
      storyPara2:
        "Recently opened, we are a boutique hotel with a clear purpose: to offer guests a genuine experience of this region. Every corner of the hotel reflects the artistry, warmth, and resilience of the Amazigh heritage — from hand-woven Berber rugs and carved cedar wood to the warm welcome that defines our hospitality.",
      philosophyEyebrow: "Our Philosophy",
      philosophyQuote:
        '"Real luxury is being exactly where you are — breathing cedar mountain air, listening to the Oum Er-Rbia river, and feeling at home among people who take pride in sharing their culture."',
      sustainabilityHeading: "Rooted in the Region",
      sustainabilityBody:
        "We believe in giving back to Khénifra and the Middle Atlas. Our kitchen works with local farmers and producers from the region. Our artisan furnishings are sourced from Amazigh craftspeople. We partner with local guides for all our excursions — because every dirham spent here should benefit the community that makes this place so special.",
      stat1: "Locally Sourced Cuisine",
      stat2: "Amazigh Artisan Crafted",
      stat3: "Community First",
    },

    contact: {
      heading: "Contact & Location",
      subtext:
        "Whether you require a reservation, transportation, or assistance crafting a personalized itinerary in the Middle Atlas, our dedicated team is at your service.",
      address: "Address",
      telephone: "Telephone",
      emailLabel: "Email",
      reception: "Reception",
      available24: "Available 24 hours",
      conciergeHeading: "Concierge Services",
      conciergeBody:
        "Our team can arrange airport and city transfers, private Middle Atlas mountain tours, guided visits to Amazigh cultural sites, and curated local dining recommendations.",
      requestService: "Request Service Menu",
      formHeading: "Send an Enquiry",
      yourName: "Your Name",
      yourEmail: "Email Address",
      phone: "Phone (optional)",
      subject: "Subject",
      message: "Message",
      preferredContact: "Preferred Contact Method",
      send: "Send Enquiry",
      sending: "Sending...",
      inquirySent: "Inquiry Sent",
      conciergeContact: "Our team will contact you shortly.",
      failedSend: "Failed to Send",
      tryAgain: "Please try again or contact us directly via phone.",
    },

    booking: {
      heading: "Reserve Your Stay",
      checkIn: "Check-in Date",
      checkOut: "Check-out Date",
      guests: "Guests",
      guestCount: (n: number) => (n === 1 ? "1 Guest" : `${n} Guests`),
      guestsPlus: "5+ Guests",
      checkAvailability: "Check Availability",
      selectRoom: "Select Your Suite",
      selectRoomSub: "Choose from our available residences for your dates.",
      guestDetails: "Guest Details",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      specialRequests: "Special Requests",
      payment: "Payment",
      cardNumber: "Card Number",
      expiry: "Expiry",
      cvv: "CVV",
      cardHolder: "Card Holder Name",
      confirmBook: "Confirm & Book",
      confirmed: "Reservation Confirmed",
      confirmedMsg: "We look forward to welcoming you to Hotel Le Berbère.",
      confirmationCode: "Confirmation Code",
      returnHome: "Return to Home",
      nights: (n: number) => (n === 1 ? "1 night" : `${n} nights`),
      totalPrice: "Total Price",
      pricePerNight: "per night",
      bookSuite: "Book This Suite",
      available: "Available",
      notAvailable: "Not Available",
    },

    footer: {
      tagline:
        "A boutique luxury hotel rooted in Amazigh culture and the wild beauty of the Middle Atlas, Khénifra.",
      explore: "Explore",
      suites: "Suites & Rooms",
      experiences: "Experiences",
      fineDining: "Fine Dining",
      gallery: "Gallery",
      ourStory: "Our Story",
      contact: "Contact",
      journal: "The Journal",
      journalSub:
        "Subscribe to receive updates on exclusive offers, local events, and new experiences at Hotel Le Berbère.",
      emailPlaceholder: "Email Address",
      join: "Join",
      subscribedTitle: "Subscribed Successfully",
      subscribedDesc: "Welcome to the Hotel Le Berbère journal.",
      subscribeFailTitle: "Subscription Failed",
      subscribeFailDesc: "There was an error subscribing. Please try again.",
      rights: `© ${new Date().getFullYear()} Hotel Le Berbère. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      admin: "Admin",
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      rooms: "Chambres",
      experiences: "Expériences",
      dining: "Gastronomie",
      gallery: "Galerie",
      about: "À Propos",
      contact: "Contact",
      bookNow: "Réserver",
    },
    langSwitcher: "English",

    home: {
      heroEyebrow: "Bienvenue à l'Oasis",
      heroHeading: "Là où le Temps S'arrête",
      heroSubtext:
        "Découvrez un sanctuaire d'héritage amazigh, d'air de montagne de cèdre et de chaleur humaine au cœur du Moyen Atlas, Khénifra.",
      suitesHeading: "Suites Signature",
      suitesSubtext:
        "Des résidences conçues pour les voyageurs les plus exigeants, dotées de cours privées et d'un artisanat sur mesure.",
      discoverSuite: "Découvrir la Suite",
      viewAllRooms: "Voir Toutes les Chambres",
      wellnessEyebrow: "Sanctuaire du Bien-être",
      wellnessHeading: "Le Royal Hammam",
      wellnessBody:
        "Abandonnez-vous aux anciens rituels amazighs dans notre sanctuaire hammam. Infusées d'huile de cèdre, de savon noir et d'argan pur de l'Atlas, nos expériences spa sont conçues pour purifier le corps et l'âme.",
      exploreSpa: "Explorer le Menu Spa",
      guestBook: "Livre d'Or",
    },

    rooms: {
      heading: "Suites & Chambres",
      subtext:
        "Chacune de nos résidences est unique, alliant artisanat amazigh authentique, textiles tissés à la main et équipements modernes pour un confort ultime.",
      categories: {
        all: "Toutes les Résidences",
        "riad-suite": "Suites Riad",
        "grand-suite": "Grandes Suites",
        "deluxe-room": "Chambres Deluxe",
        "royal-pavilion": "Pavillons Royaux",
      },
      from: "À partir de",
      perNight: "/ nuit",
      guests: "voyageurs",
      sqm: "m²",
      viewSuite: "Voir la Suite",
      noRooms: "Aucune chambre disponible dans cette catégorie.",
    },

    experiences: {
      heading: "Expériences sur Mesure",
      subtext:
        "Plongez dans la magie du Moyen Atlas avec notre sélection exclusive de rituels bien-être, de rencontres culturelles et d'aventures en montagne.",
      categories: {
        all: "Toutes les Expériences",
        spa: "Spa & Hammam",
        cultural: "Culturel",
        dining: "Culinaire",
        tour: "Excursions",
      },
      bookExperience: "Réserver l'Expérience",
      perPerson: "par personne",
      noExperiences: "Aucune expérience trouvée.",
    },

    restaurants: {
      heading: "Gastronomie",
      subtext:
        "Des terrasses panoramiques sur le Moyen Atlas aux tables intimes dans les cours — chaque repas célèbre les saveurs amazighes.",
      reserveTable: "Réserver une Table",
      makeReservation: "Faire une Réservation",
      date: "Date",
      time: "Heure",
      guests: "Nombre de Convives",
      name: "Votre Nom",
      email: "Adresse E-mail",
      specialRequests: "Demandes Spéciales (facultatif)",
      confirm: "Confirmer la Réservation",
      reservationConfirmed: "Réservation Confirmée",
      lookForward: "Nous nous réjouissons de vous accueillir.",
      reservationFailed: "Réservation Échouée",
      tryAgain: "Veuillez réessayer ou contacter le concierge.",
    },

    gallery: {
      heading: "Galerie",
      subtext:
        "Un voyage visuel à travers les détails exquis, les paysages de montagne et la douce opulence de l'Hôtel Le Berbère.",
      categories: {
        all: "Toutes les Images",
        rooms: "Résidences",
        architecture: "Architecture",
        dining: "Gastronomie",
        spa: "Bien-être",
        lifestyle: "Art de Vivre",
      },
    },

    about: {
      heading: "Notre Histoire",
      eyebrow: "Né de l'Atlas",
      builtRestored: "Un nouveau chapitre. Un esprit intemporel.",
      storyPara1:
        "L'Hôtel Le Berbère est né d'un profond respect pour le peuple amazigh et le paysage spectaculaire du Moyen Atlas. Niché au cœur de Khénifra — une ville dont l'identité est indissociable de la culture amazighe — nous avons voulu créer un espace où authenticité et confort moderne coexistent en parfaite harmonie.",
      storyPara2:
        "Récemment ouvert, nous sommes un hôtel boutique avec une mission claire : offrir aux hôtes une expérience authentique de cette région. Chaque recoin de l'hôtel reflète l'art, la chaleur et la résilience du patrimoine amazigh — des tapis berbères tissés à la main au bois de cèdre sculpté, en passant par l'accueil chaleureux qui définit notre hospitalité.",
      philosophyEyebrow: "Notre Philosophie",
      philosophyQuote:
        "« Le vrai luxe, c'est d'être exactement là où l'on est — respirer l'air de cèdre des montagnes, écouter l'Oum Er-Rbia et se sentir chez soi parmi des gens fiers de partager leur culture. »",
      sustainabilityHeading: "Ancrés dans la Région",
      sustainabilityBody:
        "Nous croyons au développement de Khénifra et du Moyen Atlas. Notre cuisine travaille avec des agriculteurs et producteurs locaux. Nos meubles artisanaux proviennent d'artisans amazighs. Nous collaborons avec des guides locaux pour toutes nos excursions — car chaque dirham dépensé ici doit bénéficier à la communauté qui rend cet endroit si spécial.",
      stat1: "Cuisine Locale",
      stat2: "Artisanat Amazigh",
      stat3: "Communauté d'abord",
    },

    contact: {
      heading: "Contact & Localisation",
      subtext:
        "Que vous ayez besoin d'une réservation, d'un transfert ou d'assistance pour un itinéraire personnalisé dans le Moyen Atlas, notre équipe est à votre disposition.",
      address: "Adresse",
      telephone: "Téléphone",
      emailLabel: "E-mail",
      reception: "Réception",
      available24: "Disponible 24h/24",
      conciergeHeading: "Services Conciergerie",
      conciergeBody:
        "Notre équipe peut organiser des transferts, des visites privées des montagnes du Moyen Atlas, des excursions vers des sites culturels amazighs et des recommandations de restaurants locaux.",
      requestService: "Demander le Menu de Services",
      formHeading: "Envoyer une Demande",
      yourName: "Votre Nom",
      yourEmail: "Adresse E-mail",
      phone: "Téléphone (facultatif)",
      subject: "Objet",
      message: "Message",
      preferredContact: "Mode de Contact Préféré",
      send: "Envoyer",
      sending: "Envoi en cours...",
      inquirySent: "Demande Envoyée",
      conciergeContact: "Notre équipe vous contactera sous peu.",
      failedSend: "Échec de l'Envoi",
      tryAgain: "Veuillez réessayer ou nous contacter directement par téléphone.",
    },

    booking: {
      heading: "Réserver votre Séjour",
      checkIn: "Date d'Arrivée",
      checkOut: "Date de Départ",
      guests: "Voyageurs",
      guestCount: (n: number) => (n === 1 ? "1 Voyageur" : `${n} Voyageurs`),
      guestsPlus: "5+ Voyageurs",
      checkAvailability: "Vérifier la Disponibilité",
      selectRoom: "Choisissez votre Suite",
      selectRoomSub: "Sélectionnez parmi nos résidences disponibles pour vos dates.",
      guestDetails: "Informations Personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse E-mail",
      phone: "Numéro de Téléphone",
      specialRequests: "Demandes Spéciales",
      payment: "Paiement",
      cardNumber: "Numéro de Carte",
      expiry: "Expiration",
      cvv: "CVV",
      cardHolder: "Nom du Titulaire",
      confirmBook: "Confirmer & Réserver",
      confirmed: "Réservation Confirmée",
      confirmedMsg: "Nous nous réjouissons de vous accueillir à l'Hôtel Le Berbère.",
      confirmationCode: "Code de Confirmation",
      returnHome: "Retour à l'Accueil",
      nights: (n: number) => (n === 1 ? "1 nuit" : `${n} nuits`),
      totalPrice: "Prix Total",
      pricePerNight: "par nuit",
      bookSuite: "Réserver cette Suite",
      available: "Disponible",
      notAvailable: "Non Disponible",
    },

    footer: {
      tagline:
        "Un hôtel boutique de luxe ancré dans la culture amazighe et la beauté sauvage du Moyen Atlas, Khénifra.",
      explore: "Explorer",
      suites: "Suites & Chambres",
      experiences: "Expériences",
      fineDining: "Gastronomie",
      gallery: "Galerie",
      ourStory: "Notre Histoire",
      contact: "Contact",
      journal: "Le Journal",
      journalSub:
        "Abonnez-vous pour recevoir des informations sur nos offres exclusives, événements locaux et nouvelles expériences.",
      emailPlaceholder: "Adresse E-mail",
      join: "S'abonner",
      subscribedTitle: "Abonnement Réussi",
      subscribedDesc: "Bienvenue dans le journal de l'Hôtel Le Berbère.",
      subscribeFailTitle: "Échec de l'Abonnement",
      subscribeFailDesc: "Une erreur s'est produite. Veuillez réessayer.",
      rights: `© ${new Date().getFullYear()} Hôtel Le Berbère. Tous droits réservés.`,
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      admin: "Admin",
    },
  },
} as const;

export type Translations = typeof translations.en;
export default translations;
