// tailwind.config.js
// Dies ist die korrigierte Version mit den Pfaden,
// wo Tailwind nach Klassennamen suchen soll.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // WICHTIG: Hier sind die Pfade zu deinen Dateien, die Tailwind-Klassen verwenden.
    './app/**/*.{js,ts,jsx,tsx,mdx}',       // F\u00FCr App Router Seiten, Layouts etc.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',     // F\u00FCr Pages Router Seiten (falls verwendet)
    './components/**/*.{js,ts,jsx,tsx,mdx}',// F\u00FCr Komponenten im components Ordner
    './src/**/*.{js,ts,jsx,tsx,mdx}',       // Ein allgemeiner Pfad, falls du Code direkt in src hast
    
    // F\u00FCge hier weitere spezifische Pfade hinzu, wenn du Tailwind-Klassen
    // in anderen Verzeichnissen oder Dateitypen verwendest.
  ],
  theme: {
    extend: {
      // Hier kannst du dein Tailwind-Theme erweitern
    },
  },
  plugins: [
    // Hier kannst du Tailwind Plugins hinzuf\u00FCgen
  ],
}