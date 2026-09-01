import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'

// Use public path — Vercel serves /public files as static assets with proper headers
const VIDEO_SRC = '/videos/output.mp4'

gsap.registerPlugin(ScrollTrigger)

const SCENES = [
  {
    tagline: 'Precision. Elegance. Celebration.',
    headingLines: ['Where Precision', 'Meets Celebration'],
    description:
      'Every celebration we style is a harmonious blend of architectural precision, bespoke florals, and immersive scenography — designed to leave a lasting impression.',
    linkText: 'Explore portfolio',
    linkHref: '#portfolio',
  },
  {
    tagline: '01 · Architectural Scenography',
    headingLines: ['Crafted With', 'Pure Intention'],
    description:
      'From 3D spatial blueprints to custom fabricated backdrops, our engineering foundation ensures every angle is balanced, breathtaking, and flawless.',
    linkText: 'Discover our craft',
    linkHref: '#craft',
  },
  {
    tagline: '02 · Sacred & Milestone Galas',
    headingLines: ['Moments That', 'Transcend Time'],
    description:
      'Traditional Indian wedding mandaps, enchanted fairy garden florals, and golden jubilee milestones curated with couture refinement.',
    linkText: 'View signature works',
    linkHref: '#services',
  },
  {
    tagline: '03 · Begin Your Story',
    headingLines: ["Let's Create Your", 'Next Masterpiece'],
    description:
      'Currently accepting reservations for upcoming luxury celebrations in Seattle, Bellevue, Kirkland, and destinations across the Pacific Northwest.',
    linkText: 'Start your creative brief →',
    linkHref: '#contact',
    highlightLink: true,
  },
]

