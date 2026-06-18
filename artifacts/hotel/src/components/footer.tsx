import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { Instagram, Facebook, Youtube, Compass } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function Footer() {
  const { toast } = useToast();
  const subscribeMutation = useSubscribeNewsletter();

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof newsletterSchema>) {
    subscribeMutation.mutate(
      { data: { email: values.email } },
      {
        onSuccess: () => {
          toast({
            title: "Subscribed Successfully",
            description: "Welcome to the Hotel Le Berbère journal.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Subscription Failed",
            description: "There was an error subscribing. Please try again.",
          });
        },
      }
    );
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-primary/20 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z" fill="currentColor"/>
              </svg>
              <span className="font-serif text-2xl tracking-widest text-foreground">
                HOTEL LE BERBÈRE
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Where old-world Moroccan craftsmanship meets modern luxury. A sanctuary in the foothills of the Atlas Mountains.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Compass size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg text-foreground tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/rooms" className="text-muted-foreground hover:text-primary text-sm uppercase tracking-wider transition-colors">Suites & Rooms</Link></li>
              <li><Link href="/experiences" className="text-muted-foreground hover:text-primary text-sm uppercase tracking-wider transition-colors">Experiences</Link></li>
              <li><Link href="/restaurants" className="text-muted-foreground hover:text-primary text-sm uppercase tracking-wider transition-colors">Fine Dining</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary text-sm uppercase tracking-wider transition-colors">Gallery</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm uppercase tracking-wider transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg text-foreground tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li className="leading-relaxed">
                12 Rue de la Kasbah<br />
                Medina, Marrakech 40000<br />
                Morocco
              </li>
              <li><a href="tel:+212524389000" className="hover:text-primary transition-colors">+212 524 38 90 00</a></li>
              <li><a href="mailto:concierge@hotelberbere.com" className="hover:text-primary transition-colors">concierge@hotelberbere.com</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-serif text-lg text-foreground tracking-widest mb-6">The Journal</h4>
            <p className="text-muted-foreground text-sm mb-6">
              Subscribe to receive updates on exclusive offers, cultural events, and new culinary experiences.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="Email Address"
                            className="bg-transparent border-primary/30 rounded-none focus-visible:ring-primary text-sm"
                            {...field}
                          />
                          <Button 
                            type="submit" 
                            disabled={subscribeMutation.isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none border-y border-r border-primary uppercase tracking-widest text-xs px-6"
                          >
                            {subscribeMutation.isPending ? "..." : "Join"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Hotel Le Berbère. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary tracking-wider uppercase transition-colors">Admin</Link>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary tracking-wider uppercase transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary tracking-wider uppercase transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
