import { useState } from "react";
import { motion } from "framer-motion";
import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Compass } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferredContact: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const submitMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "email",
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitMutation.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "Our concierge team will contact you shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to Send",
            description: "Please try again or contact us directly via phone.",
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Contact & Location</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you require a reservation, transportation from the airport, or assistance crafting a personalized itinerary, our dedicated team is at your service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm tracking-widest uppercase text-foreground mb-2">Address</h4>
                    <p className="text-muted-foreground font-light text-sm leading-relaxed">
                      12 Rue de la Kasbah<br />
                      Medina, Marrakech 40000<br />
                      Morocco
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm tracking-widest uppercase text-foreground mb-2">Telephone</h4>
                    <p className="text-muted-foreground font-light text-sm">
                      <a href="tel:+212524389000" className="hover:text-primary transition-colors">+212 524 38 90 00</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm tracking-widest uppercase text-foreground mb-2">Email</h4>
                    <p className="text-muted-foreground font-light text-sm">
                      <a href="mailto:concierge@hotelberbere.com" className="hover:text-primary transition-colors">concierge@hotelberbere.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm tracking-widest uppercase text-foreground mb-2">Reception</h4>
                    <p className="text-muted-foreground font-light text-sm">
                      Available 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Compass size={120} />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-4 relative z-10">Les Clefs d'Or Concierge</h3>
              <p className="text-foreground/80 font-light text-sm leading-relaxed mb-6 relative z-10 max-w-md">
                Our concierge desk can arrange VIP airport transfers, private Medina tours, exclusive access to historical sites, and hard-to-get restaurant reservations.
              </p>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest text-xs h-10 relative z-10">
                Request Service Menu
              </Button>
            </div>

            <div className="h-[400px] w-full border border-primary/20 bg-muted relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13587.892695505089!2d-8.00164801314647!3d31.627705193952445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee9eb2811cb5%3A0x6b445763dc01f2e!2sMedina%20of%20Marrakesh!5e0!3m2!1sen!2sma!4v1709675305149!5m2!1sen!2sma" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "grayscale(1) contrast(1.2) brightness(0.8)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Le Berbère Location"
              ></iframe>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-card border border-primary/30 p-8 md:p-12"
          >
            <h3 className="text-3xl font-serif text-foreground mb-8">Send an Inquiry</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input className="rounded-none border-border bg-background focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Preferred Contact</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-border bg-background focus-visible:ring-primary h-12">
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-border bg-popover">
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-border bg-background focus-visible:ring-primary h-12">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border bg-popover">
                          <SelectItem value="reservation">Room Reservation</SelectItem>
                          <SelectItem value="dining">Dining Reservation</SelectItem>
                          <SelectItem value="spa">Spa & Hammam</SelectItem>
                          <SelectItem value="event">Private Event</SelectItem>
                          <SelectItem value="other">Other Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="rounded-none border-border bg-background focus-visible:ring-primary min-h-[150px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase h-14 mt-4"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
