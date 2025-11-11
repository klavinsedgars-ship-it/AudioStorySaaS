import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Sparkles, User, Mic, BookHeart, Gift, Wand2, Globe, Moon, Heart, Brain, Star, Shield, MonitorOff, Baby } from "lucide-react";
import { CREDIT_PACKAGES } from "@shared/schema";
import { Helmet } from "react-helmet";
import { ScallopedDivider } from "@/components/ScallopedDivider";
import { FloatingBook } from "@/components/FloatingBook";
import { MagicalSparkles } from "@/components/MagicalSparkles";

export default function Landing() {
  const { t } = useTranslation();

  const valueProps = [
    {
      icon: Moon,
      title: "Perfect Bedtime Routine",
      description: "Transform bedtime battles into magical moments. Every story features your child as the hero, making sleep time their favorite part of the day."
    },
    {
      icon: MonitorOff,
      title: "Screen-Free Magic",
      description: "Give their eyes a break from screens. Professional-quality audio stories that spark imagination without the blue light."
    },
    {
      icon: Heart,
      title: "Fully Personalized",
      description: "Their name, their adventures, their story. Watch their faces light up when they hear themselves in a magical tale crafted just for them."
    },
    {
      icon: Globe,
      title: "9+ Languages Available",
      description: "Perfect for bilingual families! Create stories in English, Spanish, French, German, Portuguese, Italian, Dutch, Polish, or Japanese."
    },
    {
      icon: Brain,
      title: "Sparks Imagination & Learning",
      description: "Every story teaches values like courage, kindness, and creativity while keeping kids engaged and entertained."
    },
    {
      icon: BookHeart,
      title: "Keepsake Memories",
      description: "Download and keep forever. These aren't just stories—they're memories you'll treasure for years to come."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mom of two (Ages 4 & 7)",
      rating: 5,
      text: "My kids beg for 'their stories' every single night now! We've created 12 different adventures and they never get tired of hearing their names in the tales. Best parenting tool I've found.",
      stories: 12
    },
    {
      name: "Carlos R.",
      role: "Dad of Emma (Age 5)",
      rating: 5,
      text: "As a bilingual family, having stories in both English and Spanish is incredible. Emma loves being the hero in both languages, and it's helping her language development too!",
      stories: 8
    },
    {
      name: "Jennifer L.",
      role: "Mom of three (Ages 3, 6, 9)",
      rating: 5,
      text: "Bedtime used to be chaos. Now all three kids settle down instantly when I say 'story time.' The quality is amazing—sounds like professional audiobooks!",
      stories: 15
    }
  ];

  const faqs = [
    {
      question: "How personalized are the stories really?",
      answer: "Every story features your child's exact name throughout the entire narrative. They're not just mentioned once—they're the star of the adventure! You can also add names of siblings, friends, or pets to make it even more special."
    },
    {
      question: "What's the audio quality like?",
      answer: "Professional narrator quality! We use advanced AI voice technology that sounds natural, warm, and engaging—perfect for bedtime listening. Many parents tell us it rivals expensive audiobook productions."
    },
    {
      question: "What age range are these stories for?",
      answer: "Our stories are perfect for children ages 3-10. Each theme is crafted to be age-appropriate, engaging for young listeners while remaining wholesome and educational."
    },
    {
      question: "Do credits really never expire?",
      answer: "Never! Buy credits once and use them whenever you want—next week, next year, or save them for future kids or grandkids. No subscriptions, no pressure, no expiration."
    },
    {
      question: "Can I download the stories?",
      answer: "Absolutely! Every story and illustration you create can be downloaded and kept forever. Listen offline, share with family, or save them as precious keepsakes."
    },
    {
      question: "What if my child doesn't like the story?",
      answer: "You can generate unlimited text previews for free! Only use a credit when you absolutely love the story and want the professional audio version. Plus, you can try again with different themes anytime."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Personalized Audio Stories | Make Your Child The Hero</title>
        <meta name="description" content="Create magical bedtime stories where your child is the hero. Professional-quality personalized audio stories in 9+ languages. Screen-free, AI-powered, memories that last forever." />
        <meta property="og:title" content="Personalized Audio Stories | Make Your Child The Hero" />
        <meta property="og:description" content="Create magical bedtime stories where your child is the hero. Professional-quality personalized audio stories in 9+ languages." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Floating decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10">
            <FloatingBook delay={0} />
          </div>
          <div className="absolute top-40 right-20">
            <FloatingBook delay={1} />
          </div>
          <div className="absolute bottom-40 left-20">
            <FloatingBook delay={2} />
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 dark:from-purple-950/40 dark:via-background dark:to-background">
          <MagicalSparkles count={8} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Text */}
              <div className="space-y-8 text-center lg:text-left z-10">
                <div className="inline-block">
                  <Badge variant="magical" className="mb-4 text-base px-6 py-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Join 10,000+ Happy Families
                  </Badge>
                </div>
                
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Every Child Deserves to Be
                  </span>
                  <br />
                  <span className="text-primary">
                    The Hero of Their Own Story
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl">
                  Create personalized audio bedtime stories where <strong>your child is the star</strong>. 
                  Screen-free magic that turns bedtime battles into favorite family moments.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/api/login">
                    <Button size="lg" variant="magical" className="group" data-testid="button-hero-cta">
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Create Your First Story Free
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                    View Pricing
                  </Button>
                </div>

                <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">4.9/5</span> from parents
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>No subscription required</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative">
                    <BookHeart className="w-full h-full text-primary/20 gentle-float" strokeWidth={0.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Sparkles className="w-20 h-20 text-primary mx-auto sparkle-effect" />
                        <p className="text-2xl font-display font-bold text-primary">500,000+</p>
                        <p className="text-lg text-muted-foreground">Stories Created</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScallopedDivider />

        {/* VALUE PROPOSITIONS */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Why Parents Love Our Stories
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                More than just entertainment—it's a tool that makes parenting easier and childhood more magical
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {valueProps.map((prop, index) => (
                <Card key={index} className="group hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <prop.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <ScallopedDivider flip />

        {/* HOW IT WORKS */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Create Magic in 3 Simple Steps
              </h2>
              <p className="text-xl text-muted-foreground">
                From idea to audio story in under 2 minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center relative overflow-visible">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg">
                  1
                </div>
                <CardContent className="pt-12 pb-8 px-8">
                  <User className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-3">Name Your Hero</h3>
                  <p className="text-muted-foreground">Enter your child's name and choose their adventure theme</p>
                </CardContent>
              </Card>

              <Card className="text-center relative overflow-visible">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg">
                  2
                </div>
                <CardContent className="pt-12 pb-8 px-8">
                  <Wand2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-3">Preview & Approve</h3>
                  <p className="text-muted-foreground">Read the story for free—only use a credit when you love it!</p>
                </CardContent>
              </Card>

              <Card className="text-center relative overflow-visible">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg">
                  3
                </div>
                <CardContent className="pt-12 pb-8 px-8">
                  <Mic className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-3">Get Your Story</h3>
                  <p className="text-muted-foreground">Professional audio + beautiful illustration in 90 seconds</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <ScallopedDivider />

        {/* TESTIMONIALS */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                What Parents Are Saying
              </h2>
              <p className="text-xl text-muted-foreground">
                Real stories from real families
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="border-t pt-4">
                      <p className="font-display font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary mt-2">{testimonial.stories} stories created</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <ScallopedDivider flip />

        {/* PRICING */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <Badge variant="magical" className="mb-6 text-lg px-8 py-3">
                <Gift className="w-5 h-5 mr-2" />
                Launch Special - No Subscription, Credits Never Expire!
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Simple, Honest Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Pay once, keep forever. No monthly fees, no surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {CREDIT_PACKAGES.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative flex flex-col ${pkg.popular ? 'border-primary/60 shadow-2xl scale-105 magical-glow' : ''}`}
                  data-testid={`card-package-${index}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                      <Badge variant="magical" className="text-base px-6 py-2 shadow-xl">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Most Popular - Save 40%
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4 pt-10 text-center">
                    <CardTitle className="font-display text-6xl font-bold mb-3 text-primary">
                      {pkg.credits}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">Stories</p>
                    <div className="text-5xl font-bold mb-2">${pkg.price}</div>
                    <p className="text-sm text-muted-foreground">
                      ${(pkg.price / pkg.credits).toFixed(2)} per story
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 p-8 pt-6">
                    <ul className="space-y-4 flex-1 mb-8">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{pkg.credits} personalized audio stories</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Beautiful illustrations included</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Unlimited text previews (free!)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Download & keep forever</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>9+ languages available</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Credits never expire</span>
                      </li>
                    </ul>

                    <a href="/api/login" className="w-full">
                      <Button
                        variant={pkg.popular ? "magical" : "default"}
                        className="w-full"
                        size="lg"
                        data-testid={`button-buy-${index}`}
                      >
                        Get Started
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-12 max-w-2xl mx-auto">
              <Shield className="w-4 h-4 inline mr-2" />
              30-day money-back guarantee. If you're not absolutely delighted, we'll refund you—no questions asked.
            </p>
          </div>
        </section>

        <ScallopedDivider />

        {/* FAQ */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-2xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <ScallopedDivider flip />

        {/* FINAL CTA */}
        <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white relative overflow-hidden">
          <MagicalSparkles count={12} />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
            <Wand2 className="w-20 h-20 mx-auto mb-8 gentle-float" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Make Bedtime Magical?
            </h2>
            <p className="text-2xl mb-10 text-white/90 leading-relaxed">
              Join 10,000+ families creating cherished memories, one story at a time
            </p>
            <a href="/api/login">
              <Button 
                size="lg"
                variant="secondary"
                className="text-xl px-12 py-8 h-auto shadow-2xl hover:scale-110 transition-transform"
                data-testid="button-final-cta"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Create Your First Story Free
              </Button>
            </a>
            <p className="text-sm text-white/70 mt-8">
              No credit card required to start • Unlimited text previews forever
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
