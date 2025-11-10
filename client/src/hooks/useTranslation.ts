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
      title: "Bedtime Stories, Personalized",
      subtitle: "Create magical audio stories for your children in their language, featuring them as the hero",
      cta: "Start Creating Stories",
      feature1: "Personalized Characters",
      feature1Desc: "Feature your child and their friends in every story",
      feature2: "Multilingual Audio",
      feature2Desc: "Stories in English, Spanish, French, and Latvian",
      feature3: "AI-Powered Magic",
      feature3Desc: "Unique stories every time, tailored to your choices"
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
      popular: "Most Popular",
      buy: "Buy Now",
      feature1: "Unlimited story previews",
      feature2: "High-quality audio generation",
      feature3: "Save stories forever"
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
      title: "Personalizēti Gulēšanas Stāsti",
      subtitle: "Izveidojiet maģiskus audio stāstus saviem bērniem viņu valodā",
      cta: "Sākt Veidot Stāstus",
      feature1: "Personalizēti Varoņi",
      feature1Desc: "Iekļaujiet savu bērnu un viņa draugus katrā stāstā",
      feature2: "Daudzvalodu Audio",
      feature2Desc: "Stāsti angļu, spāņu, franču un latviešu valodā",
      feature3: "AI Maģija",
      feature3Desc: "Unikāli stāsti katru reizi"
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
      popular: "Populārākais",
      buy: "Pirkt Tagad",
      feature1: "Neierobežoti stāstu priekšskatījumi",
      feature2: "Augstas kvalitātes audio ģenerēšana",
      feature3: "Saglabāt stāstus uz visiem laikiem"
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
      title: "Cuentos Personalizados para Dormir",
      subtitle: "Crea historias de audio mágicas para tus hijos en su idioma",
      cta: "Comenzar a Crear Historias",
      feature1: "Personajes Personalizados",
      feature1Desc: "Presenta a tu hijo y sus amigos en cada historia",
      feature2: "Audio Multilingüe",
      feature2Desc: "Historias en inglés, español, francés y letón",
      feature3: "Magia con IA",
      feature3Desc: "Historias únicas cada vez"
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
      popular: "Más Popular",
      buy: "Comprar Ahora",
      feature1: "Vistas previas ilimitadas",
      feature2: "Generación de audio de alta calidad",
      feature3: "Guarda historias para siempre"
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
      title: "Histoires Personnalisées pour le Coucher",
      subtitle: "Créez des histoires audio magiques pour vos enfants dans leur langue",
      cta: "Commencer à Créer des Histoires",
      feature1: "Personnages Personnalisés",
      feature1Desc: "Mettez en vedette votre enfant et ses amis dans chaque histoire",
      feature2: "Audio Multilingue",
      feature2Desc: "Histoires en anglais, espagnol, français et letton",
      feature3: "Magie de l'IA",
      feature3Desc: "Des histoires uniques à chaque fois"
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
      popular: "Le Plus Populaire",
      buy: "Acheter Maintenant",
      feature1: "Aperçus illimités",
      feature2: "Génération audio haute qualité",
      feature3: "Sauvegardez les histoires pour toujours"
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