export default function Hero() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  // 0. Fetch the video as a blob so seeking is instant (no network range requests)
  useEffect(() => {
    const controller = new AbortController()

    fetch(VIDEO_SRC, { signal: controller.signal })
      .then((res) => res.blob())
      .then((blob) => {
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob)
          videoRef.current.load()
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Fallback: use the direct URL if fetch fails
          if (videoRef.current) {
            videoRef.current.src = VIDEO_SRC
            videoRef.current.load()
          }
        }
      })

    return () => controller.abort()
  }, [])

  // 1. Lenis Smooth Momentum Scrolling Integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  // 2. GSAP ScrollTrigger Master Timeline
  useGSAP(() => {
    if (!videoRef.current || !containerRef.current) return

    videoRef.current.currentTime = 0

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrub synchronization
      },
    })

    // Video Scrub on 10-second normalized timeline
    const handleLoaded = () => {
      if (videoRef.current && videoRef.current.duration) {
        tl.to(
          videoRef.current,
          {
            currentTime: videoRef.current.duration,
            ease: 'none',
            duration: 10,
          },
          0
        )
      }
    }

    if (videoRef.current.readyState >= 1) {
      handleLoaded()
    } else {
      videoRef.current.onloadedmetadata = handleLoaded
    }

    // Fade out Center Bottom Scroll indicator as user scrolls down
    tl.to(
      scrollIndicatorRef.current,
      {
        opacity: 0,
        y: 15,
        duration: 1.0,
        ease: 'power2.out',
      },
      1.5
    )

    // ----------------------------------------------------
    // SCENE 0: (0s -> 2.2s)
    // ----------------------------------------------------
    tl.to('#scene-0-left', { y: -25, ease: 'none', duration: 2.0 }, 0)
    tl.to('#scene-0-right', { y: 20, ease: 'none', duration: 2.0 }, 0)
    tl.to(
      '.scene-0-line',
      {
        y: '-115%',
        opacity: 0,
        filter: 'blur(4px)',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      1.5
    )

    // ----------------------------------------------------
    // SCENE 1: (2.5s -> 4.8s)
    // ----------------------------------------------------
    tl.fromTo(
      '.scene-1-line',
      { y: '115%', opacity: 0, filter: 'blur(6px)' },
      {
        y: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.06,
        duration: 0.8,
        ease: 'power3.out',
      },
      2.5
    )
    tl.fromTo('#scene-1-left', { y: 20 }, { y: -25, ease: 'none', duration: 2.1 }, 2.5)
    tl.fromTo('#scene-1-right', { y: -15 }, { y: 20, ease: 'none', duration: 2.1 }, 2.5)
    tl.to(
      '.scene-1-line',
      {
        y: '-115%',
        opacity: 0,
        filter: 'blur(4px)',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.in',
      },
      4.6
    )

    // ----------------------------------------------------
    // SCENE 2: (5.2s -> 7.4s)
    // ----------------------------------------------------
    tl.fromTo(
      '.scene-2-line',
      { y: '115%', opacity: 0, filter: 'blur(6px)' },
      {
        y: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.06,
        duration: 0.8,
        ease: 'power3.out',
      },
      5.2
    )
    tl.fromTo('#scene-2-left', { y: 20 }, { y: -25, ease: 'none', duration: 2.0 }, 5.2)
    tl.fromTo('#scene-2-right', { y: -15 }, { y: 20, ease: 'none', duration: 2.0 }, 5.2)
    tl.to(
      '.scene-2-line',
      {
        y: '-115%',
        opacity: 0,
        filter: 'blur(4px)',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.in',
      },
      7.2
    )

    // ----------------------------------------------------
    // SCENE 3: (7.8s -> 10.0s Finale)
    // ----------------------------------------------------
    tl.fromTo(
      '.scene-3-line',
      { y: '115%', opacity: 0, filter: 'blur(6px)' },
      {
        y: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.07,
        duration: 0.9,
        ease: 'power3.out',
      },
      7.8
    )
    tl.fromTo('#scene-3-left', { y: 25 }, { y: 0, ease: 'power2.out', duration: 1.5 }, 7.8)
    tl.fromTo('#scene-3-right', { y: -20 }, { y: 0, ease: 'power2.out', duration: 1.5 }, 7.8)
  }, [])

  return (
    <div ref={containerRef} className="scroll-container">
      {/* Fixed Fullscreen Background Video */}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        {/* Soft dark vignette overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* Fixed Viewport Layer for Dynamic Kinetic Bottom Section */}
      <div className="fixed inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 md:p-14 pointer-events-none">
        {/* Dynamic Storytelling Bottom Section */}
        <div className="relative w-full min-h-[230px] sm:min-h-[210px] md:min-h-[200px]">
          {SCENES.map((scene, index) => (
            <div
              key={scene.tagline}
              className="absolute bottom-0 left-0 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8 sm:gap-12"
            >
              {/* Left Headline with Masked Lines & Parallax */}
              <div
                id={`scene-${index}-left`}
                className="pointer-events-auto space-y-1 sm:space-y-1.5 text-left max-w-xl"
              >
                <div className="overflow-hidden pb-1">
                  <p
                    className={`scene-${index}-line font-sans text-xs sm:text-sm text-[#efefef]/80 tracking-wide`}
                  >
                    {scene.tagline}
                  </p>
                </div>
                {scene.headingLines.map((line) => (
                  <div key={line} className="overflow-hidden pb-1.5">
                    <h2
                      className={`scene-${index}-line font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#e7d393] leading-[1.08] tracking-tight font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]`}
                    >
                      {line}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Right Paragraph & Action */}
              <div
                id={`scene-${index}-right`}
                className="pointer-events-auto max-w-xs sm:max-w-sm flex flex-col items-start text-left space-y-3.5"
              >
                <div className="overflow-hidden">
                  <p
                    className={`scene-${index}-line font-sans text-xs sm:text-sm text-white/85 font-light leading-relaxed drop-shadow-md`}
                  >
                    {scene.description}
                  </p>
                </div>
                <div className="overflow-hidden pt-1">
                  <a
                    href={scene.linkHref}
                    className={`scene-${index}-line inline-block font-sans text-xs sm:text-sm transition-colors underline underline-offset-8 cursor-pointer ${scene.highlightLink
                      ? 'text-[#e7d393] font-semibold hover:text-white decoration-[#e7d393] hover:decoration-white'
                      : 'text-white font-medium hover:text-[#e7d393] decoration-white/40 hover:decoration-[#e7d393]'
                      }`}
                  >
                    {scene.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Bottom Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1.5 opacity-80 select-none"
        >
          <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.28em] uppercase text-[#efefef]/70 font-light">
            Scroll
          </span>
          <svg
            className="w-4 h-5 text-[#e7d393] animate-bounce"
            fill="none"
            viewBox="0 0 24 36"
            stroke="currentColor"
          >
            <line x1="12" y1="2" x2="12" y2="24" strokeWidth="1.5" />
            <polyline points="7,19 12,25 17,19" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
