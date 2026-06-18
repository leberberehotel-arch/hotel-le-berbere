import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListRestaurants, useReserveRestaurant } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChefHat, Clock } from "lucide-react";

const reservationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.coerce.number().min(1, "At least 1 guest").max(20, "Max 20 guests"),
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email required"),
  specialRequests: z.string().optional(),
});

export default function Restaurants() {
  const { data: restaurants, isLoading } = useListRestaurants();
  const reserveMutation = useReserveRestaurant();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: "",
      time: "",
      guests: 2,
      guestName: "",
      guestEmail: "",
      specialRequests: "",
    },
  });

  const onSubmit = (restaurantId: number, data: z.infer<typeof reservationSchema>) => {
    reserveMutation.mutate(
      { id: restaurantId, data },
      {
        onSuccess: () => {
          toast({
            title: "Reservation Confirmed",
            description: "We look forward to welcoming you.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Reservation Failed",
            description: "Please try again or contact the concierge.",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Culinary Journeys</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the rich tapestry of Moroccan flavors and international gastronomy, crafted by masterful chefs in breathtaking settings.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-24">
            {[1, 2].map(i => (
              <div key={i} className="h-[600px] bg-card animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-32">
            {restaurants?.map((restaurant, idx) => (
              <motion.div 
                key={restaurant.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative h-[500px] lg:h-[700px] w-full overflow-hidden border border-primary/20 p-2 group">
                    <div 
                      className="absolute inset-2 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url(${restaurant.images[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200'})` }}
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-start">
                  <div className="text-primary tracking-widest uppercase text-xs mb-4 font-medium">
                    {restaurant.cuisine} Cuisine
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-serif mb-6 text-foreground">{restaurant.name}</h2>
                  <p className="text-foreground/80 font-light leading-relaxed text-lg mb-8">
                    {restaurant.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 mb-10 w-full border-y border-border py-6">
                    {restaurant.chefName && (
                      <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <ChefHat className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest font-medium">Executive Chef</span>
                        </div>
                        <div className="text-foreground font-serif">{restaurant.chefName}</div>
                      </div>
                    )}
                    {restaurant.openHours && (
                      <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest font-medium">Hours</span>
                        </div>
                        <div className="text-foreground font-serif">{restaurant.openHours}</div>
                      </div>
                    )}
                    {restaurant.dressCode && (
                      <div className="col-span-2">
                        <div className="text-xs uppercase tracking-widest font-medium text-primary mb-1">Dress Code</div>
                        <div className="text-sm text-muted-foreground">{restaurant.dressCode}</div>
                      </div>
                    )}
                  </div>

                  {restaurant.menuHighlights && restaurant.menuHighlights.length > 0 && (
                    <div className="mb-10 w-full">
                      <h4 className="text-sm uppercase tracking-widest text-primary mb-4">Menu Highlights</h4>
                      <ul className="space-y-2">
                        {restaurant.menuHighlights.map((item, i) => (
                          <li key={i} className="text-sm font-light text-foreground/80 flex items-start gap-2">
                            <span className="text-primary mt-1">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest px-8 h-12">
                        Reserve a Table
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card border border-primary/30 rounded-none p-0 overflow-hidden">
                      <div className="bg-background border-b border-primary/20 p-6 text-center">
                        <DialogTitle className="text-2xl font-serif text-foreground font-normal">Reserve at {restaurant.name}</DialogTitle>
                      </div>
                      <div className="p-6">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit((data) => onSubmit(restaurant.id, data))} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" className="rounded-none border-primary/30 bg-background focus-visible:ring-primary h-12" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Time</FormLabel>
                                    <FormControl>
                                      <Input type="time" className="rounded-none border-primary/30 bg-background focus-visible:ring-primary h-12" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="guests"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Number of Guests</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                    <FormControl>
                                      <SelectTrigger className="rounded-none border-primary/30 bg-background focus-visible:ring-primary h-12">
                                        <SelectValue placeholder="Select guests" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-primary/30 bg-popover">
                                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="guestName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                                  <FormControl>
                                    <Input className="rounded-none border-primary/30 bg-background focus-visible:ring-primary h-12" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="guestEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" className="rounded-none border-primary/30 bg-background focus-visible:ring-primary h-12" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button 
                              type="submit" 
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase mt-4 h-12"
                              disabled={reserveMutation.isPending}
                            >
                              {reserveMutation.isPending ? "Confirming..." : "Confirm Reservation"}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
