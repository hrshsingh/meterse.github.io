// MeterSe Investor Deck Configuration
window.DECK_CONFIG = {
  brand: {
    name: "MeterSe",
    logo: "1406.jpg",
    tagline: "Scan and Go.",
    intro: "Scan, switch, and transit instantly across autos, cabs, and buses at exact official RTO rates.",
    facts: [
      "JHANSI, UP · TIER-2/3 TRANSIT",
      "UNIFIED: AUTOS · CABS · BUSES",
      "OPEN MOBILITY: NAMMA YATRI & BHARAT TAXI WAVE"
    ]
  },
  ui: {
    documentTitle: "MeterSe ",
    presentationLabel: "MeterSe investor presentation",
    deck: "INVESTOR JOURNEY",
    start: "START",
    finish: "FINISH",
    upgrade: "UPGRADE",
    journey: "THE JOURNEY",
    chapter: "CHAPTER",
    step: "STEP",
    clickToContinue: "CLICK OR PRESS SPACE TO CONTINUE",
    keys: "SPACE / ARROWS TO NAVIGATE",
    previous: "Previous step",
    next: "Next step",
    presenter: "Presenter view",
    fullscreen: "Toggle fullscreen",
    print: "Print / PDF",
    overviewTitle: "The whole journey.",
    overviewText: "Choose a chapter to revisit it for questions.",
    overviewHint: "SELECT A CHAPTER",
    presenterTitle: "MeterSe presenter",
    current: "CURRENT",
    upNext: "UP NEXT",
    notes: "SPEAKER NOTES",
    elapsed: "ELAPSED",
    resetTimer: "Reset timer",
    end: "End of presentation",
    popupBlocked: "Presenter window blocked. Allow popups and press P again.",
    fullscreenError: "Fullscreen could not be opened. Use your browser's fullscreen control.",
    dependencyError: "The local GSAP files are missing. Keep the vendor folder beside index.html.",
    configError: "Check config.js: keep the provided item counts and use five non-negative funding percentages totaling 100.",
    logoError: "Logo not found. Check brand.logo in config.js and the image path."
  },
  slides: [
    {
      title: "The starting line",
      notes: "MeterSe lets commuters scan, switch, and transit instantly while paying exact official government rates. The rapid rise of open transit protocols like Namma Yatri and public mobility pushes like Bharat Taxi proves the market has firmly rejected high-commission aggregator models."
    },
    {
      title: "The team",
      notes: "Our five-person founding and engineering team combines hardware metrology, operations, and full-stack execution: Harshnarayan Singh Yadav (CTO — Ex-ISRO, Ex-CNX, Android dev, NIT Goa Power Electronics) leads architecture and testing; Priya Yadav (Director — BAMS) drives operations and team building; Vaibhav Meshram (NIT Goa Power Electronics) designs our low-cost magnetic fare meter; Manvendra Yadav (DevOps — Ex-Tech Lead at Rewan Tech, MCA) manages backend services; and Arpit Yadav (Full Stack) builds the web platform."
    },
    {
      title: "The problem",
      notes: "Urban transit in Tier-2/3 cities is broken across all three stakeholders. Commuters suffer daily fare haggling, surge pricing, and cancellations with no unified app for autos, cabs, and buses. Drivers resist Ola/Uber because 20–30% commissions on ₹40–₹70 trips, unpaid pickup runs, and delayed payouts destroy earnings. Meanwhile, Smart Cities spent crores on ICCCs that only see buses and metros—leaving autos, tempos, and last-mile feeders completely untracked."
    },
    {
      title: "The solution",
      notes: "MeterSe solves all three roadblocks at the root. Commuters scan to board at verifiable per-km RTO rates with zero haggling or free pickups. Drivers pay a flat subscription to keep 100% of meter fares with zero dead mileage and instant UPI settlement. Cities get live O-D telemetry, route adherence, and RTO fare compliance straight into ICCC dashboards without expensive Western card readers—plus rider-side route planning and overcrowding prevention."
    },
    {
      title: "The technology",
      notes: "Built for real-world Indian transit: smartphone riders scan dynamic QR codes paired over WebSocket/MQTT; students and pass holders tap 13.56 MHz NFC/NCMC cards; and phone-less or elderly commuters are served via a physical cash toggle that locks RTO rates, announces fares via soundbox, and logs to the driver's shift sheet. Under the hood: automotive-grade dual-core MCU, magnetic wheel sensor, and multi-constellation GNSS for Legal Metrology and AIS-140 compliance. Under patchy networks, LittleFS logs binary Protobuf buffers locally, calculates fares and dynamic UPI QRs offline, and batch-syncs via MQTT QoS 1 to Kafka, TimescaleDB, and PostgreSQL."
    },
    {
      title: "The ask",
      notes: "[REPLACE BEFORE PRESENTING: State your exact target raise in INR or USD, 12–18 month milestones such as meter deployment and AIS-140 / Legal Metrology certifications, and confirm the five allocation percentages.]"
    },
    {
      title: "Thank you",
      notes: "Close by inviting investors to review the live MeterSe demo, hardware prototype, and pilot roadmap. Open the floor for Q&A—press Space once more to zoom out to the interactive chapter map."
    }
  ],
  intro: {
    kicker: "UNIFIED PUBLIC TRANSIT",
    eyebrow: "THE STARTING LINE",
    heading: "A new journey begins.",
    introLabel: "THE IDEA"
  },
  team: {
    eyebrow: "THE PEOPLE BEHIND THE WHEEL",
    heading: "Built by the right team.",
    subheading: "Power electronics, embedded hardware, and full-stack execution.",
    members: [
      {
        name: "Harshnarayan Singh Yadav",
        role: "CTO",
        credential: "Ex-ISRO, Ex-CNX, Android Dev & NIT Goa Power Electronics. Leads tech stack & testing."
      },
      {
        name: "Priya Yadav",
        role: "Director",
        credential: "BAMS scholar leading operations, strategic brainstorming, and team building."
      },
      {
        name: "Vaibhav Meshram",
        role: "Electronics Design",
        credential: "NIT Goa Power Electronics. Designing accurate, cost-effective magnetic fare meter."
      },
      {
        name: "Manvendra & Arpit Yadav",
        role: "DevOps & Full Stack",
        credential: "Ex-Tech Lead at Rewan Tech (MCA) & Full-Stack Dev building services and web platform."
      }
    ]
  },
  problem: {
    eyebrow: "THE ROADBLOCKS",
    heading: "The journey is broken.",
    subheading: "Why commuters, drivers, and cities are stuck today.",
    items: [
      {
        title: "Commuter Fare Haggling & Surge",
        detail: "Arbitrary inflated fares, continuous haggling, surge pricing, and cancellations—with no unified app across autos, cabs, and buses."
      },
      {
        title: "Broken Driver Economics",
        detail: "Aggregators take 20–30% on ₹40–₹70 rides, force unpaid pickup runs, and delay payouts—fueling driver resistance in Tier-2/3 cities."
      },
      {
        title: "Municipal ICCC Blind Spot",
        detail: "Smart Cities invested crores in ICCCs tracking only buses and metros, leaving autos, tempos, and last-mile feeders completely untracked."
      }
    ]
  },
  solution: {
    eyebrow: "A CLEARER ROAD AHEAD",
    heading: "Meet a better way.",
    subheading: "One unified platform for commuters, drivers, and cities.",
    items: [
      {
        title: "Commuters: Scan-to-Board Metering",
        detail: "One tap to board autos, cabs, or buses at verifiable per-km RTO rates—zero haggling, zero surge pricing, and no unpaid pickups."
      },
      {
        title: "Drivers: Zero-Commission Economics",
        detail: "Flat subscription lets drivers keep 100% of meter fares, eliminates dead mileage at stands, and routes instant direct UPI payouts."
      },
      {
        title: "Cities: Live ICCC Transit Telemetry",
        detail: "Lightweight QR/NFC metering streams real-time O-D demand, route adherence, and RTO fare compliance straight into city dashboards."
      }
    ],
    showMockup: true,
    mockupImage: "app-screen.png",
    mockupLabel: "COMMUTER & METER INTERFACE",
    mockupTitle: "MeterSe Live",
    mockupRows: [
      "Live RTO Rate & Distance",
      "One-Tap Dynamic UPI QR",
      "Route & Crowd Planning"
    ]
  },
  tech: {
    eyebrow: "THE ENGINE UNDERNEATH",
    heading: "Built for real-world transit.",
    subheading: "Inclusive boarding, automotive hardware, and offline-first sync.",
    items: [
      {
        title: "Inclusive Multi-Modal Boarding",
        detail: "Dynamic QR (WebSocket/MQTT), 13.56 MHz NFC/NCMC tap-in, and physical cash toggle with soundbox.",
        logo: "QR · NFC · CASH"
      },
      {
        title: "Automotive-Grade Hardware",
        detail: "Dual-core MCU, magnetic wheel telemetry, and multi-GNSS built for Legal Metrology & AIS-140.",
        logo: "MCU · GNSS"
      },
      {
        title: "Offline-First Edge Device",
        detail: "LittleFS flash ring buffer with binary Protobuf logs, local fare calc, and offline dynamic UPI QR.",
        logo: "PROTOBUF · MQTT"
      },
      {
        title: "Telemetry & Settlement Cloud",
        detail: "MQTT QoS 1 batch sync into Kafka & TimescaleDB; PostgreSQL idempotently reconciles UPI webhooks.",
        logo: "KAFKA · TIMESCALE"
      }
    ]
  },
  funding: {
    eyebrow: "FUEL FOR THE NEXT MILE",
    heading: "The ask.",
    amount: 2500000,
    currency: "INR",
   
    items: [
      { category: "HARDWARE & TOOLING", percent: 35, color: "#3B82F6" },
      { category: "DRIVER ONBOARDING", percent: 25, color: "#60A5FA" },
      { category: "CORE ENGINEERING", percent: 20, color: "#34D399" },
      { category: "METROLOGY & AIS-140", percent: 12, color: "#FBBF24" },
      { category: "OPERATIONS & WORKING CAP", percent: 8, color: "#FB7185" }
    ]
  },
  thanks: {
    eyebrow: "THE FINISH IS JUST THE BEGINNING",
    heading: "Thank you.",
    subheading: "Let's digitize India's public transit together.",
    contactLabel: "LET'S CONNECT",
    contact: "Harshnarayan Singh Yadav  ·  Meterse.co@gmail.com"
  }
};