import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGalleryItems } from "@workspace/api-client-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const params = activeCategory !== "all" ? { category: activeCategory } : undefined;
  const { data: galleryItems, isLoading } = useListGalleryItems(params);

  const categories = [
    { id: "all", label: "All Images" },
    { id: "rooms", label: "Residences" },
    { id: "architecture", label: "Architecture" },
    { id: "dining", label: "Dining" },
    { id: "spa", label: "Wellness" },
    { id: "lifestyle", label: "Lifestyle" },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!galleryItems || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!galleryItems || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <div className="min-h-screen w-full pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Gallery</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            A visual journey through the exquisite details, lush courtyards, and quiet opulence of Hotel Le Berbère.
          </p>
        </motion.div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="flex flex-wrap justify-center bg-transparent border-b border-border w-full h-auto p-0 mb-12">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4 uppercase tracking-widest text-xs"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`bg-card animate-pulse border border-border ${i % 2 === 0 ? 'h-64' : 'h-96'}`} />
              ))}
            </div>
          ) : galleryItems?.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p>No images available in this category.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 pb-28">
              {galleryItems?.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 10) * 0.1, duration: 0.5 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden border border-border"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img 
                    src={item.url} 
                    alt={item.alt} 
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-primary tracking-widest uppercase text-xs bg-background/80 px-4 py-2 backdrop-blur-sm">View</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Tabs>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems && galleryItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-foreground hover:text-primary p-2 z-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            >
              <X size={32} strokeWidth={1} />
            </button>
            
            <button 
              className="absolute left-6 text-foreground hover:text-primary p-4 z-50 transition-colors"
              onClick={handlePrev}
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
            
            <button 
              className="absolute right-6 text-foreground hover:text-primary p-4 z-50 transition-colors"
              onClick={handleNext}
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={galleryItems[lightboxIndex].url} 
                alt={galleryItems[lightboxIndex].alt} 
                className="max-w-full max-h-[80vh] object-contain border border-primary/20 shadow-2xl"
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-foreground font-light tracking-wide">{galleryItems[lightboxIndex].caption || galleryItems[lightboxIndex].alt}</p>
                <p className="text-primary text-xs tracking-widest uppercase mt-2">{lightboxIndex + 1} / {galleryItems.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
