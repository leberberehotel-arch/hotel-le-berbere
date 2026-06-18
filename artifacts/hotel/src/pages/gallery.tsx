import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGalleryItems } from "@workspace/api-client-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const params = activeCategory !== "all" ? { category: activeCategory } : undefined;
  const { data: galleryItems, isLoading } = useListGalleryItems(params);

  const categories = [
    { id: "all" },
    { id: "rooms" },
    { id: "architecture" },
    { id: "dining" },
    { id: "spa" },
    { id: "lifestyle" },
  ] as const;

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
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">{t.gallery.heading}</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            {t.gallery.subtext}
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
                {t.gallery.categories[cat.id]}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[300px] bg-card animate-pulse border border-border mb-4 break-inside-avoid" />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4">
              {galleryItems?.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative mb-4 break-inside-avoid cursor-pointer group overflow-hidden border border-primary/10"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-end">
                    <div className="p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-foreground text-sm font-serif">{item.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Tabs>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={32} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-foreground hover:text-primary transition-colors"
              onClick={handlePrev}
            >
              <ChevronLeft size={40} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={galleryItems[lightboxIndex].imageUrl}
              alt={galleryItems[lightboxIndex].title}
              className="max-h-[85vh] max-w-[85vw] object-contain border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-8 text-foreground hover:text-primary transition-colors"
              onClick={handleNext}
            >
              <ChevronRight size={40} />
            </button>
            <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
              {galleryItems[lightboxIndex].title} — {lightboxIndex + 1} / {galleryItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
