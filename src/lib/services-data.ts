export type MenuItemType = "price-row" | "named-card" | "spa-card";

export interface PriceRowItem {
  type: "price-row";
  name: string;
  price: string;
  priceAlt?: string;
  note?: string;
}

export interface NamedCardItem {
  type: "named-card";
  name: string;
  price: string;
  duration: string;
  description: string;
}

export interface SpaCardItem {
  type: "spa-card";
  name: string;
  price: string;
  duration: string;
  intro: string;
  bullets: string[];
}

export type MenuItem = PriceRowItem | NamedCardItem | SpaCardItem;

export interface MenuSubGroup {
  heading?: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  label: string;
  heading: string;
  note?: string;
  addOns?: string[];
  footnote?: string;
  groups: MenuSubGroup[];
}

export const menuSections: MenuSection[] = [
  {
    id: "nail-enhancements",
    label: "Nail Enhancements",
    heading: "NAIL ENHANCEMENTS",
    footnote: "Prices may vary depending on shape and length",
    groups: [
      {
        heading: "ACRYLIC",
        items: [
          {
            type: "price-row",
            name: "Color Powder",
            price: "Full Set $47+",
            priceAlt: "Refill $45+",
          },
          {
            type: "price-row",
            name: "Powder with Gel Polish",
            price: "Full Set $53+",
            priceAlt: "Refill $48+",
          },
          {
            type: "price-row",
            name: "Ombre (2 Colors)",
            price: "Full Set $60+",
            priceAlt: "Refill $55+",
          },
        ],
      },
      {
        heading: "GEL BUILDER",
        items: [
          {
            type: "price-row",
            name: "Gel Builder Color",
            price: "Full Set $60+",
            priceAlt: "Refill $55+",
          },
          {
            type: "price-row",
            name: "Gel Builder with Gel Polish",
            price: "Full Set $65+",
            priceAlt: "Refill $60+",
          },
          {
            type: "price-row",
            name: "Gel Builder w/ Nail Extension",
            price: "$8+",
          },
        ],
      },
      {
        heading: "GEL X",
        items: [
          {
            type: "price-row",
            name: "Gel X with Shellac Color",
            price: "$63+",
          },
        ],
      },
      {
        heading: "DIPPING POWDER",
        items: [
          { type: "price-row", name: "Dip Powder", price: "$47+" },
          { type: "price-row", name: "Dip w/ Nail Extension", price: "+$8" },
          {
            type: "price-row",
            name: "Dip Removal (with same service)",
            price: "+$5",
          },
        ],
      },
      {
        heading: "DUAL FORM",
        items: [
          {
            type: "price-row",
            name: "Dual Form Color",
            price: "Full Set $70+",
            priceAlt: "Refill $65+",
          },
          {
            type: "price-row",
            name: "Dual Form with Shellac",
            price: "Full Set $75+",
            priceAlt: "Refill $70+",
          },
        ],
      },
    ],
  },
  {
    id: "pedicures",
    label: "Pedicures",
    heading: "PEDICURES",
    note: "All pedicures include essential nail care, gentle callus smoothing, and your choice of polish.",
    addOns: [
      "Gel Polish Add-On: +$17",
      "French Tip: +$8",                                              
      "Gel Removal: +$5 (Complimentary with new gel service)",
    ],
    groups: [
      {
        items: [
          {
            type: "named-card",
            name: "Iconix 24K Golden Bliss",
            price: "$85",
            duration: "70 mins",  
            description:
              "Warm Neck Wrap, Bath Bomb Soak, 24K Gold Sugar Scrub with Fresh Orange, Gold Jelly Mask, Collagen Socks & Creamy Gold Mask with Hot Towel Infusion, Warm Candle Oil Massage with 20-min Hot Stone Therapy, Steamer & 7-min Relaxation Massage, Fresh Cucumber Mask Finish with 24K Gold Serum Infusion.",
          },
          {
            type: "named-card",
            name: "Champagne Kiss",
            price: "$75",
            duration: "65 mins",
            description:
              "Champagne & Rose Soak, Delicate Sugar Exfoliation, Collagen Socks & Hydrating Mask with Hot Towel Wrap, Warm Candle Oil Massage with 15-min Hot Stone Therapy, Steamer & 6-min Relaxation Massage, Fresh Cucumber Mask.",
          },
          {
            type: "named-card",
            name: "Jelly Glow",
            price: "$72",
            duration: "60 mins",
            description:
              "Warm Neck Wrap, Warm Jelly Soak, Exfoliating Sugar Scrub, Moisturizing Mask with Hot Towel Wrap, Warm Paraffin Wax, 14-min Hot Stone Massage with Steamer & 5-min Relaxation Massage, Fresh Cucumber Mask.",
          },
          {
            type: "named-card",
            name: "Matcha Latte",
            price: "$63",
            duration: "55 mins",
            description:
              "Warm Neck Wrap, Creamy Matcha Latte Soak, Matcha Exfoliating Scrub, Paraffin Wax & Matcha Mask with Hot Towel Infusion, 12-min Hot Stone Massage with Steamer & 4-min Relaxation Massage, Fresh Cucumber Mask.",
          },
          {
            type: "named-card",
            name: "Herb & Heal",
            price: "$55",
            duration: "45 mins",
            description:
              "Warm Neck Wrap, Herbal-Infused Foot Soak, Botanical Sugar Scrub, Paraffin Wax & Herbal Mask with Hot Towel Wrap, 10-min Hot Stone Massage.",
          },
          {
            type: "named-card",
            name: "Sunset Citrus",
            price: "$43",
            duration: "40 mins",
            description:
              "Citrus Sea Salt Soak, Fresh Orange Sugar Scrub, Paraffin Wax, 7-min Soothing Foot Massage.",
          },
          {
            type: "named-card",
            name: "Essential Reset",
            price: "$33",
            duration: "28 mins",
            description:
              "Refreshing Mint Sea Salt Soak, Invigorating Mint Sugar Scrub, 4-min Foot Massage.",
          },
        ],
      },
    ],
  },
  {
    id: "manicure",
    label: "Manicure",
    heading: "MANICURE",
    note: "All manicures include essential nail care and your choice of polish.",
    addOns: [
      "Gel Polish Add-On: +$17",
      "French Tip: +$8",
      "Gel Removal: +$5 (Complimentary with new gel service)",
    ],
    groups: [
      {
        items: [
          {
            type: "named-card",
            name: "Iconix Renewal Touch",
            price: "$65",
            duration: "45 mins",
            description:
              "Warm Shoulder Wrap, Signature Mineral-Infused Sugar Treatment, Restorative Mask with Hot Towel Infusion, Advanced Light-Based Therapy to Support Circulation & Collagen Renewal, Collagen Glove Treatment with Steam Activation, 10-min Rejuvenating Massage.",
          },
          {
            type: "named-card",
            name: "Warmth & Glow",
            price: "$48",
            duration: "35 mins",
            description:
              "Warm Shoulder Wrap, Coconut Oil & Vitamin E Exfoliating Sugar Scrub, Nourishing Mask with Hot Towel Infusion, Paraffin Wax Treatment, 8-min Therapeutic Hot Stone Massage.",
          },
          {
            type: "named-card",
            name: "Velvet Restore",
            price: "$38",
            duration: "30 mins",
            description:
              "Exfoliating Hand Scrub, Hydrating Hand Mask with Hot Towel Infusion, Paraffin Wax Treatment, 5-min Relaxing Hand Massage.",
          },
          {
            type: "named-card",
            name: "Essential Reset",
            price: "$23",
            duration: "15 mins",
            description:
              "Trimming, Shaping, Cuticle Care, Gentle Buff & Cleanse, Hydrating Lotion Finish.",
          },
        ],
      },
    ],
  },
  {
    id: "head-spa",
    label: "Head Spa",
    heading: "HEAD SPA",
    groups: [
      {
        items: [
          {
            type: "spa-card",
            name: "Essential Reset",
            price: "$65",
            duration: "40 mins",
            intro:
              "A cooling and refreshing head spa designed to relax the mind, revive the scalp, and leave your hair feeling clean, healthy, and refreshed.",
            bullets: [
              "Aromatherapy relaxation with gentle meridian techniques",
              "Makeup removal and facial cleansing",
              "Double cleanse with herbal shampoo",
              "Deep conditioning treatment with scalp relaxation massage",
              "Self-drying station or professional blow-dry available upon request",
            ],
          },
          {
            type: "spa-card",
            name: "Take A Nap",
            price: "$90",
            duration: "50 mins",
            intro:
              "A premium head spa experience featuring deeper cleansing, extended massage, and nourishing treatments for ultimate relaxation and scalp renewal.",
            bullets: [
              "Aromatherapy relaxation with meridian techniques",
              "Makeup removal and gentle facial exfoliation",
              "Facial cleansing massage followed by a hydrating face mask",
              "Relaxing neck and shoulder massage to release tension",
              "Double cleanse with herbal shampoo",
              "Deep conditioning with warm herbal infusion to detox and soothe the scalp",
              "Warm towel head relaxation",
              "Self-drying station or professional blow-dry available upon request",
            ],
          },
          {
            type: "spa-card",
            name: "The Iconix Ritual",
            price: "$115",
            duration: "65 mins",
            intro:
              "Our signature Iconix Ritual Head Spa is a time-honored journey of deep relaxation and renewal. Inspired by traditional Vietnamese healing techniques, this luxurious experience combines meticulous scalp cleansing, slow therapeutic massage, aromatic botanicals, and flowing warm water therapy. Each step is designed to release tension, restore scalp balance, and bring the mind into complete serenity.",
            bullets: [
              "Warm herbal salt ritual to relax the body and soothe tired feet",
              "Steam eye mask to refresh and calm tired eyes",
              "Scalp relaxation using therapeutic tools",
              "Makeup removal and gentle facial exfoliation",
              "Deep cleansing facial massage with acupressure lifting technique and hydrating mask",
              "Revitalizing neck, shoulder, and nape massage to release physical tension",
              "Relaxing hand and arm massage for full-body calm",
              "Double cleanse with herbal shampoo, finished with warm herbal conditioning treatment",
              "Water arch relaxation with warm towel therapy",
              "Self-drying station or professional blow-dry available upon request",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "eyelash",
    label: "Eyelash",
    heading: "EYELASH SERVICES",
    groups: [
      {
        items: [
          { type: "price-row", name: "Eyebrow Tint", price: "$25" },
          { type: "price-row", name: "Eyelash Tint", price: "$25" },
        ],
      },
      {
        heading: "EYELASH EXTENSION",
        items: [
          { type: "price-row", name: "Cluster Mink", price: "Full Set $50+" },
          {
            type: "price-row",
            name: "Classic",
            price: "Full Set $85+",
            priceAlt: "Refill $55+",
          },
          {
            type: "price-row",
            name: "Hybrid",
            price: "Full Set $99+",
            priceAlt: "Refill $60+",
          },
          {
            type: "price-row",
            name: "Volume",
            price: "Full Set $119+",
            priceAlt: "Refill $70+",
          },
          {
            type: "price-row",
            name: "Mega Volume / Design Lash",
            price: "By consultation",
          },
          { type: "price-row", name: "Eyelash Lift", price: "$55+" },
          { type: "price-row", name: "Eyelash Lift & Tint", price: "$65+" },
        ],
      },
    ],
  },
  {
    id: "waxing",
    label: "Waxing",
    heading: "WAXING",
    groups: [
      {
        items: [
          { type: "price-row", name: "Eyebrow", price: "$12+" },
          { type: "price-row", name: "Upper Lip", price: "$8+" },
          { type: "price-row", name: "Chin", price: "$10+" },
          { type: "price-row", name: "Side Burn", price: "$15+" },
          {
            type: "price-row",
            name: "Full Face",
            price: "$45+",
            note: "Forehead not included",
          },
          { type: "price-row", name: "Underarms", price: "$23+" },
          { type: "price-row", name: "Half Arms", price: "$28+" },
          { type: "price-row", name: "Full Arms", price: "$45+" },
          { type: "price-row", name: "Lower Legs", price: "$45+" },
          { type: "price-row", name: "Full Leg", price: "$75+" },
        ],
      },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    heading: "KID SERVICES",
    note: "For children under 10",
    groups: [
      {
        items: [
          { type: "price-row", name: "Kid Manicure", price: "$15" },
          { type: "price-row", name: "Pedicure", price: "$25" },
          { type: "price-row", name: "Additional for Gel", price: "$12" },
          {
            type: "price-row",
            name: "Polish Change",
            price: "$10",
            priceAlt: "Gel $18",
          },
        ],
      },
    ],
  },
  {
    id: "add-ons",
    label: "Add-Ons",
    heading: "NAILS ADD-ON",
    groups: [
      {
        items: [
          {
            type: "price-row",
            name: "Special Shape",
            price: "$5+",
            note: "Oval, Almond, Stiletto, Tapered Square, Coffin",
          },
          { type: "price-row", name: "Longer Length", price: "$5+" },
          { type: "price-row", name: "Cuticle Care", price: "$8+" },
          {
            type: "price-row",
            name: "Soak Off with Same Service",
            price: "$8+",
          },
          { type: "price-row", name: "French Tip", price: "$15+" },
          { type: "price-row", name: "Nail Art Design", price: "$10+" },
          { type: "price-row", name: "Nail Fix", price: "$5+" },
          { type: "price-row", name: "Additional Color (3+)", price: "$5+" },
          { type: "price-row", name: "Paraffin Wax", price: "$8+" },
          { type: "price-row", name: "Matte Top", price: "$5+" },
          { type: "price-row", name: "Chrome or Cat Eye", price: "$15+" },
        ],
      },
    ],
  },
  {
    id: "additional",
    label: "Additional",
    heading: "ADDITIONAL SERVICES",
    groups: [
      {
        items: [
          {
            type: "price-row",
            name: "Polish Change",
            price: "$15",
            priceAlt: "Gel $25",
          },
          { type: "price-row", name: "Gel Removal with Service", price: "$5" },
          {
            type: "price-row",
            name: "Gel Polish on Nail Enhancement",
            price: "$35+",
          },
          { type: "price-row", name: "Soak Off Only", price: "$15" },
          { type: "price-row", name: "Extra Massage", price: "$2/min" },
          { type: "price-row", name: "Big Toes Extension", price: "$8" },
          { type: "price-row", name: "Refill (Big Toes)", price: "$6+" },
          {
            type: "price-row",
            name: "Full Set Toes",
            price: "$55+",
            priceAlt: "Gel $65+",
          },
          {
            type: "price-row",
            name: "Refill Toes",
            price: "$50+",
            priceAlt: "Gel $60+",
          },
          {
            type: "price-row",
            name: "Full Set Toes w/ French",
            price: "$70+",
            priceAlt: "Refill $65+",
          },
        ],
      },
    ],
  },
];
