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
        "Discover a sanctuary of quiet opulence, hand-laid zellige tiles, and golden lantern light in the heart of Marrakech.",
      suitesHeading: "Signature Suites",
      suitesSubtext:
        "Residences designed for the most discerning travelers, featuring private courtyards and bespoke craftsmanship.",
      discoverSuite: "Discover Suite",
      viewAllRooms: "View All Rooms",
      wellnessEyebrow: "Wellness Sanctuary",
      wellnessHeading: "The Royal Hammam",
      wellnessBody:
        "Surrender to ancient Moroccan rituals in our underground marble sanctuary. Infused with eucalyptus, black soap, and pure argan oil, our spa experiences are designed to purify both body and soul.",
      exploreSpa: "Explore Spa Menu",
      guestBook: "Guest Book",
    },

    rooms: {
      heading: "Suites & Rooms",
      subtext:
        "Each of our residences is uniquely designed, featuring authentic Moroccan craftsmanship, antique furnishings, and modern amenities designed to offer ultimate comfort.",
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
        "Immerse yourself in the magic of Marrakech with our bespoke selection of wellness rituals, cultural encounters, and exclusive adventures.",
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
        "From rooftop terraces overlooking the medina to intimate courtyard tables — every meal is a ceremony.",
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
        "A visual journey through the exquisite details, lush courtyards, and quiet opulence of Hotel Le Berbère.",
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
      heading: "Our Heritage",
      eyebrow: "A Century of Elegance",
      builtRestored: "Built in 1923. Restored in 2019.",
      storyPara1:
        "Hotel Le Berbère began as the private residence of a prominent silk merchant. For decades, its heavy cedar doors shielded a sanctuary of quiet beauty from the bustling medina outside.",
      storyPara2:
        "When we acquired the property in 2017, our mission was simple: preserve the soul of the riad while elevating it to meet the expectations of the modern luxury traveler. We spent two years working exclusively with local artisans — master carvers, zellige tile layers, and tadelakt plasterers — to restore every inch of the estate by hand.",
      philosophyEyebrow: "Our Philosophy",
      philosophyQuote:
        '"True luxury is not loud. It is the texture of hand-woven linen, the scent of orange blossoms in the courtyard, and the feeling that time itself has decided to slow down."',
      sustainabilityHeading: "Sustainability Commitment",
      sustainabilityBody:
        "Our connection to the Atlas Mountains and the vibrant city of Marrakech comes with a responsibility to protect them. Hotel Le Berbère is a zero-single-use-plastic property. Our kitchens source 90% of ingredients from organic farms within a 50-kilometer radius, and our bath amenities are crafted locally using sustainably harvested argan oil and indigenous botanicals.",
      stat1: "Zero Single-Use Plastic",
      stat2: "Solar Water Heating",
      stat3: "Community Artisan Support",
    },

    contact: {
      heading: "Contact & Location",
      subtext:
        "Whether you require a reservation, transportation from the airport, or assistance crafting a personalized itinerary, our dedicated team is at your service.",
      address: "Address",
      telephone: "Telephone",
      emailLabel: "Email",
      reception: "Reception",
      available24: "Available 24 hours",
      conciergeHeading: "Les Clefs d'Or Concierge",
      conciergeBody:
        "Our concierge desk can arrange VIP airport transfers, private Medina tours, exclusive access to historical sites, and hard-to-get restaurant reservations.",
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
      conciergeContact: "Our concierge team will contact you shortly.",
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
        "Where old-world Moroccan craftsmanship meets modern luxury. A sanctuary in the foothills of the Atlas Mountains.",
      explore: "Explore",
      suites: "Suites & Rooms",
      experiences: "Experiences",
      fineDining: "Fine Dining",
      gallery: "Gallery",
      ourStory: "Our Story",
      contact: "Contact",
      journal: "The Journal",
      journalSub:
        "Subscribe to receive updates on exclusive offers, cultural events, and new culinary experiences.",
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
        "Découvrez un sanctuaire d'opulence tranquille, de zellige posé à la main et de lumière dorée de lanternes au cœur de Marrakech.",
      suitesHeading: "Suites Signature",
      suitesSubtext:
        "Des résidences conçues pour les voyageurs les plus exigeants, dotées de cours privées et d'une artisanat sur mesure.",
      discoverSuite: "Découvrir la Suite",
      viewAllRooms: "Voir Toutes les Chambres",
      wellnessEyebrow: "Sanctuaire du Bien-être",
      wellnessHeading: "Le Royal Hammam",
      wellnessBody:
        "Abandonnez-vous aux anciens rituels marocains dans notre sanctuaire souterrain en marbre. Infusées d'eucalyptus, de savon noir et d'huile d'argan pure, nos expériences spa sont conçues pour purifier le corps et l'âme.",
      exploreSpa: "Explorer le Menu Spa",
      guestBook: "Livre d'Or",
    },

    rooms: {
      heading: "Suites & Chambres",
      subtext:
        "Chacune de nos résidences est unique, alliant artisanat marocain authentique, mobilier ancien et équipements modernes pour un confort ultime.",
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
        "Plongez dans la magie de Marrakech avec notre sélection exclusive de rituels bien-être, de rencontres culturelles et d'aventures uniques.",
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
        "Des terrasses panoramiques sur la médina aux tables intimes dans les cours — chaque repas est une cérémonie.",
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
        "Un voyage visuel à travers les détails exquis, les cours verdoyantes et la douce opulence de l'Hôtel Le Berbère.",
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
      heading: "Notre Héritage",
      eyebrow: "Un Siècle d'Élégance",
      builtRestored: "Construit en 1923. Restauré en 2019.",
      storyPara1:
        "L'Hôtel Le Berbère fut la résidence privée d'un éminent marchand de soie. Pendant des décennies, ses lourdes portes en cèdre protégeaient un sanctuaire de beauté tranquille de l'agitation de la médina.",
      storyPara2:
        "Lorsque nous avons acquis la propriété en 2017, notre mission était simple : préserver l'âme du riad tout en l'élevant aux attentes du voyageur de luxe moderne. Nous avons passé deux ans à travailler exclusivement avec des artisans locaux — sculpteurs, poseurs de zellige et plâtriers en tadelakt — pour restaurer chaque centimètre de la demeure à la main.",
      philosophyEyebrow: "Notre Philosophie",
      philosophyQuote:
        "« Le vrai luxe n'est pas dans l'ostentation. Il est dans la texture du lin tissé à la main, le parfum des fleurs d'oranger dans la cour, et la sensation que le temps lui-même a décidé de ralentir. »",
      sustainabilityHeading: "Notre Engagement Durable",
      sustainabilityBody:
        "Notre lien avec les montagnes de l'Atlas et la ville de Marrakech s'accompagne d'une responsabilité de les protéger. L'Hôtel Le Berbère est une propriété zéro plastique à usage unique. Nos cuisines s'approvisionnent à 90 % auprès de fermes biologiques situées dans un rayon de 50 kilomètres, et nos soins de bain sont fabriqués localement à partir d'huile d'argan récoltée durablement.",
      stat1: "Zéro Plastique à Usage Unique",
      stat2: "Chauffage Solaire de l'Eau",
      stat3: "Soutien aux Artisans Locaux",
    },

    contact: {
      heading: "Contact & Localisation",
      subtext:
        "Que vous ayez besoin d'une réservation, d'un transfert depuis l'aéroport ou d'une assistance pour un itinéraire personnalisé, notre équipe dédiée est à votre disposition.",
      address: "Adresse",
      telephone: "Téléphone",
      emailLabel: "E-mail",
      reception: "Réception",
      available24: "Disponible 24h/24",
      conciergeHeading: "Concierge Les Clefs d'Or",
      conciergeBody:
        "Notre concierge peut organiser des transferts VIP, des visites privées de la Médina, un accès exclusif à des sites historiques et des réservations dans les meilleurs restaurants.",
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
      conciergeContact: "Notre équipe de concierge vous contactera sous peu.",
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
        "Où l'artisanat marocain d'antan rencontre le luxe moderne. Un sanctuaire au pied des montagnes de l'Atlas.",
      explore: "Explorer",
      suites: "Suites & Chambres",
      experiences: "Expériences",
      fineDining: "Gastronomie",
      gallery: "Galerie",
      ourStory: "Notre Histoire",
      contact: "Contact",
      journal: "Le Journal",
      journalSub:
        "Abonnez-vous pour recevoir des informations sur nos offres exclusives, événements culturels et nouvelles expériences culinaires.",
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
