/**
 * GSAP Initialization — registers ScrollTrigger plugin globally.
 * Renders nothing (returns null) — side-effect only component.
 * Must be mounted before any component uses ScrollTrigger animations.
 */
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger once at app level

export default function GsapInit() { return null; }
