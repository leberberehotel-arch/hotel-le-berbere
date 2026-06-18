import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckAvailability, useCreateBooking, useConfirmBooking } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Form schemas
const guestSchema = z.object({
  guestName: z.string().min(2, "Full name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

const paymentSchema = z.object({
  cardholderName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().min(16, "Valid card number required"),
  expiry: z.string().min(5, "MM/YY required"),
  cvv: z.string().min(3, "CVV required"),
});

export default function Book() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkIn") ? new Date(searchParams.get("checkIn") as string) : new Date()
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkOut") ? new Date(searchParams.get("checkOut") as string) : addDays(new Date(), 2)
  );
  const [guests, setGuests] = useState<string>(searchParams.get("guests") || "2");
  
  const [selectedRoom, setSelectedRoom] = useState<number | null>(
    searchParams.get("room") ? parseInt(searchParams.get("room") as string) : null
  );
  
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const { data: availability, isLoading: isChecking, refetch: checkAvailability } = useCheckAvailability(
    {
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : "",
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : "",
      guests: parseInt(guests, 10)
    },
    { query: { enabled: false } }
  );

  const createBookingMutation = useCreateBooking();
  const confirmBookingMutation = useConfirmBooking();

  const guestForm = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
    defaultValues: { guestName: "", guestEmail: "", guestPhone: "", specialRequests: "" },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardholderName: "", cardNumber: "", expiry: "", cvv: "" },
  });

  // Automatically check availability on load if we have dates
  useEffect(() => {
    if (checkIn && checkOut) {
      checkAvailability();
      // If we have a room pre-selected but we're on step 1, move to step 2
      if (selectedRoom && step === 1) {
        setStep(2);
      }
    }
  }, []);

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    checkAvailability();
    setStep(2);
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoom(roomId);
    setStep(3);
  };

  const onGuestSubmit = (data: z.infer<typeof guestSchema>) => {
    if (!selectedRoom || !checkIn || !checkOut) return;
    
    createBookingMutation.mutate(
      {
        data: {
          roomId: selectedRoom,
          checkIn: format(checkIn, "yyyy-MM-dd"),
          checkOut: format(checkOut, "yyyy-MM-dd"),
          guests: parseInt(guests, 10),
          ...data
        }
      },
      {
        onSuccess: (booking) => {
          setBookingId(booking.id);
          setStep(4);
        }
      }
    );
  };

  const onPaymentSubmit = (data: z.infer<typeof paymentSchema>) => {
    if (!bookingId) return;
    
    confirmBookingMutation.mutate(
      {
        id: bookingId,
        data: {
          cardholderName: data.cardholderName,
          cardLast4: data.cardNumber.slice(-4),
          paymentMethod: "credit_card"
        }
      },
      {
        onSuccess: (booking) => {
          setConfirmationCode(booking.confirmationCode);
          setStep(5);
        }
      }
    );
  };

  // Steps
  const steps = [
    { num: 1, label: "Search" },
    { num: 2, label: "Select Suite" },
    { num: 3, label: "Guest Details" },
    { num: 4, label: "Payment" },
  ];

  return (
    <div className="min-h-screen w-full pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        {step < 5 && (
          <div className="mb-16">
            <h1 className="text-4xl font-serif text-foreground text-center mb-10">Reserve Your Stay</h1>
            
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border -z-10" />
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-3 bg-background px-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm border ${
                    step > s.num ? "bg-primary border-primary text-primary-foreground" :
                    step === s.num ? "bg-card border-primary text-primary" :
                    "bg-background border-border text-muted-foreground"
                  }`}>
                    {step > s.num ? <Check size={16} /> : s.num}
                  </div>
                  <span className={`text-xs uppercase tracking-widest ${
                    step >= s.num ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SEARCH */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-card border border-border p-8 md:p-12 max-w-3xl mx-auto"
              >
                <h3 className="text-2xl font-serif mb-8 text-center text-foreground">Select Your Dates</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background border-border rounded-none h-14", !checkIn && "text-muted-foreground")}>
                            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                            {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-primary/30 rounded-none" align="start">
                          <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background border-border rounded-none h-14", !checkOut && "text-muted-foreground")}>
                            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                            {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-primary/30 rounded-none" align="start">
                          <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => checkIn ? date <= checkIn : date < new Date()} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="w-full bg-background border-border rounded-none h-14">
                        <Users className="mr-3 h-5 w-5 text-primary" />
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent className="border-border rounded-none">
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleSearch} 
                    disabled={!checkIn || !checkOut}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase h-14 mt-4"
                  >
                    Check Availability <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROOM SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground hover:bg-transparent p-0 uppercase tracking-widest text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Change Search
                  </Button>
                  {checkIn && checkOut && (
                    <div className="text-sm font-light text-foreground/80">
                      {format(checkIn, "MMM dd")} - {format(checkOut, "MMM dd")} • {availability?.nights || 0} Nights • {guests} Guests
                    </div>
                  )}
                </div>

                {isChecking ? (
                  <div className="space-y-6">
                    {[1,2,3].map(i => <div key={i} className="h-64 bg-card animate-pulse border border-border" />)}
                  </div>
                ) : availability?.availableRooms.length === 0 ? (
                  <div className="bg-card border border-border p-12 text-center">
                    <h3 className="text-2xl font-serif text-foreground mb-4">No Availability</h3>
                    <p className="text-muted-foreground font-light mb-8">We are fully booked for your selected dates. Please try altering your search.</p>
                    <Button onClick={() => setStep(1)} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest">
                      Search New Dates
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {availability?.availableRooms.map(room => (
                      <div key={room.id} className="bg-card border border-border flex flex-col md:flex-row overflow-hidden group">
                        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${room.images[0]})` }} />
                        </div>
                        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-primary text-[10px] uppercase tracking-widest mb-1">{room.category.replace('-',' ')}</div>
                              <h3 className="text-2xl font-serif text-foreground">{room.name}</h3>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-serif text-foreground">${room.pricePerNight}</div>
                              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Per Night</div>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm font-light line-clamp-2 mb-6">{room.shortDescription || room.description}</p>
                          <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                            <div className="text-sm font-medium text-foreground">Total: ${room.pricePerNight * (availability.nights || 1)}</div>
                            <Button 
                              onClick={() => handleSelectRoom(room.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest text-xs px-6"
                            >
                              Select Suite
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: GUEST DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-8">
                  <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground hover:bg-transparent p-0 uppercase tracking-widest text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Change Suite
                  </Button>
                </div>

                <div className="bg-card border border-primary/30 p-8 md:p-12 shadow-xl">
                  <h3 className="text-3xl font-serif text-foreground mb-8">Guest Details</h3>
                  
                  <Form {...guestForm}>
                    <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-6">
                      <FormField
                        control={guestForm.control}
                        name="guestName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name *</FormLabel>
                            <FormControl><Input className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={guestForm.control}
                          name="guestEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email Address *</FormLabel>
                              <FormControl><Input type="email" className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={guestForm.control}
                          name="guestPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                              <FormControl><Input className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={guestForm.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Special Requests</FormLabel>
                            <FormControl>
                              <Textarea className="rounded-none border-border bg-background focus-visible:ring-primary min-h-[120px] resize-none" placeholder="Allergies, arrival time, special occasions..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={createBookingMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase h-14 mt-8">
                        {createBookingMutation.isPending ? "Processing..." : "Continue to Payment"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-card border border-primary/30 p-8 md:p-12 shadow-xl">
                  <h3 className="text-3xl font-serif text-foreground mb-8">Secure Payment</h3>
                  
                  <div className="bg-background border border-border p-6 mb-8 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Total Amount</div>
                      <div className="text-2xl font-serif text-foreground">
                        ${availability?.availableRooms.find(r => r.id === selectedRoom)?.pricePerNight! * (availability?.nights || 1)}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground font-light">
                      Includes all taxes and fees.<br/>Secure encrypted transaction.
                    </div>
                  </div>

                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                      <FormField
                        control={paymentForm.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Name on Card</FormLabel>
                            <FormControl><Input className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Card Number</FormLabel>
                            <FormControl><Input placeholder="0000 0000 0000 0000" className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={paymentForm.control}
                          name="expiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Expiry Date</FormLabel>
                              <FormControl><Input placeholder="MM/YY" className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">CVV</FormLabel>
                              <FormControl><Input type="password" placeholder="123" maxLength={4} className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={confirmBookingMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase h-14 mt-8 relative overflow-hidden group">
                        <span className="relative z-10">{confirmBookingMutation.isPending ? "Confirming..." : "Confirm & Pay"}</span>
                        {!confirmBookingMutation.isPending && (
                          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            )}

            {/* STEP 5: CONFIRMATION */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-12"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary text-primary flex items-center justify-center mx-auto mb-8">
                  <Check size={40} />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Reservation Confirmed</h2>
                <p className="text-foreground/80 font-light text-lg mb-8">We look forward to welcoming you to Riad Lumière.</p>
                
                <div className="bg-card border border-primary/30 p-8 mb-8 inline-block text-left w-full max-w-md">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 text-center">Confirmation Code</div>
                  <div className="text-3xl font-mono text-primary text-center mb-8 tracking-widest">{confirmationCode}</div>
                  
                  <div className="space-y-4 text-sm border-t border-border pt-6">
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="text-foreground">{checkIn && format(checkIn, "MMM dd, yyyy")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="text-foreground">{checkOut && format(checkOut, "MMM dd, yyyy")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="text-foreground">{guests}</span></div>
                  </div>
                </div>
                
                <div>
                  <Link href="/">
                    <Button variant="link" className="text-foreground hover:text-primary tracking-widest uppercase text-xs">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
