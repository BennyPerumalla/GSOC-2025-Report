import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cone, Github, Linkedin, Menu, X } from "lucide-react";
import styles from "./SharedLayout.module.css";
import { ThemeModeSwitch } from "./ThemeModeSwitch";

interface SharedLayoutProps {
  children: ReactNode;
}

export const SharedLayout = ({ children }: SharedLayoutProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/documentation", label: "Documentation" },
  ];

  const handleNavigate = () => setMenuOpen(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo} onClick={handleNavigate}>
            <Cone className={styles.logoIcon} />
            <span className={styles.logoText}>Benny Perumalla</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Primary">
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

            {/* Mobile menu toggle */}
            <button
              className={styles.menuToggle}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Benny Perumalla</span>
              <button
                className={styles.menuClose}
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className={styles.mobileNav} aria-label="Mobile Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleNavigate}
                  className={`${styles.mobileNavLink} ${
                    location.pathname === link.href ? styles.active : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                className={styles.mobileNavLink}
                href="https://code.videolan.org/BY01R/vlc-gsoc-audio"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavigate}
              >
                Explore Code
              </a>
            </nav>

            <div className={styles.mobileActions}>
              <a
                href="https://github.com/BennyPerumalla"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileIconLink}
                aria-label="GitHub"
                onClick={handleNavigate}
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/benny-perumalla-a7ab6024a/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileIconLink}
                aria-label="LinkedIn"
                onClick={handleNavigate}
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              <ThemeModeSwitch />
            </div>
          </div>
          <button
            className={styles.backdrop}
            aria-label="Close menu backdrop"
            onClick={() => setMenuOpen(false)}
          />
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
