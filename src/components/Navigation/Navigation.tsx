import { useEffect, useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, smoothScrollTo } from '../../lib/gsap-config'
import { Home, Briefcase, Shield, Users, Image, ScrollText } from 'lucide-react'
import siteConfig from '../../config/site.config.json'
import { BottomNavigation } from './BottomNavigation'

const navItems = [
  { id: 'home', label: 'Home', href: '#home', icon: <Home className="w-5 h-5" /> },
  { id: 'features', label: 'Features', href: '#features', icon: <Shield className="w-5 h-5" /> },
  { id: 'jobs', label: 'Jobs', href: '#jobs', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'rules', label: 'Rules', href: '#rules', icon: <ScrollText className="w-5 h-5" /> },
  { id: 'team', label: 'Team', href: '#team', icon: <Users className="w-5 h-5" /> },
  { id: 'gallery', label: 'Gallery', href: '#gallery', icon: <Image className="w-5 h-5" /> }
]

export const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Return mobile navigation for mobile devices
  if (isMobile) {
    return <BottomNavigation />
  }

  // Desktop navigation continues below
  return <DesktopNavigation />
}

const DesktopNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navRef = useRef<HTMLElement>(null)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initial check on mount
  useEffect(() => {
    // Ensure home is active on initial load when at top
    if (window.scrollY < 100) {
      setActiveSection('home')
    }
  }, [])


  // Setup scroll-triggered active states
  useGSAP(() => {
    // Home section special handling
    ScrollTrigger.create({
      id: 'nav-home',
      trigger: '#home',
      start: 'top top',
      end: 'bottom top+=80',
      onEnter: () => setActiveSection('home'),
      onEnterBack: () => setActiveSection('home'),
      onLeaveBack: () => setActiveSection('home')
    })
    
    // Setup scroll-triggered active states with unique IDs
    navItems.forEach((item) => {
      if (item.id !== 'home') {
        ScrollTrigger.create({
          id: `nav-${item.id}`,
          trigger: `#${item.id}`,
          start: 'top top+=80',  // Account for fixed navbar height
          end: 'bottom top+=80',
          onEnter: () => setActiveSection(item.id),
          onEnterBack: () => setActiveSection(item.id)
        })
      }
    })
    
    // Refresh and sort triggers after creation
    ScrollTrigger.refresh()
    ScrollTrigger.sort()

    // Cleanup function
    return () => {
      navItems.forEach((item) => {
        const trigger = ScrollTrigger.getById(`nav-${item.id}`)
        if (trigger) trigger.kill()
      })
    }
  })


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      smoothScrollTo(target, -80) // -80px offset for fixed navigation
    }
  }

  return (
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-gta shadow-gta' : 'bg-gta-black/80 backdrop-blur-sm border-b border-white/10'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 opacity-100 animate-fade-in">
              {siteConfig.server.logo.type === 'text' ? (
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gta-green flex items-center justify-center">
                  <span className="font-bebas text-lg md:text-xl text-white">
                    {siteConfig.server.logo.content}
                  </span>
                </div>
              ) : (
                <div className="w-9 h-9 md:w-10 md:h-10 overflow-hidden">
                  <img 
                    src={siteConfig.server.logo.content} 
                    alt="Server Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <span className="font-bebas text-xl md:text-2xl text-white">
                <span className="hidden sm:inline">{siteConfig.server.name}</span>
                <span className="sm:hidden">
                  {siteConfig.server.name.split(' ').map(word => word[0]).join('')}
                </span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-2 text-sm font-inter font-medium transition-all duration-300 opacity-100 animate-fade-in ${
                    activeSection === item.id 
                      ? 'text-gta-gold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gta-gold" />
                  )}
                </a>
              ))}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="flex items-center gap-4 opacity-100 animate-fade-in">
              <a 
                href={`fivem://connect/${siteConfig.api.serverCode}`}
                className="px-6 py-2 text-sm font-inter font-medium uppercase tracking-wider bg-gta-green text-white hover:bg-gta-green/90 transition-all duration-300 inline-block text-center"
              >
                Connect
              </a>
              <a 
                href={siteConfig.social.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-sm font-inter font-medium uppercase tracking-wider border border-gta-gold text-gta-gold hover:bg-gta-gold hover:text-gta-black transition-all duration-300"
              >
                Discord
              </a>
            </div>

          </div>
        </div>
      </nav>
  )
}