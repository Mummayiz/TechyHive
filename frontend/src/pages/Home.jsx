import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText, Terminal, BookOpen, Briefcase, Sparkles, Hexagon, Star, Send, Mail, Instagram } from 'lucide-react';
import { services, testimonials, projectTypes, domains } from '../mock';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
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

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      console.log('Submission successful:', data);
      
      toast.success('✅ Your request is submitted, and the team will get back to you within 24 hours.');
      
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
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-lg bg-slate-900/80 border-b border-orange-500/20 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Hexagon className="w-10 h-10 text-orange-500 fill-orange-500/20" />
                <Code className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-orange-500">Techy</span>
                <span className="text-white">Hive</span>
              </span>
            </motion.div>
            
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
          </div>
        </nav>
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
            {/* Large Logo Image */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2, duration: 1 }}
              className="mb-8"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <motion.img 
                src="https://customer-assets.emergentagent.com/job_5dad80a5-5b92-47a9-9d97-b86aa98507ee/artifacts/2wtib7ez_Screenshot%202025-10-07%20201022.png" 
                alt="TechyHive Logo" 
                className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
                animate={{
                  filter: [
                    "drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))",
                    "drop-shadow(0 0 40px rgba(249, 115, 22, 0.5))",
                    "drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Transforming Ideas into</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Digital Solutions
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
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  Start Your Project
                  <Send className="ml-2 w-5 h-5" />
                </Button>
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
              <a href="#portfolio">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  View Our Work
                </Button>
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: "500+", label: "Projects Completed", delay: 0.9 },
                { value: "50+", label: "Happy Clients", delay: 1.0 },
                { value: "5", label: "Years Experience", delay: 1.1 },
                { value: "24/7", label: "Support Available", delay: 1.2 }
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
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

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
                image: "https://images.unsplash.com/photo-1717501217835-821cc3aefbc3?w=800&q=80"
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
            <p className="text-gray-400 mb-4">Want to see more of our work?</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              View Complete Portfolio
            </Button>
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
                <AccordionItem value="item-1" className="border border-slate-700 rounded-lg px-4 bg-slate-800/50">
                  <AccordionTrigger className="text-white hover:text-orange-500 hover:no-underline">
                    Expert Team
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Our team consists of experienced developers and researchers with deep knowledge in various CS domains.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border border-slate-700 rounded-lg px-4 bg-slate-800/50">
                  <AccordionTrigger className="text-white hover:text-orange-500 hover:no-underline">
                    Timely Delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    We understand deadlines matter. Get your projects delivered on time, every time.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border border-slate-700 rounded-lg px-4 bg-slate-800/50">
                  <AccordionTrigger className="text-white hover:text-orange-500 hover:no-underline">
                    Quality Assured
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    All projects undergo rigorous quality checks to ensure they meet academic standards.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border border-slate-700 rounded-lg px-4 bg-slate-800/50">
                  <AccordionTrigger className="text-white hover:text-orange-500 hover:no-underline">
                    24/7 Support
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Have questions? Our support team is always ready to help you throughout the project lifecycle.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Background Image */}
              <motion.div 
                className="absolute inset-0 rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1593720219128-218edc93bdc0?w=800&q=80" 
                  alt="Coding workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-orange-900/80" />
              </motion.div>

              <div className="relative z-10 p-8 rounded-2xl border border-orange-500/30 shadow-xl shadow-orange-500/10">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-orange-500/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                  >
                    <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                    <div className="text-gray-400 text-sm">Projects Delivered</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-orange-500/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                  >
                    <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-orange-500/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                  >
                    <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-gray-400 text-sm">Support</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-orange-500/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                  >
                    <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
                    <div className="text-gray-400 text-sm">Satisfaction</div>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="absolute -top-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

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

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 h-full">
                  <CardHeader>
                    <motion.div 
                      className="flex gap-1 mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 + i * 0.05, type: "spring" }}
                        >
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <CardDescription className="text-gray-300 text-base mb-4">
                      "{testimonial.content}"
                    </CardDescription>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
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
            <Card className="bg-slate-800/50 border-slate-700">
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
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500"
                        required
                      />
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
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Deadline (Optional)</label>
                      <Input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Project Type *</label>
                      <Select name="projectType" onValueChange={(value) => handleSelectChange('projectType', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
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
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Domain (Optional)</label>
                      <Select name="domain" onValueChange={(value) => handleSelectChange('domain', value)}>
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
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Project Description *</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project requirements in detail..."
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 min-h-32"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Submit Request
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Hexagon className="w-8 h-8 text-orange-500 fill-orange-500/20" />
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
  );
};

export default Home;
