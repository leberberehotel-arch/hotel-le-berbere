import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListExperiences } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Tag } from "lucide-react";

export default function Experiences() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const params = activeCategory !== "all" ? { category: activeCategory } : undefined;
  const { data: experiences, isLoading } = useListExperiences(params);

  const categories = [
    { id: "all", label: "All Experiences" },
    { id: "spa", label: "Spa & Hammam" },
    { id: "cultural", label: "Cultural" },
    { id: "dining", label: "Culinary" },
    { id: "tour", label: "Excursions" },
  ];

  return (
    <div className="min-h-screen w-full pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Curated Experiences</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Immerse yourself in the magic of Marrakech with our bespoke selection of wellness rituals, cultural encounters, and exclusive adventures.
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

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[450px] bg-card animate-pulse border border-border" />
                ))}
              </div>
            ) : experiences?.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p>No experiences available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {experiences?.map((exp, idx) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group border border-border bg-card overflow-hidden flex flex-col"
                  >
                    <div className="relative h-[250px] overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{ backgroundImage: `url(${exp.images[0] || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200'})` }}
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-primary tracking-widest uppercase text-[10px] mb-2 font-medium">
                        {exp.category}
                      </div>
                      <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">{exp.name}</h3>
                      <p className="text-muted-foreground text-sm font-light line-clamp-3 mb-6 flex-1">
                        {exp.shortDescription || exp.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto mb-6 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Tag className="w-4 h-4 text-primary" />
                          <span>${exp.price}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-transparent border border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest text-xs h-10">
                        Inquire via Concierge
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
