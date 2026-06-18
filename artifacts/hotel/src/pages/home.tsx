import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListRooms, useListExperiences, useListRestaurants, useListReviews, useListGalleryItems } from "@workspace/api-client-react";
import { BookingWidget } from "@/components/booking-widget";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const { t } = useLanguage();
  const { data: featuredRooms, isLoading: isLoadingRooms } = useListRooms({ featured: true });
  const { data: experiences } = useListExperiences();
  const { data: restaurants } = useListRestaurants();
  const { data: reviews } = useListReviews({ featured: true, limit: 3 });
  const { data: galleryItems } = useListGalleryItems({ category: "lifestyle" });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="text-primary tracking-[0.3em] uppercase text-sm mb-6">
            {t.home.heroEyebrow}
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-tight mb-8">
            {t.home.heroHeading.split(" / ").map((line, i) => (
              <span key={i}>{line}{i === 0 ? <br /> : ""}</span>
            ))}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-foreground/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            {t.home.heroSubtext}
          </motion.p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 flex justify-center px-4">
          <BookingWidget />
        </div>
      </section>

      {/* Featured Suites */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto mt-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">{t.home.suitesHeading}</h2>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.home.suitesSubtext}</p>
        </motion.div>

        {isLoadingRooms ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-[600px] bg-card animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredRooms?.slice(0, 2).map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="group relative h-[600px] overflow-hidden border border-primary/20"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start">
                  <div className="text-primary tracking-widest uppercase text-xs mb-3">{room.category.replace('-', ' ')}</div>
                  <h3 className="text-3xl font-serif text-foreground mb-3">{room.name}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-6">{room.shortDescription || room.description}</p>
                  <Link href={`/rooms/${room.id}`}>
                    <Button variant="link" className="p-0 text-primary hover:text-primary/80 uppercase tracking-widest text-sm rounded-none">
                      {t.home.discoverSuite} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/rooms">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none tracking-widest uppercase px-8 h-12">
              {t.home.viewAllRooms}
            </Button>
          </Link>
        </div>
      </section>

      {/* Spa & Wellness (Full Bleed) */}
      <section className="relative py-32 overflow-hidden border-y border-primary/20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 fixed-attachment"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200')`,
            backgroundAttachment: "fixed" 
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        
        <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800" 
              alt="Hammam Spa" 
              className="w-full h-[600px] object-cover border border-primary/30 p-2"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h2 className="text-primary tracking-widest uppercase text-sm mb-4">{t.home.wellnessEyebrow}</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6">{t.home.wellnessHeading}</h3>
            <p className="text-foreground/80 leading-relaxed mb-8 text-lg font-light">
              {t.home.wellnessBody}
            </p>
            <Link href="/experiences">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase px-8 h-12">
                {t.home.exploreSpa}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif mb-4">{t.home.guestBook}</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews?.map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 border border-border bg-background"
              >
                <div className="flex text-primary mb-6">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <h4 className="font-serif text-lg mb-3">"{review.title}"</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">
                  {review.body}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {review.avatarUrl ? (
                      <img src={review.avatarUrl} alt={review.guestName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs uppercase text-primary">{review.guestName.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{review.guestName}</div>
                    <div className="text-xs text-muted-foreground">{review.country}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
