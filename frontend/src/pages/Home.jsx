import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Code, FileText, Terminal, BookOpen, Briefcase, Sparkles, Hexagon, Star, Send, Mail, Instagram, Menu, X, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { services, testimonials, projectTypes, domains } from '../mock';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { TechyHiveLogo } from '../components/animations';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';

const iconMap = {
  Code,
  FileText,
  Terminal,
  BookOpen,
  Briefcase,
  Sparkles
};

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    domain: '',
    deadline: '',
    budget: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-play testimonials carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        const maxIndex = testimonials.length - 3;
        return prev >= maxIndex ? 0 : prev + 3;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => {
      const maxIndex = testimonials.length - 3;
      return prev >= maxIndex ? 0 : prev + 3;
    });
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => {
      const maxIndex = testimonials.length - 3;
      return prev <= 0 ? maxIndex : prev - 3;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const isValidPhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!formData.projectType) {
      errors.projectType = 'Please select a project type';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://techyhive-backend.onrender.com';
      console.log('Submitting to:', `${backendUrl}/api/contact`);
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.projectType,
          domain: formData.domain,
          deadline: formData.deadline,
          budget: formData.budget,
          description: formData.description
        }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to submit form: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);
      
      toast.success('✅ Your request is submitted, and the team will get back to you within 24 hours.', {
        icon: <CheckCircle2 className="w-5 h-5" />,
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        domain: '',
        deadline: '',
        budget: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit request. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable animated section component
  const AnimatedSection = ({ children, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;
      
      let startTime;
      const startValue = 0;
      const endValue = parseInt(end);
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(startValue + (endValue - startValue) * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
  };

  // Animated section divider
  const SectionDivider = () => (
    <div className="flex items-center justify-center py-8">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="max-w-md mx-auto"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent flex-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Hexagon className="w-6 h-6 text-orange-500" />
          </motion.div>
          <motion.div 
            className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent flex-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <SEO />
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" style={{ border: 'none', outline: 'none' }}>
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-lg bg-slate-900/80 border-b border-orange-500/20 z-50" id="home">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 cursor-pointer select-none"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Logo with animation */}
              <motion.div
                className="relative flex items-center justify-center"
                style={{ width: 80, height: 80 }}
                whileHover={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.6))'
                }}
                animate={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.3))'
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <img 
                  src="/images/logo.png" 
                  alt="TechyHive Logo" 
                  className="w-20 h-20 object-contain"
                />
              </motion.div>
              
              {/* Brand text */}
              <motion.span 
                className="text-xl font-bold"
                whileHover={{ color: '#ff8c00' }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-orange-500">Techy</span>
                <span className="text-white">Hive</span>
              </motion.span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-8"
            >
              <a href="#home" className="text-gray-300 hover:text-orange-500 transition-colors">Home</a>
              <a href="#services" className="text-gray-300 hover:text-orange-500 transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-300 hover:text-orange-500 transition-colors">Portfolio</a>
              <a href="#testimonials" className="text-gray-300 hover:text-orange-500 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact</a>
              <a 
                href="https://www.instagram.com/techyhive.in?igsh=MXFzbWk1OTQ1NDQ4cg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#contact">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
              </a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:text-orange-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-orange-500/20 bg-slate-900/95 backdrop-blur-lg"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                <a 
                  href="#home" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  Home
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  Services
                </a>
                <a 
                  href="#portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  Portfolio
                </a>
                <a 
                  href="#testimonials" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  Testimonials
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  Contact
                </a>
                <a 
                  href="https://www.instagram.com/techyhive.in?igsh=MXFzbWk1OTQ1NDQ4cg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors py-2 flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                    Get Started
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Animated Circuit Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 60 M 30 0 L 0 30 M 60 30 L 30 60" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="1" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500/40 rounded-full"
              initial={{ 
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0, 
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : [0, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Professional Logo Display with Enhanced Animations */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 80, 
                damping: 12,
                delay: 0.2
              }}
              className="mb-10 relative"
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-96 h-96 rounded-full bg-gradient-to-r from-orange-500/10 via-orange-400/15 to-yellow-500/10 blur-3xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.6, 0.4],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </div>

              {/* Orbiting Subtle Dots */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-500/40 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    marginLeft: '-4px',
                    marginTop: '-4px'
                  }}
                  animate={{
                    x: [0, Math.cos((i * 120 + 0) * Math.PI / 180) * 160, Math.cos((i * 120 + 120) * Math.PI / 180) * 160, Math.cos((i * 120 + 240) * Math.PI / 180) * 160, 0],
                    y: [0, Math.sin((i * 120 + 0) * Math.PI / 180) * 160, Math.sin((i * 120 + 120) * Math.PI / 180) * 160, Math.sin((i * 120 + 240) * Math.PI / 180) * 160, 0],
                    opacity: [0.3, 0.6, 0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Logo Container with Enhanced Effects */}
              <motion.div
                className="relative z-10 group"
                whileHover={{ 
                  scale: 1.08,
                  rotate: [0, -2, 2, -2, 0]
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Hexagonal Border Effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <svg width="310" height="310" viewBox="0 0 310 310" className="absolute opacity-20">
                    <polygon
                      points="155,10 265,77.5 265,232.5 155,300 45,232.5 45,77.5"
                      fill="none"
                      stroke="url(#hexGradient)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#fb923c" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#fdba74" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Logo with Enhanced Shadow */}
                <motion.img 
                  src="/images/logo.png" 
                  alt="TechyHive Logo" 
                  className="w-72 h-72 mx-auto object-contain relative"
                  animate={{
                    filter: [
                      "drop-shadow(0 10px 30px rgba(249, 115, 22, 0.25)) brightness(1)",
                      "drop-shadow(0 15px 45px rgba(249, 115, 22, 0.4)) brightness(1.05)",
                      "drop-shadow(0 10px 30px rgba(249, 115, 22, 0.25)) brightness(1)"
                    ]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />

                {/* Shine Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ pointerEvents: 'none' }}
                />
              </motion.div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Transforming Ideas into</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                <TypeAnimation
                  sequence={[
                    'Digital Solutions',
                    2000,
                    'Web Applications',
                    2000,
                    'Mobile Apps',
                    2000,
                    'AI Solutions',
                    2000,
                    'Blockchain Apps',
                    2000,
                    'IoT Systems',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your trusted partner for professional & innovative college projects in <span className="text-orange-500 font-semibold">Computer Science, AI, Data Science, IoT, and Electronics</span>. Complete with documentation, presentations, and implementation support.
            </p>

            {/* Domain Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              {[
                { icon: Code, label: "CS Projects" },
                { icon: Sparkles, label: "AI/ML" },
                { icon: Terminal, label: "Data Science" },
                { icon: null, label: "IoT", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /> },
                { icon: null, label: "Electronics", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /> }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div 
                    key={idx}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-2 hover:bg-orange-500/20 transition-all cursor-pointer"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], borderColor: "rgba(249, 115, 22, 0.6)" }}
                      transition={{ duration: 0.5 }}
                    >
                      {IconComponent ? (
                        <IconComponent className="w-8 h-8 text-orange-500" />
                      ) : (
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.svg}
                        </svg>
                      )}
                    </motion.div>
                    <span className="text-sm text-gray-400">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <a href="#contact">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(249, 115, 22, 0.5)',
                      '0 0 30px rgba(249, 115, 22, 0.8)',
                      '0 0 20px rgba(249, 115, 22, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-lg"
                >
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                    Start Your Project
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </a>
              <a 
                href="https://www.instagram.com/techyhive.in?igsh=MXFzbWk1OTQ1NDQ4cg==" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-6 text-lg group">
                  <Instagram className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Follow Us
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Get In Touch
                </Button>
              </a>
            </motion.div>

            {/* Stats Row with Animated Counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: 50, suffix: "+", label: "Projects Completed", delay: 0.9 },
                { value: 20, suffix: "+", label: "Happy Clients", delay: 1.0 },
                { value: 2, suffix: "", label: "Years Experience", delay: 1.1 },
                { value: 24, suffix: "/7", label: "Support Available", delay: 1.2 }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-orange-500 mb-2"
                    animate={{ 
                      textShadow: [
                        "0 0 4px rgba(249, 115, 22, 0.5)",
                        "0 0 8px rgba(249, 115, 22, 0.8)",
                        "0 0 4px rgba(249, 115, 22, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2.5} />
                  </motion.div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animated Divider */}
      <SectionDivider />

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-orange-500">Services</span>
            </h2>
            <p className="text-gray-400 text-lg">Comprehensive solutions for all your academic project needs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 h-full group">
                    <CardHeader>
                      <motion.div 
                        className="w-14 h-14 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-7 h-7 text-orange-500" />
                      </motion.div>
                      <CardTitle className="text-white text-xl group-hover:text-orange-500 transition-colors">{service.title}</CardTitle>
                      <CardDescription className="text-gray-400">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Tech Workspace Showcase Section */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Professional <span className="text-orange-500">Development Environment</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                We work with cutting-edge technologies and modern development practices to deliver exceptional results. Our team utilizes industry-standard tools and frameworks to ensure your projects meet the highest quality standards.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-orange-500/20"
                  whileHover={{ x: 5, borderColor: "rgba(249, 115, 22, 0.5)" }}
                >
                  <Code className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-sm">Clean Code</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-orange-500/20"
                  whileHover={{ x: 5, borderColor: "rgba(249, 115, 22, 0.5)" }}
                >
                  <Terminal className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-sm">Latest Tech</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-orange-500/20"
                  whileHover={{ x: 5, borderColor: "rgba(249, 115, 22, 0.5)" }}
                >
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-sm">Best Practices</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-orange-500/20"
                  whileHover={{ x: 5, borderColor: "rgba(249, 115, 22, 0.5)" }}
                >
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-sm">Documentation</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div 
                className="rounded-2xl overflow-hidden border-4 border-orange-500/30 shadow-2xl shadow-orange-500/20"
                whileHover={{ scale: 1.02, borderColor: "rgba(249, 115, 22, 0.6)" }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1512686096451-a15c19314d59?w=1200&q=80" 
                  alt="Professional workspace"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/30 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-orange-500">Portfolio</span>
            </h2>
            <p className="text-gray-400 text-lg">Showcasing our best work and successful projects</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "AI Chatbot System", 
                category: "Machine Learning", 
                description: "Advanced conversational AI with NLP capabilities",
                image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80"
              },
              { 
                title: "IoT Smart Home", 
                category: "Internet of Things", 
                description: "Complete home automation with sensor integration",
                image: "https://images.unsplash.com/photo-1518444667766-94728310399f?w=800&q=80"
              },
              { 
                title: "Blockchain Voting", 
                category: "Blockchain", 
                description: "Secure and transparent voting system",
                image: "https://images.unsplash.com/photo-1639815188546-c43c240ff4df?w=800&q=80"
              },
              { 
                title: "Data Analytics Dashboard", 
                category: "Data Science", 
                description: "Real-time analytics with visualization",
                image: "https://images.unsplash.com/photo-1650327034581-1711a15a5430?w=800&q=80"
              },
              { 
                title: "Mobile E-commerce App", 
                category: "Mobile Development", 
                description: "Full-featured shopping application",
                image: "https://images.pexels.com/photos/5475750/pexels-photo-5475750.jpeg?w=800&q=80"
              },
              { 
                title: "Computer Vision System", 
                category: "AI/CV", 
                description: "Object detection and recognition system",
                image: "https://images.unsplash.com/photo-1717501220374-9f4b2a3a60c9?w=800&q=80"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 h-full group overflow-hidden">
                  <div className="h-48 relative overflow-hidden">
                    <motion.img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 right-4">
                      <motion.span 
                        className="bg-orange-500/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-orange-400"
                        whileHover={{ scale: 1.05 }}
                      >
                        {project.category}
                      </motion.span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg group-hover:text-orange-500 transition-colors">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400">{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-orange-500">TechyHive?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                We specialize in delivering high-quality academic projects that help students excel in their computer science journey. With expertise across all domains, we ensure timely delivery and exceptional quality.
              </p>
              
              <Accordion type="single" collapsible className="space-y-3">
                {[
                  {
                    value: "item-1",
                    title: "Expert Team",
                    content: "Our team consists of experienced developers and researchers with deep knowledge in various CS domains.",
                    delay: 0
                  },
                  {
                    value: "item-2",
                    title: "Timely Delivery",
                    content: "We understand deadlines matter. Get your projects delivered on time, every time.",
                    delay: 0.1
                  },
                  {
                    value: "item-3",
                    title: "Quality Assured",
                    content: "All projects undergo rigorous quality checks to ensure they meet academic standards.",
                    delay: 0.2
                  },
                  {
                    value: "item-4",
                    title: "24/7 Support",
                    content: "Have questions? Our support team is always ready to help you throughout the project lifecycle.",
                    delay: 0.3
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={item.value}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay, type: "spring", stiffness: 100 }}
                  >
                    <AccordionItem 
                      value={item.value} 
                      className="group border border-slate-700 rounded-lg px-4 bg-slate-800/50 hover:bg-slate-800/70 hover:border-orange-500/40 transition-all duration-300 overflow-hidden relative"
                    >
                      {/* Hover Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      {/* Animated Border Accent */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-yellow-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
                      />

                      <AccordionTrigger className="relative text-white hover:text-orange-500 hover:no-underline py-4">
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {item.title}
                        </motion.span>
                      </AccordionTrigger>
                      
                      <AccordionContent className="text-gray-400">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pb-4"
                        >
                          {item.content}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Animated Background Blobs */}
              <motion.div 
                className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                  x: [0, 20, 0],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                  x: [0, -20, 0],
                  y: [0, 20, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1, ease: "easeInOut" }}
              />

              <div className="relative z-10 p-8 rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: 50, suffix: "+", label: "Projects Delivered", delay: 0 },
                    { value: 98, suffix: "%", label: "Success Rate", delay: 0.1 },
                    { value: 24, suffix: "/7", label: "Support", delay: 0.2 },
                    { value: 100, suffix: "%", label: "Satisfaction", delay: 0.3 }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="group"
                    >
                      <div className="relative">
                        {/* Glassmorphism Card */}
                        <div className="relative text-center p-5 backdrop-blur-md bg-slate-700/30 rounded-xl border border-slate-600/30 group-hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
                          {/* Animated Gradient Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Glow Effect */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-transparent blur-lg" />
                          </div>

                          {/* Content */}
                          <div className="relative z-10">
                            <motion.div
                              className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: stat.delay + 0.2 }}
                            >
                              <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
                            </motion.div>
                            <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                          </div>

                          {/* Corner Accent */}
                          <motion.div
                            className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100"
                            animate={{ rotate: [0, 90, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>

                        {/* Pulsing Shadow */}
                        <motion.div
                          className="absolute inset-0 -z-10 rounded-xl bg-orange-500/20 blur-lg opacity-0 group-hover:opacity-100"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.5, 0.3]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Student <span className="text-orange-500">Testimonials</span>
            </h2>
            <p className="text-gray-400 text-lg">Hear what our clients say about us</p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative px-4 md:px-12">
            {/* Previous Button */}
            <button
              onClick={prevTestimonial}
              className="absolute -left-4 md:left-0 top-1/2 -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous testimonial"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextTestimonial}
              className="absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Next testimonial"
              type="button"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Single Testimonial Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {testimonials.slice(currentTestimonial, currentTestimonial + 3).map((testimonial, index) => (
                  <Card key={testimonial.id} className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 h-full">
                    <CardHeader>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                      <CardDescription className="text-gray-300 text-base mb-4">
                        "{testimonial.content}"
                      </CardDescription>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(Math.ceil(testimonials.length / 3))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index * 3)}
                  className={`h-2 rounded-full transition-all ${
                    Math.floor(currentTestimonial / 3) === index ? 'bg-orange-500 w-8' : 'bg-gray-600 w-2'
                  }`}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Process/Technology Showcase */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-orange-500">Technologies</span>
            </h2>
            <p className="text-gray-400 text-lg">We use modern tools and frameworks to build your projects</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "AI & Machine Learning",
                description: "Advanced AI solutions with TensorFlow, PyTorch, and modern ML frameworks",
                image: "https://images.unsplash.com/photo-1717501220374-9f4b2a3a60c9?w=600&q=80",
                icon: Sparkles
              },
              {
                title: "Web Development",
                description: "Full-stack development with React, Node.js, Python, and modern frameworks",
                image: "https://images.unsplash.com/photo-1593720219128-218edc93bdc0?w=600&q=80",
                icon: Code
              },
              {
                title: "Mobile & IoT",
                description: "Mobile apps and IoT solutions with cutting-edge technology stack",
                image: "https://images.unsplash.com/photo-1657972170499-3376d9eb8f65?w=600&q=80",
                icon: Terminal
              }
            ].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 h-full overflow-hidden group">
                    <div className="h-48 relative overflow-hidden">
                      <motion.img
                        src={tech.image}
                        alt={tech.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <motion.div
                          className="w-12 h-12 rounded-lg bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 flex items-center justify-center"
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-6 h-6 text-orange-500" />
                        </motion.div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-lg group-hover:text-orange-500 transition-colors">
                        {tech.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {tech.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Call-to-Action Section */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, -30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Main Heading */}
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to Build Your{' '}
              <span className="text-orange-500">Dream Project?</span>
            </motion.h2>

            {/* Subheading */}
            <motion.p 
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join <span className="text-orange-500 font-semibold">50+ satisfied students</span> who have achieved academic excellence with our expert development services.
            </motion.p>

            {/* CTA Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: CheckCircle2,
                  title: "Fast Delivery",
                  description: "Projects delivered on time, every time",
                  delay: 0.4
                },
                {
                  icon: Sparkles,
                  title: "Quality Code",
                  description: "Clean, documented, academic-standard code",
                  delay: 0.5
                },
                {
                  icon: Star,
                  title: "Expert Support",
                  description: "24/7 assistance throughout your journey",
                  delay: 0.6
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay }}
                    whileHover={{ y: -3 }}
                    className="group"
                  >
                    <div className="relative h-full">
                      {/* Subtle Card */}
                      <div className="relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 h-full overflow-hidden group-hover:border-orange-500/30 transition-all duration-300">
                        {/* Subtle Gradient Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.3 }}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-slate-700/50 border border-orange-500/20 flex items-center justify-center group-hover:border-orange-500/40 transition-colors">
                            <Icon className="w-6 h-6 text-orange-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href="#contact"
                className="inline-block group relative"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white font-semibold text-base flex items-center gap-2 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30">
                  <span>Start Your Project Now</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.a>
            </motion.div>

            {/* Trust Badge */}
            <motion.p
              className="text-gray-500 text-sm mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              🔒 Secure • ⚡ Quick Response • ✨ Free Consultation
            </motion.p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-6 bg-slate-800/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1596784326488-23581279e33d?w=1920&q=80" 
            alt="Background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/80" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Send className="w-16 h-16 text-orange-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get <span className="text-orange-500">Started</span>
            </h2>
            <p className="text-gray-400 text-lg">Fill out the form below and we'll get back to you within 24 hours</p>
            <p className="text-sm text-gray-500 mt-2">Contact for pricing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800/70 backdrop-blur-sm border-slate-700 shadow-2xl shadow-orange-500/10">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={`bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 ${formErrors.name ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {formErrors.name && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 ${formErrors.email ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {formErrors.email && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Phone (Optional)</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 1234567890"
                        className={`bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 ${formErrors.phone ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Deadline (Optional)</label>
                      <Input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Project Type *</label>
                      <Select 
                        name="projectType" 
                        onValueChange={(value) => handleSelectChange('projectType', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={`bg-slate-900/50 border-slate-600 text-white ${formErrors.projectType ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {projectTypes.map(type => (
                            <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.projectType && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.projectType}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Domain (Optional)</label>
                      <Select 
                        name="domain" 
                        onValueChange={(value) => handleSelectChange('domain', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {domains.map(domain => (
                            <SelectItem key={domain} value={domain} className="text-white hover:bg-slate-700">
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Budget (Optional)</label>
                    <Input
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Your budget range"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Project Description *</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project requirements in detail... (minimum 10 characters)"
                      className={`bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 min-h-32 ${formErrors.description ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {formErrors.description && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6" style={{ borderBottom: 'none' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/logo.png" 
                  alt="TechyHive Logo" 
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xl font-bold">
                  <span className="text-orange-500">Techy</span>
                  <span className="text-white">Hive</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional college-level projects across all computer science domains.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Services</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">About Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <a href="mailto:techyhive03@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 text-sm transition-colors">
                  <Mail className="w-4 h-4" />
                  techyhive03@gmail.com
                </a>
                <a 
                  href="https://www.instagram.com/techyhive.in?igsh=MXFzbWk1OTQ1NDQ4cg==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 text-sm transition-colors group"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  @techyhive.in
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 TechyHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;
