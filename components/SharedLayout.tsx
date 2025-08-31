import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cone, Github, Linkedin } from "lucide-react";
import styles from "./SharedLayout.module.css";

interface SharedLayoutProps {
  children: ReactNode;
}

export const SharedLayout = ({ children }: SharedLayoutProps) => {
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/documentation", label: "Documentation" },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <Cone className={styles.logoIcon} />
            <span className={styles.logoText}>Benny Perumalla</span>
          </Link>
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${styles.navLink} ${
                  location.pathname === link.href ? styles.active : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.headerActions}>
            <a
              href="https://github.com/BennyPerumalla"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              aria-label="Benny Perumalla GitHub Repository"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/benny-perumalla-a7ab6024a/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              aria-label="Benny Perumalla LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Advanced Audio Processing for VLC. All Rights Reserved.</p>
          <div className={styles.footerWaveform}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
      </footer>
    </div>
  );
};