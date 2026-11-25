"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./sterling-gate-kinetic-navigation.css";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export interface KineticNavLink {
  label: string;
  href: string;
}

const DEFAULT_LINKS: KineticNavLink[] = [
  { label: "About us", href: "#about" },
  { label: "Our work", href: "#work" },
  { label: "Services", href: "#about" },
  { label: "Blog", href: "#work" },
  { label: "Contact us", href: "#contact" },
];

export interface KineticNavigationProps {
  /** Menu entries. Each one also drives one of the five ambient shapes. */
  links?: KineticNavLink[];
  /** Replaces the empty wordmark slot in the header. */
  logo?: React.ReactNode;
  logoHref?: string;
  menuLabel?: string;
  closeLabel?: string;
  /** Inline links in the header on wide screens. Hidden once the menu takes over. */
  showInlineLinks?: boolean;
  /** Sits next to the inline links, e.g. a contact button. */
  headerAction?: React.ReactNode;
  className?: string;
}

export function Component({
  links = DEFAULT_LINKS,
  logo,
  logoHref = "#top",
  menuLabel = "Menu",
  closeLabel = "Close",
  showInlineLinks = true,
  headerAction,
  className,
}: KineticNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initial setup, easing and the ambient shape hover.
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch (error) {
      console.warn("CustomEase failed to load, falling back to default.", error);
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(
        ".menu-list-item[data-shape]",
      );
      const shapesContainer = containerRef.current!.querySelector(
        ".ambient-background-shapes",
      );

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer
          ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`)
          : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          shapesContainer
            ?.querySelectorAll(".bg-shape")
            .forEach((sibling) => sibling.classList.remove("active"));
          shape.classList.add("active");

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            },
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => shape.classList.remove("active"),
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  // Menu open and close.
  useEffect(() => {
    if (!containerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector(".menu-content");
      const overlay = containerRef.current!.querySelector(".overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
      const fadeTargets =
        containerRef.current!.querySelectorAll("[data-menu-fade]");

      // Both live in the button rendered above, so they always resolve.
      const menuButtonTexts = containerRef.current!.querySelectorAll(
        ".nav-close-btn .menu-button-text p",
      );
      const menuButtonIcon = containerRef.current!.querySelector(
        ".nav-close-btn .menu-button-icon",
      )!;

      const tl = gsap.timeline();

      if (isMenuOpen) {
        // OPEN
        navWrap?.setAttribute("data-nav", "open");

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(
            menuButtonTexts,
            { yPercent: 0 },
            { yPercent: -100, stagger: 0.2 },
          )
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<",
          )
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35",
          );

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.04,
              clearProps: "all",
            },
            "<+=0.2",
          );
        }
      } else {
        // CLOSE
        navWrap?.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts, { yPercent: 0 }, "<")
          .to(menuButtonIcon, { rotate: 0 }, "<")
          .set(navWrap, { display: "none" });
      }

      // Nothing should travel for visitors who ask for less motion.
      if (reduceMotion) tl.progress(1);
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Hold the page still while the overlay is open.
  useEffect(() => {
    const root = document.documentElement;
    if (isMenuOpen) root.dataset.kineticMenu = "open";
    else delete root.dataset.kineticMenu;
    return () => {
      delete root.dataset.kineticMenu;
    };
  }, [isMenuOpen]);

  // Escape closes the overlay.
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((previous) => !previous);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className={className ? `sg-nav ${className}` : "sg-nav"}>
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row" aria-label="Primary">
              {logo ? (
                logo
              ) : (
                <a href={logoHref} aria-label="Home" className="nav-logo-row" />
              )}

              <div className="nav-row__right">
                {showInlineLinks ? (
                  <div className="nav-inline">
                    {links.map((link) => (
                      <a
                        key={`inline-${link.href}-${link.label}`}
                        href={link.href}
                        className="nav-inline-link link-line"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {headerAction}

                <button
                  type="button"
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-controls="kinetic-navigation"
                  aria-label={isMenuOpen ? closeLabel : menuLabel}
                >
                  <div className="menu-button-text" aria-hidden="true">
                    <p className="p-large">{menuLabel}</p>
                    <p className="p-large">{closeLabel}</p>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="menu-button-icon"
                    >
                      <path
                        d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" id="kinetic-navigation" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu} aria-hidden="true" />

          <nav className="menu-content" aria-label="Menu">
            <div className="menu-bg" aria-hidden="true">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />

              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(155,108,255,0.22)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(155,108,255,0.16)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(255,71,151,0.14)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(155,108,255,0.22)" />
                </svg>

                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(155,108,255,0.24)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(255,71,151,0.18)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(255,71,151,0.4)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(155,108,255,0.32)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(255,71,151,0.32)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(155,108,255,0.32)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(255,71,151,0.4)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(255,71,151,0.4)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(155,108,255,0.4)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(255,71,151,0.4)" />
                </svg>

                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(155,108,255,0.16)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(255,71,151,0.14)"
                  />
                </svg>

                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(155,108,255,0.2)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(255,71,151,0.16)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(155,108,255,0.14)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {links.map((link, index) => (
                  <li
                    className="menu-list-item"
                    data-shape={(index % 5) + 1}
                    key={`${link.href}-${link.label}`}
                  >
                    <a
                      href={link.href}
                      className="nav-link"
                      onClick={closeMenu}
                      data-menu-fade={index === links.length - 1 ? "" : undefined}
                    >
                      <p className="nav-link-text">{link.label}</p>
                      <div className="nav-link-hover-bg" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
