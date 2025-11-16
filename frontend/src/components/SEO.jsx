import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "TechyHive - Professional College-Level Projects | Web, Mobile & AI Development",
  description = "TechyHive delivers professional college-level projects across all computer science domains. Specializing in Web Development, Mobile Apps, AI/ML, Blockchain, and more. 50+ successful projects delivered.",
  keywords = "college projects, web development, mobile app development, AI projects, machine learning, blockchain, IoT, data science, computer science projects, student projects, final year projects",
  image = "/images/logo.png",
  url = "http://localhost:3000",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TechyHive" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="TechyHive" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TechyHive",
          "description": description,
          "url": url,
          "logo": image,
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "techyhive03@gmail.com",
            "contactType": "Customer Service"
          },
          "sameAs": [
            "https://www.instagram.com/techyhive.in"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
