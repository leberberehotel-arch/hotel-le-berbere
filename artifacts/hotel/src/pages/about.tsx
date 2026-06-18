import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

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
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">{t.about.heading}</h1>
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
            <h2 className="text-primary tracking-widest uppercase text-sm mb-4 font-medium">{t.about.eyebrow}</h2>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-foreground leading-tight">
              {t.about.builtRestored.split(". ").map((part, i) => (
                <span key={i}>{part}{i === 0 ? "." : ""}{i === 0 ? <br /> : ""}</span>
              ))}
            </h3>
            <p className="text-foreground/80 font-light leading-relaxed mb-6">
              {t.about.storyPara1}
            </p>
            <p className="text-foreground/80 font-light leading-relaxed">
              {t.about.storyPara2}
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
            <h2 className="text-primary tracking-widest uppercase text-sm mb-6 font-medium">{t.about.philosophyEyebrow}</h2>
            <blockquote className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed italic mb-8">
              {t.about.philosophyQuote}
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
              <h3 className="text-3xl font-serif mb-6 text-foreground">{t.about.sustainabilityHeading}</h3>
              <p className="text-foreground/80 font-light leading-relaxed">
                {t.about.sustainabilityBody}
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">01</div>
                <div className="text-sm tracking-wide uppercase text-foreground">{t.about.stat1}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">02</div>
                <div className="text-sm tracking-wide uppercase text-foreground">{t.about.stat2}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-serif">03</div>
                <div className="text-sm tracking-wide uppercase text-foreground">{t.about.stat3}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
