"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, XCircle } from "lucide-react";

interface ScenariosSectionProps {
  scenariosInView: boolean;
}

export default function ScenariosSection({
  scenariosInView,
}: ScenariosSectionProps) {
  const scenarios = [
    {
      value: "buyer-backs-out",
      icon: XCircle,
      title: "Buyer Backs Out",
      iconColor: "emerald",
      description:
        "When a buyer changes their mind after payment but before delivery:",
      outcomes: [
        "Buyer loses 25% of payment as penalty",
        "Seller keeps their 10% stake + penalty",
        "Remaining 75% returned to buyer",
        "Validators earn small fee for processing",
      ],
    },
    {
      value: "seller-scams",
      icon: XCircle,
      title: "Seller Scams",
      iconColor: "green",
      description:
        "When a seller doesn't deliver or sends wrong/damaged items:",
      outcomes: [
        "Seller loses 100% of their stake",
        "Buyer gets full refund + seller's stake",
        "Seller gets blacklisted from platform",
        "Validators earn rewards for correct judgment",
      ],
    },
    {
      value: "successful-deal",
      icon: CheckCircle,
      title: "Successful Deal",
      iconColor: "emerald",
      description: "When everything goes smoothly and both parties are happy:",
      outcomes: [
        "Seller gets full payment + stake back",
        "Buyer receives item as described",
        "Both parties can leave reviews",
        "Platform takes small success fee (2%)",
        "Everyone builds reputation for future deals",
      ],
    },
  ];

  const iconColorClasses = {
    emerald: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600",
    green: "bg-green-100 dark:bg-green-900 text-green-600",
  };

  const bgColorClasses = {
    emerald: "bg-emerald-50 dark:bg-emerald-950",
    green: "bg-green-50 dark:bg-green-950",
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
            scenariosInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How Different Scenarios Play Out
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Transparency in action - see exactly what happens in each
              situation
            </p>
          </div>
        </div>
        <div
          className={`mx-auto max-w-3xl py-12 transition-all duration-1000 delay-300 ${
            scenariosInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon;

              return (
                <AccordionItem
                  key={index}
                  value={scenario.value}
                  className="border rounded-lg px-6 hover:shadow-lg transition-shadow"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 ${
                          iconColorClasses[
                            scenario.iconColor as keyof typeof iconColorClasses
                          ]
                        } rounded-full flex items-center justify-center`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{scenario.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        {scenario.description}
                      </p>
                      <div
                        className={`${
                          bgColorClasses[
                            scenario.iconColor as keyof typeof bgColorClasses
                          ]
                        } p-4 rounded-lg`}
                      >
                        <ul className="space-y-2 text-sm">
                          {scenario.outcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex}>• {outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
