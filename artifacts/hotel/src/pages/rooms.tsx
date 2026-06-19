import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListRooms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Maximize, BedDouble, Eye, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Rooms() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const params = activeCategory !== "all" ? { category: activeCategory } : undefined;
  const { data: rooms, isLoading } = useListRooms(params);

  const categories = [
    { id: "all" },
    { id: "riad-suite" },
    { id: "grand-suite" },
    { id: "deluxe-room" },
    { id: "royal-pavilion" },
  ] as const;

  return (
    <div className="min-h-screen w-full pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">{t.rooms.heading}</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            {t.rooms.subtext}
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
                {t.rooms.categories[cat.id]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[600px] bg-card animate-pulse border border-border" />
                ))}
              </div>
            ) : rooms?.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p>{t.rooms.noRooms}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {rooms?.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group bg-card border border-border overflow-hidden flex flex-col"
                  >
                    {/* Room Image */}
                    <div className="relative h-[300px] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url(${room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200'})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {room.featured && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-widest">
                          Featured
                        </div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-widest ${room.available ? 'bg-green-700/80 text-green-100' : 'bg-destructive/80 text-destructive-foreground'}`}>
                        {room.available ? t.booking.available : t.booking.notAvailable}
                      </div>
                    </div>

                    {/* Room Content */}
                    <div className="p-8 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-primary tracking-widest uppercase text-xs mb-2">
                            {room.category.replace(/-/g, ' ')}
                          </div>
                          <h3 className="text-2xl font-serif text-foreground">{room.name}</h3>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.rooms.from}</div>
                          <div className="text-xl font-serif text-foreground">{room.pricePerNight} MAD</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">{t.rooms.perNight}</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground font-light text-sm line-clamp-2 mb-5">
                        {room.shortDescription || room.description}
                      </p>

                      {/* Room Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5 border-y border-border py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <User className="w-4 h-4 text-primary shrink-0" />
                          <span>{t.rooms.capacity} {room.maxGuests} {t.rooms.guests}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Maximize className="w-4 h-4 text-primary shrink-0" />
                          <span>{room.size} {t.rooms.sqm}</span>
                        </div>
                        {room.bedType && (
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <BedDouble className="w-4 h-4 text-primary shrink-0" />
                            <span>{t.rooms.bedType}: {room.bedType}</span>
                          </div>
                        )}
                        {room.floor !== undefined && room.floor !== null && (
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <Eye className="w-4 h-4 text-primary shrink-0" />
                            <span>Floor {room.floor}</span>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.amenities.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground border border-border px-2 py-1">
                              <CheckCircle className="w-3 h-3 text-primary" />
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 4 && (
                            <span className="text-xs text-muted-foreground border border-border px-2 py-1">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 mt-auto">
                        <Link href={`/rooms/${room.id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/10 text-primary rounded-none uppercase tracking-widest text-xs h-11">
                            {t.rooms.viewSuite}
                          </Button>
                        </Link>
                        <Link href={`/book?roomId=${room.id}`} className="flex-1">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest text-xs h-11">
                            {t.rooms.bookSuiteBtn}
                          </Button>
                        </Link>
                      </div>
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
