"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      const nextText = currentWord.slice(0, displayText.length - 1);
      setDisplayText(nextText);

      if (nextText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    } else {
      const nextText = currentWord.slice(0, displayText.length + 1);
      setDisplayText(nextText);

      if (nextText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    }
  }, [displayText, isDeleting, wordIndex, words, pauseTime]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return displayText;
}

export default function Hero() {
  const displayText = useTypewriter(personalInfo.roles, 80, 50, 2000);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dots" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-slate-50 dark:from-indigo-950/20 dark:via-transparent dark:to-slate-950" />

      {/* Decorative gradient orbs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />

      <div className="section-container relative z-10 py-20 text-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img
            src={personalInfo.avatar}
            alt={personalInfo.name}
            width={120}
            height={120}
            className="mx-auto h-28 w-28 rounded-full border-2 border-indigo-500/30 object-cover shadow-lg shadow-indigo-500/20 sm:h-32 sm:w-32"
          />
        </motion.div>

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 font-mono text-sm tracking-widest text-indigo-500 dark:text-indigo-400"
        >
          HELLO, I&apos;M
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">{personalInfo.name}</span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 h-8 sm:h-10"
        >
          <span className="font-mono text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            {displayText}
          </span>
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-typing-cursor bg-indigo-500 sm:h-6" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg"
        >
          {personalInfo.tagline}
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16 flex items-center justify-center gap-4"
        >
          {personalInfo.social.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.name}
                href={link.url}
                target={link.icon === "mail" ? undefined : "_blank"}
                rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700"
                aria-label={link.name}
              >
                {Icon && (
                  <Icon size={16} />
                )}
                <span className="hidden sm:inline">{link.name}</span>
              </a>
            );
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <a
            href="#about"
            className="inline-flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-indigo-500"
            aria-label="Scroll to about section"
          >
            <span className="text-xs font-medium uppercase tracking-widest">
              Scroll Down
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
