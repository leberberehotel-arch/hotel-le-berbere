import { useGetRoom } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookingWidget } from "@/components/booking-widget";
import { Button } from "@/components/ui/button";
import { Bed, Users, Maximize, ArrowLeft, Check, Compass, Wine, Wifi, Coffee } from "lucide-react";

export default function RoomDetail({ params }: { params: { id: string } }) {
  const roomId = parseInt(params.id, 10);
  const { data: room, isLoading } = useGetRoom(roomId, { query: { enabled: !!roomId } });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full pt-32 pb-24 bg-background flex flex-col items-center">
        <div className="w-full h-[60vh] bg-card animate-pulse border-b border-border" />
        <div className="container mx-auto px-6 max-w-4xl mt-12">
          <div className="h-10 w-1/3 bg-card animate-pulse mb-6" />
          <div className="h-4 w-2/3 bg-card animate-pulse mb-4" />
          <div className="h-4 w-full bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen w-full pt-32 pb-24 bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Suite Not Found</h1>
        <Link href="/rooms">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none tracking-widest uppercase">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Residences
          </Button>
        </Link>
      </div>
    );
  }

  // Helper to map amenity string to an icon
  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes("wifi") || a.includes("internet")) return <Wifi className="h-5 w-5 text-primary" />;
    if (a.includes("bar") || a.includes("wine")) return <Wine className="h-5 w-5 text-primary" />;
    if (a.includes("coffee") || a.includes("tea")) return <Coffee className="h-5 w-5 text-primary" />;
    return <Check className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="min-h-screen w-full bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-[70vh] w-full border-b border-primary/20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute top-24 left-6 md:left-12 z-10">
          <Link href="/rooms">
            <Button variant="link" className="text-foreground/80 hover:text-primary p-0 tracking-widest uppercase text-xs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Residences
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-5xl -mt-32 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-primary/30 p-8 md:p-12 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-border pb-8">
            <div>
              <div className="text-primary tracking-widest uppercase text-xs mb-3 font-medium">
                {room.category.replace('-', ' ')}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2"><Maximize className="h-4 w-4 text-primary" /> {room.size} sqm</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Up to {room.maxGuests} Guests</div>
                {room.bedType && <div className="flex items-center gap-2"><Bed className="h-4 w-4 text-primary" /> {room.bedType}</div>}
              </div>
            </div>
            
            <div className="text-left md:text-right w-full md:w-auto">
              <div className="text-3xl md:text-4xl font-serif text-foreground mb-1">${room.pricePerNight}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-6">Per Night</div>
              <Link href={`/book?room=${room.id}`}>
                <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase px-8 h-12">
                  Reserve This Suite
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif mb-6 text-foreground">The Experience</h3>
              <p className="text-foreground/80 font-light leading-relaxed whitespace-pre-line text-lg mb-8">
                {room.description}
              </p>
              
              <h3 className="text-2xl font-serif mb-6 text-foreground border-t border-border pt-8">Suite Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-foreground/80 font-light text-sm">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              <div className="bg-background border border-border p-6">
                <h4 className="font-serif text-lg mb-4 text-foreground text-center">Concierge Services</h4>
                <p className="text-muted-foreground text-sm font-light text-center mb-6">
                  Available 24/7 to arrange private dining, hammam treatments, and excursions.
                </p>
                <Button variant="outline" className="w-full border-primary/30 rounded-none tracking-widest uppercase text-xs h-10">
                  <Compass className="mr-2 h-4 w-4 text-primary" /> Request Service
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-5xl mt-24">
        <h2 className="text-3xl font-serif mb-8 text-center">Check Availability</h2>
        <BookingWidget className="mx-auto" />
      </div>

      {/* Image Gallery */}
      {room.images.length > 1 && (
        <div className="container mx-auto px-6 md:px-12 max-w-7xl mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {room.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative h-[300px] md:h-[400px] overflow-hidden border border-border group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${img})` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
