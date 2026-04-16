"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import productsData from "@/data/products.json";

interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  persona: string;
  image: string;
  affiliateUrl: string;
  tags: string[];
  description: string;
}

const personas: Persona[] = productsData.personas;
const products: Product[] = productsData.products;

// Placeholder images for personas (using gradient backgrounds)
const personaGradients: Record<string, string> = {
  "new-parent": "from-amber-100 to-amber-200",
  "work-bestie": "from-sky-100 to-sky-200",
  minimalist: "from-stone-100 to-stone-200",
  techie: "from-violet-100 to-violet-200",
  partner: "from-rose-100 to-rose-200",
};

export default function Home() {
  const [activePersona, setActivePersona] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePersonaClick = (persona: Persona) => {
    // Track persona click
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "persona_click",
        persona: persona.id,
      }),
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);

    // Track product view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "product_view",
        productId: product.id,
        persona: product.persona,
      }),
    });
  };

  const handleBuyClick = (product: Product) => {
    // Redirect through tracking API
    const trackUrl = `/api/track?url=${encodeURIComponent(product.affiliateUrl)}&productId=${product.id}&persona=${product.persona}`;
    window.open(trackUrl, "_blank");
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 274; // 260px card + 14px gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActivePersona(Math.min(newIndex, personas.length - 1));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2 pt-5">
        <span className="text-[11px] font-semibold tracking-[2.4px] text-[#111111]">
          GIFTWISE
        </span>
        <div className="flex items-center gap-[18px]">
          <span className="text-[10px] font-medium tracking-[2px] text-[#666666]">
            EDITION 01
          </span>
          <Menu className="w-[18px] h-[18px] text-[#111111]" />
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-[#E7E8E5] w-full" />

      {/* Hero Block */}
      <section className="px-6 pt-14 pb-8 flex flex-col gap-5">
        <span className="text-[10px] font-semibold tracking-[3px] text-[#1B4332]">
          THE GIFTING CONCIERGE
        </span>
        <h1 className="font-serif text-[38px] italic font-normal leading-[1.1] text-[#111111]">
          Who are we
          <br />
          celebrating today?
        </h1>
        <p className="text-[14px] font-normal leading-[1.5] text-[#666666]">
          Pick a persona. We curate the rest — no endless scrolling, no gift
          guilt.
        </p>
      </section>

      {/* Meta Row */}
      <div className="flex items-center justify-between px-6 pb-5">
        <span className="text-[10px] font-medium tracking-[2px] text-[#111111]">
          5 PERSONAS · CURATED THIS WEEK
        </span>
        <span className="text-[10px] font-medium tracking-[2px] text-[#666666]">
          SWIPE &rarr;
        </span>
      </div>

      {/* Persona Rail */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-[14px] px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {personas.map((persona, index) => (
          <Link
            key={persona.id}
            href={`/persona/${persona.id}`}
            onClick={() => handlePersonaClick(persona)}
            className="flex-shrink-0 snap-start relative w-[260px] h-[325px] overflow-hidden group cursor-pointer"
          >
            {/* Background placeholder gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${personaGradients[persona.id] || "from-gray-100 to-gray-200"}`}
            />

            {/* Number badge */}
            <span className="absolute top-5 left-5 text-[11px] font-semibold tracking-[2px] text-white drop-shadow-md z-10">
              — 0{index + 1}
            </span>

            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-black/85 to-transparent" />

            {/* Persona name */}
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <h3 className="font-serif text-[26px] italic font-normal leading-[1.1] text-white">
                {persona.name.replace("The ", "The\n")}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-[6px] px-6 pt-6">
        {personas.map((_, index) => (
          <div
            key={index}
            className={`h-[2px] transition-all duration-300 ${
              index === activePersona
                ? "w-6 bg-[#111111]"
                : "w-3 bg-[#CBCCC9]"
            }`}
          />
        ))}
      </div>

      {/* Footer Quote */}
      <section className="flex flex-col gap-3 px-6 pt-12 pb-8 mt-auto">
        <span className="text-[10px] font-semibold tracking-[3px] text-[#1B4332]">
          A NOTE FROM MAMTA
        </span>
        <p className="font-serif text-[20px] italic font-normal leading-[1.35] text-[#111111]">
          &ldquo;A good gift doesn&apos;t shout. It knows.&rdquo;
        </p>
        <span className="text-[12px] font-normal text-[#666666]">
          — Curated weekly in Bombay
        </span>
      </section>

      {/* Product Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          {selectedProduct && (
            <>
              <DrawerHeader className="text-left">
                <div className="text-[10px] font-medium tracking-[2px] text-[#666666] mb-2">
                  MAMTA&apos;S CHOICE ·{" "}
                  {
                    personas.find((p) => p.id === selectedProduct.persona)?.name
                      .toUpperCase()
                      .replace("THE ", "")
                  }
                </div>
                <DrawerTitle className="font-serif text-2xl">
                  {selectedProduct.name}
                </DrawerTitle>
                <DrawerDescription>
                  {selectedProduct.description}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 flex flex-col gap-4">
                {/* Product image placeholder */}
                <div className="w-full h-[300px] bg-[#F2F3F0] rounded-lg" />

                {/* Product details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#666666]">
                      {selectedProduct.brand}
                    </p>
                    <p className="text-lg font-medium">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full border border-[#CBCCC9] text-[#666666]"
                      >
                        {tag === "under-2k"
                          ? "Under 2k"
                          : tag === "ships-48h"
                            ? "Ships in 48h"
                            : tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buy button */}
                <Button
                  onClick={() => handleBuyClick(selectedProduct)}
                  className="w-full h-12 bg-[#111111] hover:bg-[#333333] text-white rounded-full font-medium"
                >
                  Buy Now · {formatPrice(selectedProduct.price)}
                </Button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Quick Product Preview Section (for demonstration) */}
      {personas.length > 0 && (
        <section className="px-6 pb-8">
          <div className="h-px bg-[#E7E8E5] w-full mb-6" />
          <h2 className="text-[10px] font-semibold tracking-[3px] text-[#1B4332] mb-4">
            FEATURED PICKS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="text-left group"
              >
                <div className="w-full aspect-square bg-[#F2F3F0] rounded-lg mb-2 group-hover:bg-[#E7E8E5] transition-colors" />
                <h3 className="font-serif text-base">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-[#666666]">
                    {product.brand}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
