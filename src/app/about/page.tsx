"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaUsers, FaHeart, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdLocationOn, MdRestaurantMenu } from 'react-icons/md';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ValueCard {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('story');
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const slideIn = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const valueCards: ValueCard[] = [
    {
      icon: FaHeart,
      title: 'Quality First',
      description: 'We serve authentic Filipino cuisine using the finest ingredients, ensuring every dish tells a story of our heritage.',
      color: 'bg-primary',
    },
    {
      icon: FaUsers,
      title: 'Community Focus',
      description: 'From students to families, we take pride in being part of our community\'s daily life.',
      color: 'bg-secondary',
    },
    {
      icon: MdRestaurantMenu,
      title: 'Accessibility',
      description: 'Open daily from 5:00 AM to 12:00 AM, serving comfort food when you need it most.',
      color: 'bg-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/about/2024.jpg"
            alt="Kusina De Amadeo Restaurant"
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
            quality={90}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/restaurant.jpg';
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="h-full flex flex-col items-center justify-center px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h1
                variants={fadeIn}
                className="font-display text-5xl md:text-7xl font-bold mb-6 text-white"
              >
                Kusina De Amadeo
              </motion.h1>
              <motion.div
                variants={fadeIn}
                className="w-24 h-1 bg-primary mx-auto mb-6"
              />
              <motion.p
                variants={fadeIn}
                className="text-xl md:text-2xl text-white max-w-2xl mx-auto px-4 mb-8"
              >
                Authentic Filipino Flavors in Amadeo
              </motion.p>
              <Link href="/menu">
                <motion.button
                  variants={scaleUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold 
                            hover:bg-primary-dark transition-all duration-300 shadow-lg"
                >
                  Explore Our Menu
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-6 md:space-x-12">
            {['story', 'values', 'location'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium capitalize px-4 py-2 rounded-full transition-all duration-300
                          ${activeTab === tab 
                            ? 'bg-primary text-white shadow-lg transform scale-105' 
                            : 'text-gray-600 hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'story' && (
          <motion.section
            key="story"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="py-16 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  variants={slideIn}
                  className="space-y-6"
                >
                  <h2 className="font-display text-4xl font-bold text-gray-900 leading-tight">
                    Our Journey of <span className="text-primary">Flavors</span>
                  </h2>
                  <div className="w-20 h-1 bg-primary"/>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Founded in 2022, Kusina De Amadeo planted its culinary roots in the heart of Amadeo, Cavite, 
                    with a vision to serve authentic Filipino flavors to our local community. What started as a 
                    small family venture has grown into a beloved neighborhood restaurant.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Through 2023's growing pains, we cultivated a loyal customer base, spreading joy one dish at a time. 
                    In 2024, we embarked on a new chapter, relocating to a cozy spot next to our family home. Now we proudly 
                    serve delicious meals to our community, including students from nearby elementary schools, senior high schools, 
                    and colleges.
                  </p>
                </motion.div>
                <motion.div
                  variants={scaleUp}
                  className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform 
                             hover:scale-105 transition-transform duration-500"
                >
                  <Image
                    src="/images/about/2023.jpg"
                    alt="Our Story"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/restaurant.jpg';
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'values' && (
          <motion.section
            key="values"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="py-16 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {valueCards.map((value, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.2,
                          duration: 0.5,
                        },
                      },
                    }}
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl 
                              transition-all duration-300"
                  >
                    <div 
                      className={`${value.color} w-16 h-16 rounded-full flex items-center 
                                justify-center mb-6 mx-auto transform transition-all duration-300
                                hover:scale-110`}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-4 text-center">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'location' && (
          <motion.section
            key="location"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="py-16 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  variants={slideIn}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl 
                                transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <MdLocationOn className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-display text-2xl font-bold mb-2 text-gray-900">Find Us</h3>
                        <p className="text-gray-600 text-lg">
                          107 i Purok 4 Dagatan<br />
                          Amadeo, Cavite<br />
                          Philippines
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      variants={scaleUp}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl 
                                transition-all duration-300"
                    >
                      <FaClock className="w-8 h-8 text-primary mb-4" />
                      <h4 className="font-display text-xl font-semibold mb-2">Hours</h4>
                      <p className="text-gray-600">
                        Open Daily<br />
                        5:00 AM - 12:00 AM
                      </p>
                    </motion.div>

                    <motion.div
                      variants={scaleUp}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl 
                                transition-all duration-300"
                    >
                      <FaPhone className="w-8 h-8 text-primary mb-4" />
                      <h4 className="font-display text-xl font-semibold mb-2">Contact</h4>
                      <p className="text-gray-600">
                        Mobile: +63 960 508 8715<br />
                        Tel: (046) 890-9060<br />
                        Email: marquezjohnnathanieljade@gmail.com
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  variants={scaleUp}
                  className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/images/restaurant.jpg"
                    alt="Restaurant Location"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="font-display text-2xl font-bold mb-2">Visit Us Today</h3>
                      <p className="text-lg">Experience the taste of authentic Filipino cuisine</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;
