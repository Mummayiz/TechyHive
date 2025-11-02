import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText, Terminal, BookOpen, Briefcase, Sparkles, Hexagon, Star, Send, Mail } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const submissions = JSON.parse(localStorage.getItem('techyhive_submissions') || '[]');
    submissions.push({ ...formData, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem('techyhive_submissions', JSON.stringify(submissions));

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
              <a href="#services" className="text-gray-300 hover:text-orange-500 transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-orange-500 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-300 hover:text-orange-500 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
              </a>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500/30 rounded-full"
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
                duration: Math.random() * 3 + 2,
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative inline-flex">
                <Hexagon className="w-24 h-24 text-orange-500 fill-orange-500/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Code className="w-10 h-10 text-orange-500" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Build Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Academic Success
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Professional college-level projects across all computer science domains. From implementation papers to complete portfolios, we've got you covered.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a href="#contact">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  Start Your Project
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="https://instagram.com/techyhive" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10 px-8 py-6 text-lg">
                  Follow @techyhive
                </Button>
              </a>
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
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 h-full group">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                        <Icon className="w-7 h-7 text-orange-500" />
                      </div>
                      <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-gray-400">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
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
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-orange-500/30 shadow-xl shadow-orange-500/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                    <div className="text-gray-400 text-sm">Projects Delivered</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-gray-400 text-sm">Support</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
                    <div className="text-gray-400 text-sm">Satisfaction</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
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
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
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
                <a href="https://instagram.com/techyhive" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 text-sm transition-colors">
                  @techyhive
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
