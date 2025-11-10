import { useLanguage } from '@/contexts/LanguageContext';

const translations: Record<string, Record<string, any>> = {
  en: {
    nav: {
      create: "Create Story",
      bookshelf: "My Stories",
      buyCredits: "Buy Credits",
      credits: "Credits",
      login: "Login",
      logout: "Logout"
    },
    landing: {
      seo: {
        title: "Personalized Audio Bedtime Stories for Children | Magical Storytelling in 4 Languages",
        description: "Create magical 10-minute audio bedtime stories featuring your child as the hero. AI-powered personalization in English, Spanish, French & Latvian. Start with 3 free credits!"
      },
      title: "Bedtime Stories, Starring Your Child",
      subtitle: "Magical, 10-minute audio stories in your language, ready for bedtime. Personalized in seconds.",
      cta: "Start Your First Story (3 Free Credits)",
      ctaButton: "Get Started",
      howItWorks: {
        title: "Create Magic in 3 Simple Steps",
        step1Title: "Personalize",
        step1Desc: "Add your child's name, friends, and even pets to be the stars of the story.",
        step2Title: "Generate",
        step2Desc: "Choose a magical theme like 'Space Adventure' or write your own custom story idea.",
        step3Title: "Listen",
        step3Desc: "Get a 10-minute, high-quality audio story in your language, ready for bedtime."
      },
      feature1: {
        badge: "For Every Family",
        title: "In Your Language, In Your Voice",
        desc: "Our stories sound natural, not robotic. Thanks to our advanced AI editor, you get grammatically perfect stories in Latvian, Spanish, French, and English."
      },
      feature2: {
        badge: "Truly Personal",
        title: "Your Child is the Star of the Show",
        desc: "Go beyond just a name. Add siblings, friends, and even family pets to join the adventure. Choose from illustrated themes or write your own unique story."
      },
      upsell: {
        title: "Even More Magic is Coming Soon",
        voiceTitle: "Read in Your Voice",
        voiceDesc: "Our most-requested feature. Securely clone your own voice to become the narrator of every magical story.",
        bookTitle: "A Book to Keep Forever",
        bookDesc: "Turn your child's favorite generated story into a beautiful, professionally printed hardcover book. The perfect gift."
      },
      pricing: {
        title: "Choose Your Adventure",
        subtitle: "Start for free. Buy credits as you go. No subscriptions, no hidden fees. Your credits never expire.",
        getStarted: "Get Started",
        stories: "stories",
        unlimitedPreviews: "Unlimited story previews",
        saveForever: "Save stories forever"
      },
      finalCta: {
        title: "Give the Gift of Imagination",
        subtitle: "Your first 3 stories are on us. Create an account and make bedtime magical tonight."
      }
    },
    themes: {
      "Space Adventure": "Space Adventure",
      "Under the Sea": "Under the Sea",
      "Dinosaurs": "Dinosaurs",
      "Magical Forest": "Magical Forest",
      "Farm Friends": "Farm Friends",
      "Pirate Treasure Hunt": "Pirate Treasure Hunt",
      "Princess Castle": "Princess Castle",
      "Jungle Safari": "Jungle Safari",
      "Arctic Animals": "Arctic Animals",
      "Superhero Mission": "Superhero Mission",
      "Dragon Quest": "Dragon Quest",
      "Fairy Garden": "Fairy Garden",
      "Robot Workshop": "Robot Workshop",
      "Ocean Treasure": "Ocean Treasure",
      "Time Travel Adventure": "Time Travel Adventure"
    },
    creator: {
      title: "Create Your Story",
      heroName: "Main Character Name",
      heroPlaceholder: "Enter your child's name",
      addName: "Add Another Name",
      namePlaceholder: "Friend, sibling, or pet name",
      chooseTheme: "Choose a Theme",
      customPrompt: "Write Your Own Story Idea",
      theme: "Theme",
      customPromptPlaceholder: "Describe your story idea...",
      generatePreview: "Generate Story Preview",
      tryAgain: "Try Again (Free)",
      createAudio: "Create Audio & Save (1 Credit)",
      preview: "Story Preview",
      generating: "Generating your story...",
      creatingAudio: "Creating audio...",
    },
    bookshelf: {
      title: "My Stories",
      empty: "No stories yet",
      emptyDesc: "Create your first personalized story!",
      createFirst: "Create Story"
    },
    credits: {
      title: "Buy Credits",
      current: "Current Balance",
      label: "Credits",
      popular: "Most Popular",
      buy: "Buy Now",
      feature1: "Unlimited story previews",
      feature2: "High-quality audio generation",
      feature3: "Save stories forever",
      feature: {
        audio: "audio stories",
        previews: "Unlimited story previews",
        save: "Save stories forever"
      }
    },
    errors: {
      noCredits: "You're out of credits! Purchase more to continue.",
      audioFailed: "Audio generation failed. Please try again.",
      tryAgain: "Please try again in a moment.",
      unauthorized: "You are logged out. Logging in again..."
    }
  },
  lv: {
    nav: {
      create: "Izveidot Stāstu",
      bookshelf: "Mani Stāsti",
      buyCredits: "Pirkt Kredītus",
      credits: "Kredīti",
      login: "Pieslēgties",
      logout: "Izrakstīties"
    },
    landing: {
      seo: {
        title: "Personalizēti Audio Gulēšanas Stāsti Bērniem | Maģiska Stāstu Stāstīšana 4 Valodās",
        description: "Izveidojiet maģiskus 10 minūšu audio gulēšanas stāstus, kuros jūsu bērns ir varonis. AI personalizācija latviešu, angļu, spāņu un franču valodās. Sāciet ar 3 bezmaksas kredītiem!"
      },
      title: "Gulēšanas Stāsti ar Jūsu Bērnu Galvenajā Lomā",
      subtitle: "Maģiski, 10 minūšu audio stāsti jūsu valodā, gatavi gulēšanai. Personalizēti sekundēs.",
      cta: "Sāciet Savu Pirmo Stāstu (3 Bezmaksas Kredīti)",
      ctaButton: "Sākt",
      howItWorks: {
        title: "Radiet Maģiju 3 Vienkāršos Soļos",
        step1Title: "Personalizējiet",
        step1Desc: "Pievienojiet sava bērna vārdu, draugus un pat mājdzīvniekus, lai viņi būtu stāsta zvaigznes.",
        step2Title: "Ģenerējiet",
        step2Desc: "Izvēlieties maģisku tēmu, piemēram, 'Kosmosa Piedzīvojums', vai uzrakstiet savu stāsta ideju.",
        step3Title: "Klausieties",
        step3Desc: "Saņemiet 10 minūšu, augstas kvalitātes audio stāstu savā valodā, gatavu gulēšanai."
      },
      feature1: {
        badge: "Katrai Ģimenei",
        title: "Jūsu Valodā, Jūsu Balsī",
        desc: "Mūsu stāsti skan dabīgi, nevis robotiski. Pateicoties mūsu progresīvajam AI redaktoram, jūs saņemat gramatiski perfektus stāstus latviešu, spāņu, franču un angļu valodās."
      },
      feature2: {
        badge: "Patiesi Personisks",
        title: "Jūsu Bērns ir Šova Zvaigzne",
        desc: "Ejiet tālāk par vienkārši vārdu. Pievienojiet brāļus/māsas, draugus un pat ģimenes mājdzīvniekus piedzīvojumam. Izvēlieties no ilustrētām tēmām vai uzrakstiet savu unikālo stāstu."
      },
      upsell: {
        title: "Vēl Vairāk Maģijas Drīzumā",
        voiceTitle: "Lasiet Savā Balsī",
        voiceDesc: "Mūsu visvairāk pieprasītā funkcija. Droši klonējiet savu balsi, lai kļūtu par katra maģiskā stāsta stāstītāju.",
        bookTitle: "Grāmata, Ko Paturēt Mūžīgi",
        bookDesc: "Pārvērtiet sava bērna iecienītāko ģenerēto stāstu skaistā, profesionāli iespiestā cietā vāka grāmatā. Ideāla dāvana."
      },
      pricing: {
        title: "Izvēlieties Savu Piedzīvojumu",
        subtitle: "Sāciet bez maksas. Pērciet kredītus pēc vajadzības. Nav abonementu, nav slēptu maksu. Jūsu kredīti nekad nebeidzas.",
        getStarted: "Sākt",
        stories: "stāsti",
        unlimitedPreviews: "Neierobežoti stāstu priekšskatījumi",
        saveForever: "Saglabāt stāstus uz visiem laikiem"
      },
      finalCta: {
        title: "Dāviniet Iztēles Dāvanu",
        subtitle: "Jūsu pirmie 3 stāsti ir no mums. Izveidojiet kontu un padariet gulēšanu maģisku šovakar."
      }
    },
    themes: {
      "Space Adventure": "Kosmosa Piedzīvojums",
      "Under the Sea": "Zem Jūras",
      "Dinosaurs": "Dinozauri",
      "Magical Forest": "Maģiskais Mežs",
      "Farm Friends": "Fermas Draugi",
      "Pirate Treasure Hunt": "Pirātu Dārgumu Medības",
      "Princess Castle": "Princesu Pils",
      "Jungle Safari": "Džungļu Safarī",
      "Arctic Animals": "Arktikas Dzīvnieki",
      "Superhero Mission": "Varoņa Misija",
      "Dragon Quest": "Pūķa Misija",
      "Fairy Garden": "Fēju Dārzs",
      "Robot Workshop": "Robotu Darbnīca",
      "Ocean Treasure": "Okeāna Dārgumi",
      "Time Travel Adventure": "Ceļojums Laikā"
    },
    creator: {
      title: "Izveidot Stāstu",
      heroName: "Galvenā Varoņa Vārds",
      heroPlaceholder: "Ievadiet sava bērna vārdu",
      addName: "Pievienot Vārdu",
      namePlaceholder: "Drauga, brāļa/māsas vai mājdzīvnieka vārds",
      chooseTheme: "Izvēlēties Tēmu",
      customPrompt: "Uzrakstiet Savu Stāsta Ideju",
      theme: "Tēma",
      customPromptPlaceholder: "Aprakstiet savu stāsta ideju...",
      generatePreview: "Ģenerēt Stāsta Priekšskatījumu",
      tryAgain: "Mēģināt Vēlreiz (Bezmaksas)",
      createAudio: "Izveidot Audio un Saglabāt (1 Kredīts)",
      preview: "Stāsta Priekšskatījums",
      generating: "Ģenerē jūsu stāstu...",
      creatingAudio: "Izveido audio...",
    },
    bookshelf: {
      title: "Mani Stāsti",
      empty: "Pagaidām nav stāstu",
      emptyDesc: "Izveidojiet savu pirmo personalizēto stāstu!",
      createFirst: "Izveidot Stāstu"
    },
    credits: {
      title: "Pirkt Kredītus",
      current: "Pašreizējais Atlikums",
      label: "Kredīti",
      popular: "Populārākais",
      buy: "Pirkt Tagad",
      feature1: "Neierobežoti stāstu priekšskatījumi",
      feature2: "Augstas kvalitātes audio ģenerēšana",
      feature3: "Saglabāt stāstus uz visiem laikiem",
      feature: {
        audio: "audio stāsti",
        previews: "Neierobežoti stāstu priekšskatījumi",
        save: "Saglabāt stāstus uz visiem laikiem"
      }
    },
    errors: {
      noCredits: "Jums vairs nav kredītu! Iegādājieties vairāk, lai turpinātu.",
      audioFailed: "Audio ģenerēšana neizdevās. Lūdzu, mēģiniet vēlreiz.",
      tryAgain: "Lūdzu, mēģiniet vēlreiz pēc brīža.",
      unauthorized: "Jūs esat atteicies. Pieslēdzas vēlreiz..."
    }
  },
  es: {
    nav: {
      create: "Crear Historia",
      bookshelf: "Mis Historias",
      buyCredits: "Comprar Créditos",
      credits: "Créditos",
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión"
    },
    landing: {
      seo: {
        title: "Cuentos de Audio Personalizados para Niños | Narración Mágica en 4 Idiomas",
        description: "Crea cuentos de audio mágicos de 10 minutos con tu hijo como protagonista. Personalización con IA en español, inglés, francés y letón. ¡Comienza con 3 créditos gratis!"
      },
      title: "Cuentos para Dormir, Protagonizados por tu Hijo",
      subtitle: "Historias de audio mágicas de 10 minutos en tu idioma, listas para la hora de dormir. Personalizadas en segundos.",
      cta: "Comienza tu Primera Historia (3 Créditos Gratis)",
      ctaButton: "Empezar",
      howItWorks: {
        title: "Crea Magia en 3 Pasos Simples",
        step1Title: "Personalizar",
        step1Desc: "Agrega el nombre de tu hijo, amigos e incluso mascotas para que sean las estrellas de la historia.",
        step2Title: "Generar",
        step2Desc: "Elige un tema mágico como 'Aventura Espacial' o escribe tu propia idea de historia personalizada.",
        step3Title: "Escuchar",
        step3Desc: "Obtén una historia de audio de alta calidad de 10 minutos en tu idioma, lista para la hora de dormir."
      },
      feature1: {
        badge: "Para Cada Familia",
        title: "En Tu Idioma, Con Tu Voz",
        desc: "Nuestras historias suenan naturales, no robóticas. Gracias a nuestro editor de IA avanzado, obtienes historias gramaticalmente perfectas en letón, español, francés e inglés."
      },
      feature2: {
        badge: "Verdaderamente Personal",
        title: "Tu Hijo es la Estrella del Espectáculo",
        desc: "Ve más allá de solo un nombre. Agrega hermanos, amigos e incluso mascotas familiares para unirse a la aventura. Elige entre temas ilustrados o escribe tu propia historia única."
      },
      upsell: {
        title: "Aún Más Magia Próximamente",
        voiceTitle: "Lee con Tu Voz",
        voiceDesc: "Nuestra función más solicitada. Clona tu propia voz de forma segura para convertirte en el narrador de cada historia mágica.",
        bookTitle: "Un Libro para Guardar Siempre",
        bookDesc: "Convierte la historia generada favorita de tu hijo en un hermoso libro de tapa dura impreso profesionalmente. El regalo perfecto."
      },
      pricing: {
        title: "Elige Tu Aventura",
        subtitle: "Comienza gratis. Compra créditos según necesites. Sin suscripciones, sin tarifas ocultas. Tus créditos nunca expiran.",
        getStarted: "Empezar",
        stories: "historias",
        unlimitedPreviews: "Vistas previas ilimitadas",
        saveForever: "Guarda historias para siempre"
      },
      finalCta: {
        title: "Regala el Don de la Imaginación",
        subtitle: "Tus primeras 3 historias corren por nuestra cuenta. Crea una cuenta y haz que la hora de dormir sea mágica esta noche."
      }
    },
    themes: {
      "Space Adventure": "Aventura Espacial",
      "Under the Sea": "Bajo el Mar",
      "Dinosaurs": "Dinosaurios",
      "Magical Forest": "Bosque Mágico",
      "Farm Friends": "Amigos de la Granja",
      "Pirate Treasure Hunt": "Búsqueda del Tesoro Pirata",
      "Princess Castle": "Castillo de Princesas",
      "Jungle Safari": "Safari en la Selva",
      "Arctic Animals": "Animales Árticos",
      "Superhero Mission": "Misión de Superhéroe",
      "Dragon Quest": "Búsqueda del Dragón",
      "Fairy Garden": "Jardín de Hadas",
      "Robot Workshop": "Taller de Robots",
      "Ocean Treasure": "Tesoro del Océano",
      "Time Travel Adventure": "Aventura en el Tiempo"
    },
    creator: {
      title: "Crear Tu Historia",
      heroName: "Nombre del Personaje Principal",
      heroPlaceholder: "Ingresa el nombre de tu hijo",
      addName: "Agregar Otro Nombre",
      namePlaceholder: "Nombre de amigo, hermano o mascota",
      chooseTheme: "Elegir un Tema",
      customPrompt: "Escribe Tu Propia Idea de Historia",
      theme: "Tema",
      customPromptPlaceholder: "Describe tu idea de historia...",
      generatePreview: "Generar Vista Previa",
      tryAgain: "Intentar de Nuevo (Gratis)",
      createAudio: "Crear Audio y Guardar (1 Crédito)",
      preview: "Vista Previa de la Historia",
      generating: "Generando tu historia...",
      creatingAudio: "Creando audio...",
    },
    bookshelf: {
      title: "Mis Historias",
      empty: "Aún no hay historias",
      emptyDesc: "¡Crea tu primera historia personalizada!",
      createFirst: "Crear Historia"
    },
    credits: {
      title: "Comprar Créditos",
      current: "Saldo Actual",
      label: "Créditos",
      popular: "Más Popular",
      buy: "Comprar Ahora",
      feature1: "Vistas previas ilimitadas",
      feature2: "Generación de audio de alta calidad",
      feature3: "Guarda historias para siempre",
      feature: {
        audio: "historias de audio",
        previews: "Vistas previas ilimitadas",
        save: "Guarda historias para siempre"
      }
    },
    errors: {
      noCredits: "¡Te quedaste sin créditos! Compra más para continuar.",
      audioFailed: "La generación de audio falló. Por favor, inténtalo de nuevo.",
      tryAgain: "Por favor, inténtalo de nuevo en un momento.",
      unauthorized: "Has cerrado sesión. Iniciando sesión de nuevo..."
    }
  },
  fr: {
    nav: {
      create: "Créer une Histoire",
      bookshelf: "Mes Histoires",
      buyCredits: "Acheter des Crédits",
      credits: "Crédits",
      login: "Se Connecter",
      logout: "Se Déconnecter"
    },
    landing: {
      seo: {
        title: "Histoires Audio Personnalisées pour Enfants | Narration Magique en 4 Langues",
        description: "Créez des histoires audio magiques de 10 minutes avec votre enfant en héros. Personnalisation IA en français, anglais, espagnol et letton. Commencez avec 3 crédits gratuits !"
      },
      title: "Histoires pour le Coucher, Vedettant Votre Enfant",
      subtitle: "Histoires audio magiques de 10 minutes dans votre langue, prêtes pour le coucher. Personnalisées en quelques secondes.",
      cta: "Commencez Votre Première Histoire (3 Crédits Gratuits)",
      ctaButton: "Commencer",
      howItWorks: {
        title: "Créez de la Magie en 3 Étapes Simples",
        step1Title: "Personnaliser",
        step1Desc: "Ajoutez le nom de votre enfant, ses amis et même ses animaux de compagnie pour qu'ils soient les stars de l'histoire.",
        step2Title: "Générer",
        step2Desc: "Choisissez un thème magique comme 'Aventure Spatiale' ou écrivez votre propre idée d'histoire personnalisée.",
        step3Title: "Écouter",
        step3Desc: "Obtenez une histoire audio de haute qualité de 10 minutes dans votre langue, prête pour le coucher."
      },
      feature1: {
        badge: "Pour Chaque Famille",
        title: "Dans Votre Langue, Avec Votre Voix",
        desc: "Nos histoires sonnent naturelles, pas robotiques. Grâce à notre éditeur IA avancé, vous obtenez des histoires grammaticalement parfaites en letton, espagnol, français et anglais."
      },
      feature2: {
        badge: "Vraiment Personnel",
        title: "Votre Enfant est la Star du Spectacle",
        desc: "Allez au-delà d'un simple nom. Ajoutez des frères et sœurs, des amis et même des animaux de compagnie pour rejoindre l'aventure. Choisissez parmi des thèmes illustrés ou écrivez votre propre histoire unique."
      },
      upsell: {
        title: "Encore Plus de Magie Bientôt",
        voiceTitle: "Lisez avec Votre Voix",
        voiceDesc: "Notre fonctionnalité la plus demandée. Clonez votre propre voix en toute sécurité pour devenir le narrateur de chaque histoire magique.",
        bookTitle: "Un Livre à Garder Pour Toujours",
        bookDesc: "Transformez l'histoire générée préférée de votre enfant en un beau livre relié imprimé professionnellement. Le cadeau parfait."
      },
      pricing: {
        title: "Choisissez Votre Aventure",
        subtitle: "Commencez gratuitement. Achetez des crédits selon vos besoins. Pas d'abonnements, pas de frais cachés. Vos crédits n'expirent jamais.",
        getStarted: "Commencer",
        stories: "histoires",
        unlimitedPreviews: "Aperçus illimités",
        saveForever: "Sauvegardez les histoires pour toujours"
      },
      finalCta: {
        title: "Offrez le Cadeau de l'Imagination",
        subtitle: "Vos 3 premières histoires sont offertes. Créez un compte et rendez le coucher magique ce soir."
      }
    },
    themes: {
      "Space Adventure": "Aventure Spatiale",
      "Under the Sea": "Sous la Mer",
      "Dinosaurs": "Dinosaures",
      "Magical Forest": "Forêt Magique",
      "Farm Friends": "Amis de la Ferme",
      "Pirate Treasure Hunt": "Chasse au Trésor des Pirates",
      "Princess Castle": "Château de Princesse",
      "Jungle Safari": "Safari dans la Jungle",
      "Arctic Animals": "Animaux de l'Arctique",
      "Superhero Mission": "Mission de Super-Héros",
      "Dragon Quest": "Quête du Dragon",
      "Fairy Garden": "Jardin des Fées",
      "Robot Workshop": "Atelier de Robots",
      "Ocean Treasure": "Trésor de l'Océan",
      "Time Travel Adventure": "Aventure dans le Temps"
    },
    creator: {
      title: "Créer Votre Histoire",
      heroName: "Nom du Personnage Principal",
      heroPlaceholder: "Entrez le nom de votre enfant",
      addName: "Ajouter un Autre Nom",
      namePlaceholder: "Nom d'ami, de frère/sœur ou d'animal",
      chooseTheme: "Choisir un Thème",
      customPrompt: "Écrivez Votre Propre Idée d'Histoire",
      theme: "Thème",
      customPromptPlaceholder: "Décrivez votre idée d'histoire...",
      generatePreview: "Générer l'Aperçu",
      tryAgain: "Réessayer (Gratuit)",
      createAudio: "Créer l'Audio et Sauvegarder (1 Crédit)",
      preview: "Aperçu de l'Histoire",
      generating: "Génération de votre histoire...",
      creatingAudio: "Création de l'audio...",
    },
    bookshelf: {
      title: "Mes Histoires",
      empty: "Pas encore d'histoires",
      emptyDesc: "Créez votre première histoire personnalisée !",
      createFirst: "Créer une Histoire"
    },
    credits: {
      title: "Acheter des Crédits",
      current: "Solde Actuel",
      label: "Crédits",
      popular: "Le Plus Populaire",
      buy: "Acheter Maintenant",
      feature1: "Aperçus illimités",
      feature2: "Génération audio haute qualité",
      feature3: "Sauvegardez les histoires pour toujours",
      feature: {
        audio: "histoires audio",
        previews: "Aperçus illimités",
        save: "Sauvegardez les histoires pour toujours"
      }
    },
    errors: {
      noCredits: "Vous n'avez plus de crédits ! Achetez-en plus pour continuer.",
      audioFailed: "La génération audio a échoué. Veuillez réessayer.",
      tryAgain: "Veuillez réessayer dans un moment.",
      unauthorized: "Vous êtes déconnecté. Reconnexion..."
    }
  }
};

export function useTranslation() {
  const { currentLang } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[currentLang];

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return { t };
}
