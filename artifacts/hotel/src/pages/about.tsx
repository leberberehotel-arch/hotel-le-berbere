import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] w-full border-b border-primary/20 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=1600')` }}
        />
        <div className="absolute inset-0 bg-background/60" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Our Heritage</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-5xl py-24">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary tracking-widest uppercase text-sm mb-4 font-medium">A Century of Elegance</h2>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground leading-tight">Built in 1923. <br />Restored in 2019.</h3>
            <p className="text-foreground/80 font-light leading-relaxed mb-6">
              Hotel Le Berbère began as the private residence of a prominent silk merchant. For decades, its heavy cedar doors shielded a sanctuary of quiet beauty from the bustling medina outside. 
            </p>
            <p className="text-foreground/80 font-light leading-relaxed">
              When we acquired the property in 2017, our mission was simple: preserve the soul of the riad while elevating it to meet the expectations of the modern luxury traveler. We spent two years working exclusively with local artisans — master carvers, zellige tile layers, and tadelakt plasterers — to restore every inch of the estate by hand.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] border border-primary/20 p-2"
          >
            <div 
              className="absolute inset-2 bg-cover bg-center"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800')` }}
            />
          </motion.div>
        </div>

        {/* Philosophy */}
        <div className="mb-32 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary tracking-widest uppercase text-sm mb-6 font-medium">Our Philosophy</h2>
            <blockquote className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed italic mb-8">
              "True luxury is not loud. It is the texture of hand-woven linen, the scent of orange blossoms in the courtyard, and the feeling that time itself has decided to slow down."
            </blockquote>
            <div className="w-16 h-[1px] bg-primary mx-auto" />
          </motion.div>
        </div>

        {/* Sustainability */}
        <div className="bg-card border border-border p-8 md:p-16 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div>
              <h3 className="text-3xl font-serif mb-6 text-foreground">Sustainability Commitment</h3>
              <p className="text-foreground/80 font-light leading-relaxed">
                Our connection to the Atlas Mountains and the vibrant city of Marrakech comes with a responsibility to protect them. Hotel Le Berbère is a zero-single-use-plastic property. Our kitchens source 90% of ingredients from organic farms within a 50-kilometer radius, and our bath amenities are crafted locally using sustainably harvested argan oil and indigenous botanicals.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">01</div>
                <div className="text-sm tracking-wide uppercase text-foreground">Zero Single-Use Plastic</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">02</div>
                <div className="text-sm tracking-wide uppercase text-foreground">Solar Water Heating</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">03</div>
                <div className="text-sm tracking-wide uppercase text-foreground">Community Artisan Support</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
