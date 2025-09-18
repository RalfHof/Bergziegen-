"use client";

import React from "react";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Hero-Bereich */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1 className={styles.heading}>Willkommen bei den Bergziegen 🐐</h1>
          <p className={styles.subheading}>
            Wandern. Natur. Gemeinschaft. <br />
            Entdecke die schönsten Touren!
          </p>
        </div>
      </section>

      {/* Text-Bereich */}
      <section className={styles.section}>
        <p className={styles.text}>
          Willkommen bei unserer wanderbegeisterten Gemeinschaft! Entfliehe dem
          Alltag und tauche ein in die Wunder der Natur! Wir sind eine Gruppe
          von Wanderfreunden, die die Stille der Wälder, die frische Bergluft
          und die atemberaubenden Aussichten lieben. Gemeinsam suchen wir das
          Abenteuer auf anspruchsvollen Höhenmetern und genießen die tiefe
          Verbundenheit mit der Natur. Unsere Touren bieten dir die
          Möglichkeit, die Schönheit der Welt zu Fuß zu erleben und dich selbst
          wiederzufinden. Entdecke unsere Touren und finde dein nächstes
          Abenteuer!
        </p>
      </section>
    </main>
  );
}
