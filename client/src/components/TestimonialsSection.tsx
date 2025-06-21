"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  testimonialsInView: boolean;
}

export default function TestimonialsSection({
  testimonialsInView,
}: TestimonialsSectionProps) {
  const testimonials = [
    {
      name: "Alex Chen",
      initial: "A",
      color: "green",
      text: "Sold my MacBook through Crailo and felt completely secure. The escrow system gave both me and the buyer confidence. No more sketchy meetups!",
      delay: 0,
    },
    {
      name: "Sarah Johnson",
      initial: "S",
      color: "emerald",
      text: "As a validator, I've earned over 500 CRAILO tokens helping resolve disputes. It's rewarding to help build a fairer marketplace.",
      delay: 200,
    },
    {
      name: "Mike Rodriguez",
      initial: "M",
      color: "green",
      text: "Bought a gaming setup worth $2000. The seller's stake gave me confidence, and the validators resolved a minor issue quickly. Love this platform!",
      delay: 400,
    },
  ];

  return (
    <section id="community" className="w-full py-12 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center justify-center space-y-6 text-center transition-all duration-1000 ${
            testimonialsInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Trusted by Our Community
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Real stories from real users who've experienced safer trading
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer ${
                testimonialsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: testimonialsInView
                  ? `${testimonial.delay}ms`
                  : "0ms",
              }}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br from-${testimonial.color}-400 to-${testimonial.color}-600 rounded-full flex items-center justify-center text-white font-semibold hover:scale-110 transition-transform`}
                  >
                    {testimonial.initial}
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">
                      {testimonial.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
