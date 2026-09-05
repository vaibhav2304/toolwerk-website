/* =========================================================
   data.js — seed content + storage layer
   Everything the admin panel edits lives here first, then in
   localStorage under TW_DB. Export/Import JSON from /admin.html
   ========================================================= */

/* ---- Placeholder image generator (offline-safe, no external files) ---- */
function twPlaceholder(label, tone){
  const tones = {
    dark:  ['#0B0F14','#1B2430','#FFB000'],
    steel: ['#2A3644','#465667','#FFB000'],
    amber: ['#FFB000','#D99400','#0B0F14'],
    light: ['#E9EDF1','#CBD4DC','#0B0F14']
  };
  const t = tones[tone] || tones.steel;
  const txt = String(label||'TOOLWERK').toUpperCase().slice(0,26);
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient>
<pattern id="p" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
<rect width="23" height="46" fill="${t[2]}" opacity=".09"/></pattern></defs>
<rect width="800" height="600" fill="url(#g)"/><rect width="800" height="600" fill="url(#p)"/>
<g fill="none" stroke="${t[2]}" stroke-width="10" opacity=".55">
<circle cx="400" cy="268" r="86"/><circle cx="400" cy="268" r="34"/>
<path d="M400 140v-34M400 430v34M272 268h-34M562 268h34M310 178l-24-24M490 358l24 24M490 178l24-24M310 358l-24 24"/></g>
<rect x="0" y="516" width="800" height="84" fill="${t[2]}"/>
<text x="400" y="573" font-family="Arial Narrow,Impact,sans-serif" font-size="46" font-weight="bold"
 text-anchor="middle" fill="${tone==='amber'?'#FFF':'#0B0F14'}" letter-spacing="2">${txt}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/* ---------------- SEED DATABASE ---------------- */
const TW_SEED = {
  settings:{
    brand:"TOOLWERK",
    brandSub:"TOOLS & EQUIPMENT",
    tagline:"Industrial Tools, Power Equipment & Machinery",
    phone:"+91 98100 00000",
    phone2:"+91 98100 00001",
    whatsapp:"919810000000",
    email:"sales@toolwerk.example",
    address:"Plot 42, Industrial Area Phase II, Sector 24, New Delhi 110020, India",
    hours:"Mon – Sat · 9:30 AM – 7:00 PM",
    gst:"07AAACT0000A1Z5",
    mapEmbed:"https://www.google.com/maps?q=Industrial+Area+Phase+II+New+Delhi&output=embed",
    heroSlides:[
      {kicker:"Authorised Distributor · 20+ Global Brands",
       title:"Tools that don't <em>quit</em> on shift three.",
       text:"Power tools, hand tools, welding, material handling and workshop machinery — stocked, tested and delivered across India with on-site service backup.",
       img:twPlaceholder("Power Tools","dark")},
      {kicker:"Workshop & Plant Machinery",
       title:"Built for the <em>factory floor</em>.",
       text:"Lathes, drills, compressors, generators and hydraulic equipment. Commissioning, operator training and AMC included on every machine we sell.",
       img:twPlaceholder("Machinery","steel")},
      {kicker:"Same-day dispatch on 2,000+ SKUs",
       title:"One vendor. <em>Whole</em> plant covered.",
       text:"From a 4mm drill bit to a 10-ton gantry crane — consolidate your MRO purchasing and cut procurement cycles by half.",
       img:twPlaceholder("Material Handling","dark")}
    ],
    stats:[
      {n:"22+",l:"Years in trade"},{n:"4,800+",l:"SKUs stocked"},
      {n:"1,200+",l:"Industrial clients"},{n:"48 hr",l:"Pan-India dispatch"}
    ],
    usps:[
      {i:"🏆",t:"Genuine & Warranted",d:"Every item sourced through authorised channels with full manufacturer warranty and traceable invoicing."},
      {i:"⚙️",t:"On-site Service Team",d:"Factory-trained engineers for installation, commissioning, breakdown support and annual maintenance contracts."},
      {i:"🚚",t:"Fast Pan-India Supply",d:"Same-day dispatch on stocked lines; project consignments scheduled to your shutdown window."},
      {i:"📄",t:"GST & Tender Ready",d:"Proper GST invoicing, test certificates, and complete documentation support for tenders and audits."}
    ],
    about:{
      title:"Supplying India's workshops since 2003",
      body:"TOOLWERK began as a single counter selling hand tools to fabricators. Two decades on we supply power tools, welding systems, material handling gear and workshop machinery to over 1,200 factories, EPC contractors and government units.\n\nWe are not a marketplace listing. We stock, we test, we install and we service — so the equipment you buy stays productive long after the invoice is closed.",
      points:["Authorised distribution for 20+ Indian and imported brands",
              "In-house service workshop with calibration facility",
              "Dedicated key-account manager for every industrial buyer",
              "Bulk, project and rate-contract pricing available"],
      img:twPlaceholder("Our Workshop","steel"),
      stamp:"Since 2003"
    },
    ctaBand:{
      title:"Need a hard-to-find tool or a full plant fit-out?",
      text:"Send us the spec, the drawing or just a photo. Our team reverts with availability, alternatives and a delivery date — usually within 4 working hours.",
      img:twPlaceholder("Talk to our team","dark")
    },
    marquee:["BOSCH","MAKITA","STANLEY","HITACHI","DEWALT","ESAB","KIRLOSKAR","TAPARIA","ELGI","IR","JCB","GEDORE"],
    social:{fb:"#",in:"#",yt:"#",ig:"#"}
  },

  categories:[
    {id:"c1",name:"Power Tools",slug:"power-tools",icon:"⚡",
     desc:"Corded and cordless drilling, cutting, grinding and fastening tools for professional and industrial duty cycles.",
     img:twPlaceholder("Power Tools","dark"),
     subs:[{id:"s11",name:"Drills & Rotary Hammers"},{id:"s12",name:"Angle Grinders"},
           {id:"s13",name:"Cutting & Saws"},{id:"s14",name:"Cordless Platform"}]},
    {id:"c2",name:"Hand Tools",slug:"hand-tools",icon:"🔧",
     desc:"Wrenches, spanners, pliers, screwdrivers and precision hand tools — forged, hardened and calibrated.",
     img:twPlaceholder("Hand Tools","steel"),
     subs:[{id:"s21",name:"Wrenches & Spanners"},{id:"s22",name:"Pliers & Cutters"},
           {id:"s23",name:"Screwdrivers & Bits"},{id:"s24",name:"Tool Kits & Storage"}]},
    {id:"c3",name:"Welding & Cutting",slug:"welding-cutting",icon:"🔥",
     desc:"Inverter welding machines, MIG/TIG systems, plasma cutters, consumables and complete operator safety gear.",
     img:twPlaceholder("Welding","dark"),
     subs:[{id:"s31",name:"Arc & Inverter Welders"},{id:"s32",name:"MIG / TIG Systems"},
           {id:"s33",name:"Plasma Cutting"},{id:"s34",name:"Consumables & Safety"}]},
    {id:"c4",name:"Material Handling",slug:"material-handling",icon:"🏗️",
     desc:"Chain blocks, hoists, stackers, pallet trucks and lifting tackle — load tested with test certificates.",
     img:twPlaceholder("Material Handling","steel"),
     subs:[{id:"s41",name:"Chain Blocks & Hoists"},{id:"s42",name:"Pallet Trucks & Stackers"},
           {id:"s43",name:"Cranes & Gantries"},{id:"s44",name:"Slings & Lifting Tackle"}]},
    {id:"c5",name:"Workshop Machinery",slug:"workshop-machinery",icon:"🛠️",
     desc:"Lathes, milling machines, pillar drills, bench grinders and sheet metal equipment for production floors.",
     img:twPlaceholder("Machinery","dark"),
     subs:[{id:"s51",name:"Lathes & Milling"},{id:"s52",name:"Drilling Machines"},
           {id:"s53",name:"Sheet Metal Equipment"},{id:"s54",name:"Bench & Pedestal"}]},
    {id:"c6",name:"Air & Power Equipment",slug:"air-power",icon:"💨",
     desc:"Air compressors, pneumatic tools, diesel generators and pressure washers for continuous industrial use.",
     img:twPlaceholder("Compressors","steel"),
     subs:[{id:"s61",name:"Air Compressors"},{id:"s62",name:"Pneumatic Tools"},
           {id:"s63",name:"Generators"},{id:"s64",name:"Pressure Washers"}]},
    {id:"c7",name:"Measuring & Testing",slug:"measuring-testing",icon:"📏",
     desc:"Vernier calipers, micrometers, laser levels, clamp meters and calibration-traceable instruments.",
     img:twPlaceholder("Measuring","light"),
     subs:[{id:"s71",name:"Precision Measuring"},{id:"s72",name:"Levels & Lasers"},
           {id:"s73",name:"Electrical Testers"},{id:"s74",name:"Thermal & Inspection"}]},
    {id:"c8",name:"Safety & PPE",slug:"safety-ppe",icon:"🦺",
     desc:"Helmets, gloves, harnesses, respiratory and fire safety — IS/CE marked personal protective equipment.",
     img:twPlaceholder("Safety Gear","amber"),
     subs:[{id:"s81",name:"Head & Eye Protection"},{id:"s82",name:"Hand & Body"},
           {id:"s83",name:"Fall Protection"},{id:"s84",name:"Fire & Emergency"}]}
  ],

  products:[
    /* ---- Power Tools ---- */
    {id:"p1",name:"26mm SDS-Plus Rotary Hammer 800W",slug:"sds-plus-rotary-hammer-26mm",
     cat:"c1",sub:"s11",brand:"Bosch",model:"GBH 2-26 DRE",sku:"TW-PT-1001",
     featured:true,badge:"Best Seller",stock:"In Stock",moq:"1 Unit",
     short:"Three-mode 800W rotary hammer for concrete drilling, chiselling and steel/wood drilling on site.",
     desc:"A workhorse rotary hammer built for continuous site duty. The 800W motor delivers 2.7 J of impact energy through an SDS-Plus chuck, letting a single operator drill 26mm holes in reinforced concrete without stalling. Rotation-stop and hammer-stop modes turn the same tool into a light chipping hammer and a standard rotary drill.\n\nA mechanical safety clutch disengages the moment the bit jams, protecting both the gearbox and the operator's wrist. Vibration control in the handle keeps daily exposure inside permissible limits for full-shift use.",
     images:[twPlaceholder("Rotary Hammer","dark"),twPlaceholder("SDS Chuck","steel"),twPlaceholder("In Use","light")],
     specs:[["Rated Power Input","800 W"],["Impact Energy","2.7 J"],["No-load Speed","0 – 900 rpm"],
            ["Impact Rate","0 – 4,000 bpm"],["Max Drilling Ø (Concrete)","26 mm"],["Max Drilling Ø (Steel)","13 mm"],
            ["Tool Holder","SDS-Plus"],["Weight","2.9 kg"],["Supply","230 V / 50 Hz single phase"],["Warranty","12 months"]],
     features:["Three operating modes — drill, hammer drill, chisel","Mechanical safety clutch prevents kickback",
               "Vibration-damped main handle","Service indicator LED","Reversible rotation with lock-on switch"],
     applications:["Concrete anchor and dowel holes","Electrical and plumbing conduit routing",
                   "Light chipping and tile removal","Structural steel and timber drilling"],
     includes:"Tool, depth stop, auxiliary handle, carry case",
     tags:["drill","hammer","concrete","sds"]},

    {id:"p2",name:"Heavy-Duty Angle Grinder 125mm 1400W",slug:"angle-grinder-125mm-1400w",
     cat:"c1",sub:"s12",brand:"Makita",model:"GA5030R",sku:"TW-PT-1002",
     featured:true,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"1400W 125mm grinder with labyrinth construction and restart protection for fabrication shops.",
     desc:"Designed for fabrication and structural steel work where the grinder runs most of the shift. The 1400W motor holds speed under heavy stock removal, while labyrinth sealing keeps grinding dust out of the bearings and armature — the single largest cause of grinder failure in Indian workshops.\n\nRestart protection prevents the tool from starting on its own after a power cut, and the spindle lock allows single-spanner wheel changes.",
     images:[twPlaceholder("Angle Grinder","steel"),twPlaceholder("Guard Detail","dark")],
     specs:[["Rated Power","1,400 W"],["Wheel Diameter","125 mm"],["No-load Speed","11,000 rpm"],
            ["Spindle Thread","M14"],["Weight","2.5 kg"],["Cable Length","2.5 m"],["Supply","230 V / 50 Hz"],["Warranty","12 months"]],
     features:["Labyrinth construction seals bearings from dust","Restart protection after power interruption",
               "Tool-less adjustable wheel guard","Anti-vibration side handle"],
     applications:["Weld dressing and grinding","Cutting rebar, angle and pipe","Surface preparation before painting"],
     includes:"Tool, guard, side handle, wheel spanner",
     tags:["grinder","cutting","fabrication"]},

    {id:"p3",name:"18V Brushless Cordless Impact Wrench",slug:"18v-cordless-impact-wrench",
     cat:"c1",sub:"s14",brand:"DeWalt",model:"DCF899",sku:"TW-PT-1003",
     featured:true,badge:"New",stock:"In Stock",moq:"1 Unit",
     short:"950 Nm brushless impact wrench with 3-speed control — tyre, structural and maintenance bolting.",
     desc:"A brushless 18V platform tool producing 950 Nm of nut-busting torque, enough for commercial vehicle wheel nuts and structural bolting without dragging a compressor line across site.\n\nThree-speed electronic control lets the same tool run down small fasteners without shearing them. Supplied with two 5.0Ah batteries and a fast charger; batteries interchange across the full 18V range.",
     images:[twPlaceholder("Impact Wrench","dark"),twPlaceholder("Battery Pack","steel")],
     specs:[["Voltage","18 V Li-ion"],["Max Torque","950 Nm"],["Drive","1/2\" square, detent pin"],
            ["No-load Speed","0–400 / 1,200 / 1,900 rpm"],["Impacts","0–2,400 ipm"],["Weight (with battery)","2.9 kg"],
            ["Battery Supplied","2 × 5.0 Ah"],["Warranty","12 months (battery 6 months)"]],
     features:["Brushless motor — longer runtime and life","3-speed electronic torque control",
               "LED work light with 20s delay","Compatible with entire 18V battery platform"],
     applications:["Commercial vehicle wheel nuts","Structural steel bolting","Plant maintenance and shutdown work"],
     includes:"Tool, 2 batteries, charger, TSTAK case",
     tags:["cordless","impact","wrench","18v"]},

    {id:"p4",name:"355mm Abrasive Cut-Off Chop Saw 2200W",slug:"chop-saw-355mm",
     cat:"c1",sub:"s13",brand:"Hitachi",model:"CC14SF",sku:"TW-PT-1004",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"2200W metal chop saw with quick-release vice for high-volume pipe and section cutting.",
     desc:"Bench-mounted abrasive cut-off saw for fabrication shops cutting pipe, angle and channel all day. The quick-release vice takes seconds per part instead of turning a screw, and the pivoting fence sets mitre cuts from 0° to 45° without extra fixtures.",
     images:[twPlaceholder("Chop Saw","steel")],
     specs:[["Rated Power","2,200 W"],["Wheel Size","355 × 25.4 mm"],["No-load Speed","3,800 rpm"],
            ["Max Cut (Round)","127 mm"],["Max Cut (Square)","119 × 119 mm"],["Weight","17 kg"],["Warranty","12 months"]],
     features:["Quick-release vice","0–45° pivoting fence","Spark deflector","Rubber-mounted base reduces walk"],
     applications:["Pipe and tube cutting","Structural section cut-to-length","Rebar cutting"],
     includes:"Saw, one abrasive wheel, spanner",tags:["saw","cutting","metal"]},

    /* ---- Hand Tools ---- */
    {id:"p5",name:"Chrome Vanadium Combination Spanner Set (12 pc)",slug:"combination-spanner-set-12pc",
     cat:"c2",sub:"s21",brand:"Taparia",model:"CS-12",sku:"TW-HT-2001",
     featured:true,badge:"Value Pack",stock:"In Stock",moq:"5 Sets",
     short:"6–32mm forged Cr-V combination spanners, hardened and mirror polished, in a roll pouch.",
     desc:"Drop-forged chrome vanadium spanners hardened to 44–48 HRC with a mirror chrome finish that resists workshop corrosion. Ring ends are 12-point and offset 15° for knuckle clearance in tight assemblies.",
     images:[twPlaceholder("Spanner Set","light"),twPlaceholder("Roll Pouch","steel")],
     specs:[["Sizes","6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 19, 22, 24, 27, 30, 32 mm"],
            ["Material","Chrome Vanadium Steel"],["Hardness","44–48 HRC"],["Finish","Mirror chrome plated"],
            ["Standard","IS 2028 / DIN 3113"],["Packing","Canvas roll pouch"]],
     features:["Drop-forged single-piece body","15° offset 12-point ring end","Corrosion-resistant chrome finish"],
     applications:["General plant maintenance","Automotive workshops","Assembly lines"],
     includes:"12 spanners in roll pouch",tags:["spanner","wrench","hand tool"]},

    {id:"p6",name:"Insulated VDE Screwdriver Set 1000V (8 pc)",slug:"insulated-screwdriver-set-vde",
     cat:"c2",sub:"s23",brand:"Stanley",model:"VDE-8",sku:"TW-HT-2002",
     featured:false,badge:"",stock:"In Stock",moq:"10 Sets",
     short:"Individually tested 1000V insulated screwdrivers for live electrical maintenance work.",
     desc:"Each screwdriver in this set is individually dielectric tested at 10,000V and certified for working at up to 1000V AC, per IEC 60900. The two-component insulation is bonded to the blade so it cannot slip or peel back under heat.",
     images:[twPlaceholder("VDE Screwdrivers","amber")],
     specs:[["Certification","IEC 60900 / VDE 1000V"],["Test Voltage","10,000 V each piece"],
            ["Blade Material","Cr-Mo-V steel"],["Set Contents","4 slotted, 3 Phillips, 1 tester"],["Warranty","Lifetime against manufacturing defect"]],
     features:["Individually dielectric tested","Bonded two-component insulation","Anti-roll ergonomic handle"],
     applications:["Panel and switchgear maintenance","Electrical contracting","Utility service work"],
     includes:"8 screwdrivers in holder",tags:["screwdriver","electrical","vde","insulated"]},

    {id:"p7",name:"238-Piece Mechanic Tool Kit in Trolley Case",slug:"mechanic-tool-kit-238pc",
     cat:"c2",sub:"s24",brand:"Gedore",model:"TK-238",sku:"TW-HT-2003",
     featured:true,badge:"",stock:"Made to Order",moq:"1 Kit",
     short:"Complete maintenance kit — sockets, spanners, pliers, hex keys — in a lockable trolley case.",
     desc:"A single kit that covers most plant maintenance tasks: 1/4\", 3/8\" and 1/2\" socket drives, combination spanners, pliers, hex and torx keys, hammers and precision drivers, laid into foam trays so a missing tool is obvious at handover.",
     images:[twPlaceholder("Tool Kit 238pc","dark"),twPlaceholder("Foam Trays","light")],
     specs:[["Total Pieces","238"],["Drive Sizes","1/4\", 3/8\", 1/2\""],["Case","ABS trolley, lockable"],
            ["Trays","4 foam-cut trays"],["Gross Weight","24 kg"],["Warranty","24 months"]],
     features:["Foam shadow trays for tool accountability","Three ratchet drives included","Lockable trolley with telescopic handle"],
     applications:["Maintenance teams","Field service vehicles","Training institutes"],
     includes:"238 tools, trolley case, inventory list",tags:["kit","toolbox","maintenance"]},

    /* ---- Welding ---- */
    {id:"p8",name:"250A IGBT Inverter Arc Welding Machine",slug:"inverter-arc-welder-250a",
     cat:"c3",sub:"s31",brand:"ESAB",model:"Rogue ES 250",sku:"TW-WD-3001",
     featured:true,badge:"Top Rated",stock:"In Stock",moq:"1 Unit",
     short:"Single-phase 250A inverter welder with hot start and anti-stick — runs on generator supply.",
     desc:"An IGBT inverter welder that holds a stable arc on the fluctuating single-phase supply common at Indian sites, and runs happily off a 7.5 kVA generator. Hot start eases electrode initiation on cold plate, arc force pushes through tight root gaps, and anti-stick releases a stuck rod without burning the machine.\n\nHousing is powder-coated sheet steel with a dust-filtered airflow path, rated IP23S for outdoor use under cover.",
     images:[twPlaceholder("Inverter Welder","dark"),twPlaceholder("Control Panel","steel"),twPlaceholder("Site Use","light")],
     specs:[["Welding Current Range","10 – 250 A"],["Duty Cycle","250 A @ 35%, 150 A @ 100%"],
            ["Input Supply","230 V ±15%, single phase"],["Open Circuit Voltage","65 V"],
            ["Electrode Range","2.0 – 5.0 mm"],["Protection Class","IP23S"],["Weight","11.5 kg"],["Warranty","24 months"]],
     features:["Hot start, arc force and anti-stick","Generator friendly (7.5 kVA minimum)",
               "Wide voltage tolerance ±15%","Lift TIG capable","Shoulder strap for site mobility"],
     applications:["Structural fabrication","Pipeline and tank work","Site repair and maintenance","Fabrication training"],
     includes:"Machine, electrode holder, earth clamp, cables, strap",
     tags:["welding","inverter","arc","250a"]},

    {id:"p9",name:"MIG/MAG Welding Machine 400A Water-Cooled",slug:"mig-mag-welder-400a",
     cat:"c3",sub:"s32",brand:"ESAB",model:"Warrior 400i",sku:"TW-WD-3002",
     featured:true,badge:"",stock:"Made to Order",moq:"1 Unit",
     short:"Three-phase 400A MIG/MAG system with separate wire feeder and water-cooled torch for production welding.",
     desc:"A production-duty multi-process source for shops running long welds on thick section. The separate four-roll wire feeder can sit 15 m from the power source, and water cooling keeps the torch comfortable at full current through a complete shift.",
     images:[twPlaceholder("MIG Welder 400A","steel"),twPlaceholder("Wire Feeder","dark")],
     specs:[["Current Range","16 – 400 A"],["Duty Cycle","400 A @ 60%"],["Input","415 V, 3 phase, 50 Hz"],
            ["Processes","MIG/MAG, MMA, Lift TIG"],["Wire Range","0.8 – 1.6 mm"],["Cooling","Water-cooled torch"],
            ["Weight","78 kg (source)"],["Warranty","24 months"]],
     features:["Four-roll wire feed","15 m interconnection option","Water cooler integrated in trolley","Multi-process capable"],
     applications:["Heavy fabrication","Pressure vessel work","Automotive component production"],
     includes:"Power source, feeder, cooler, trolley, 3m torch",tags:["mig","mag","welding","production"]},

    {id:"p10",name:"Air Plasma Cutting Machine 60A",slug:"plasma-cutter-60a",
     cat:"c3",sub:"s33",brand:"ESAB",model:"Cutmaster 60",sku:"TW-WD-3003",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"60A plasma cutter with 20mm clean-cut capacity and blowback pilot arc start.",
     desc:"Blowback pilot arc starting means no high-frequency interference with nearby electronics — important in shops running CNC gear. Cuts 20mm clean and severs 25mm, with drag-cutting tips that let the operator rest the torch on the plate.",
     images:[twPlaceholder("Plasma Cutter","dark")],
     specs:[["Output Current","20 – 60 A"],["Clean Cut Capacity","20 mm mild steel"],["Sever Capacity","25 mm"],
            ["Input","415 V, 3 phase"],["Air Requirement","150 lpm @ 5.5 bar"],["Duty Cycle","60 A @ 60%"],["Warranty","12 months"]],
     features:["Blowback pilot arc — no HF interference","Drag cutting tips","Built-in air filter regulator"],
     applications:["Sheet metal profiling","Demolition and salvage cutting","Repair fabrication"],
     includes:"Machine, 7.5m torch, earth lead, spare consumables",tags:["plasma","cutting"]},

    /* ---- Material Handling ---- */
    {id:"p11",name:"Chain Pulley Block 3 Ton × 3 Metre",slug:"chain-pulley-block-3ton",
     cat:"c4",sub:"s41",brand:"Indef",model:"M3-030",sku:"TW-MH-4001",
     featured:true,badge:"Load Tested",stock:"In Stock",moq:"1 Unit",
     short:"Hand-operated 3T chain block with load-tested certificate and Grade 80 load chain.",
     desc:"A manual chain block for workshop lifting and maintenance jobs where no power is available. Grade 80 alloy load chain, forged hooks with safety latches, and a Weston-type friction brake that holds the load at any point of travel.\n\nEvery unit is proof-load tested at 1.5× rated capacity and shipped with a signed test certificate — required documentation for factory safety audits.",
     images:[twPlaceholder("Chain Block 3T","steel"),twPlaceholder("Load Chain","dark")],
     specs:[["Rated Capacity","3,000 kg"],["Standard Lift","3 m"],["Load Chain","Grade 80, 8 × 24 mm"],
            ["Chain Falls","2"],["Effort at Full Load","39 kg"],["Headroom","470 mm"],
            ["Net Weight","28 kg"],["Standard","IS 3832 / EN 13157"],["Test Certificate","Supplied with each unit"]],
     features:["Proof tested at 1.5× rated load","Forged hooks with safety latches",
               "Weston-type mechanical load brake","Enclosed gearing keeps out dust"],
     applications:["Machine shop lifting","Motor and pump removal","Maintenance and erection work"],
     includes:"Block, test certificate, operating manual",tags:["hoist","lifting","chain block"]},

    {id:"p12",name:"Hydraulic Hand Pallet Truck 2.5 Ton",slug:"hydraulic-pallet-truck-2500kg",
     cat:"c4",sub:"s42",brand:"Godrej",model:"HPT-2500",sku:"TW-MH-4002",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"2500kg pallet truck with nylon wheels and three-position control for warehouse floors.",
     desc:"Standard 685mm fork width truck for Euro and Indian pallets. The overload valve protects the hydraulic unit when someone inevitably tries to lift 3 tons, and the three-position lever gives lift, neutral and lower from the same handle grip.",
     images:[twPlaceholder("Pallet Truck","steel")],
     specs:[["Capacity","2,500 kg"],["Fork Length","1,150 mm"],["Fork Width (overall)","685 mm"],
            ["Lowered Height","85 mm"],["Raised Height","200 mm"],["Wheels","Nylon steer, tandem nylon load"],["Weight","72 kg"]],
     features:["Overload protection valve","Three-position control lever","Sealed hydraulic pump unit"],
     applications:["Warehouse pallet movement","Loading dock operations","Production line feeding"],
     includes:"Truck, manual",tags:["pallet truck","warehouse","handling"]},

    {id:"p13",name:"Electric Wire Rope Hoist 5 Ton",slug:"electric-wire-rope-hoist-5ton",
     cat:"c4",sub:"s43",brand:"Indef",model:"ERH-5000",sku:"TW-MH-4003",
     featured:true,badge:"",stock:"Made to Order",moq:"1 Unit",
     short:"5T FEM-rated electric hoist for EOT cranes and gantries, with dual-speed hoisting.",
     desc:"FEM 2m duty class wire rope hoist for overhead crane and gantry applications. Dual-speed hoisting allows fine placement of loads, and the geared limit switch stops travel at both ends of the lift independently of the operator.\n\nSupplied to your span and lift; commissioning and load testing by our service team is included within Delhi NCR.",
     images:[twPlaceholder("Wire Rope Hoist","dark"),twPlaceholder("Crane Install","steel")],
     specs:[["Capacity","5,000 kg"],["Duty Class","FEM 2m / M5"],["Standard Lift","6 m (customisable)"],
            ["Hoisting Speed","4 / 0.7 m per min"],["Supply","415 V, 3 phase, 50 Hz"],
            ["Control","24 V pendant, IP55"],["Warranty","12 months"]],
     features:["Dual-speed hoisting","Geared upper and lower limit switches","IP55 pendant control","Thermal motor protection"],
     applications:["EOT and gantry cranes","Jib crane installations","Foundry and heavy machine shops"],
     includes:"Hoist, pendant, commissioning (NCR)",tags:["hoist","crane","electric"]},

    /* ---- Machinery ---- */
    {id:"p14",name:"All-Geared Lathe Machine 6 Feet × 200mm",slug:"all-geared-lathe-6ft",
     cat:"c5",sub:"s51",brand:"Kirloskar",model:"AGL-6200",sku:"TW-MC-5001",
     featured:true,badge:"Flagship",stock:"Made to Order",moq:"1 Unit",
     short:"Heavy-duty all-geared centre lathe with hardened bed, 8 spindle speeds and coolant system.",
     desc:"A production centre lathe on a heavily ribbed cast iron bed, induction hardened and ground on the guideways to hold accuracy through years of turning. Eight spindle speeds through an all-geared headstock give real torque at low rpm — the difference between roughing a forging and skating over it.\n\nDelivered with installation, levelling, trial cut and operator handover by our service engineers. Foundation drawing supplied on order confirmation.",
     images:[twPlaceholder("Lathe Machine","steel"),twPlaceholder("Headstock","dark"),twPlaceholder("Bed Ways","light")],
     specs:[["Height of Centres","200 mm"],["Admit Between Centres","1,800 mm (6 ft)"],
            ["Swing Over Bed","400 mm"],["Swing Over Cross Slide","240 mm"],["Spindle Bore","52 mm"],
            ["Spindle Nose","D1-6 Camlock"],["Spindle Speeds","8 steps, 45 – 1,200 rpm"],
            ["Main Motor","3 HP / 2.2 kW, 3 phase"],["Bed","Induction hardened & ground"],
            ["Net Weight","1,450 kg"],["Warranty","12 months"]],
     features:["Induction hardened and ground bed","All-geared headstock with 8 speeds",
               "Metric and imperial threading gearbox","Integrated coolant pump and tray",
               "Installation and trial cut by our engineers"],
     applications:["General machining job shops","Shaft, bush and pulley turning","Maintenance workshops","ITI and polytechnic training"],
     includes:"Machine, 3-jaw chuck, 4-jaw chuck, face plate, steady rests, coolant system, tool kit",
     tags:["lathe","machinery","turning"]},

    {id:"p15",name:"Pillar Drilling Machine 25mm",slug:"pillar-drill-25mm",
     cat:"c5",sub:"s52",brand:"Batliboi",model:"PD-25",sku:"TW-MC-5002",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"Floor-mounted 25mm capacity pillar drill with 12-speed belt drive and swivelling table.",
     desc:"A solid floor drill for fabrication shops. Twelve belt-driven speeds cover everything from large-diameter holes in mild steel to small drills in stainless, and the table swivels and rises on a rack for awkward workpieces.",
     images:[twPlaceholder("Pillar Drill","steel")],
     specs:[["Drilling Capacity","25 mm in mild steel"],["Spindle Taper","MT-3"],["Spindle Travel","120 mm"],
            ["Speeds","12 steps, 120 – 2,400 rpm"],["Motor","1.5 HP, 3 phase"],["Column Ø","92 mm"],["Weight","190 kg"]],
     features:["12-speed belt drive","Rack-and-pinion table lift","Swivelling and tilting table","Emergency stop"],
     applications:["Fabrication drilling","Batch component work","Maintenance shops"],
     includes:"Machine, drill chuck, key, drift",tags:["drill","machine","pillar"]},

    {id:"p16",name:"Hydraulic Sheet Bending Machine 2500mm",slug:"sheet-bending-machine-2500",
     cat:"c5",sub:"s53",brand:"Toolwerk",model:"SB-2500",sku:"TW-MC-5003",
     featured:false,badge:"",stock:"Made to Order",moq:"1 Unit",
     short:"2500mm hydraulic press brake for 4mm mild steel with programmable back gauge.",
     desc:"A press brake sized for the sheet metal jobbing shop. The NC control stores bend programs so repeat jobs set up in minutes, and the motorised back gauge repeats flange lengths to ±0.1mm across the batch.",
     images:[twPlaceholder("Press Brake","dark")],
     specs:[["Bending Length","2,500 mm"],["Capacity","4 mm mild steel"],["Pressing Force","63 Ton"],
            ["Back Gauge","Motorised NC, ±0.1 mm"],["Motor","5.5 kW"],["Weight","3,800 kg"],["Warranty","12 months"]],
     features:["NC programmable back gauge","Quick-clamp tooling","Two-hand safety control","Light curtain option"],
     applications:["Sheet metal fabrication","Enclosure and panel manufacture","Ducting work"],
     includes:"Machine, standard punch and die set, NC control",tags:["press brake","bending","sheet metal"]},

    /* ---- Air & Power ---- */
    {id:"p17",name:"Reciprocating Air Compressor 10 HP 500L",slug:"air-compressor-10hp-500l",
     cat:"c6",sub:"s61",brand:"ELGi",model:"TS10-500",sku:"TW-AP-6001",
     featured:true,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"Two-stage 10HP compressor with 500L receiver — continuous air for a full pneumatic shop.",
     desc:"A two-stage, air-cooled reciprocating compressor built for shops running impact wrenches, spray guns and pneumatic presses simultaneously. The 500L receiver smooths demand spikes so the motor is not short-cycling all day, which is what kills cheaper units inside a year.\n\nSupplied with auto drain valve, pressure switch, safety valve and IS 2825 certified receiver.",
     images:[twPlaceholder("Air Compressor","steel"),twPlaceholder("Receiver Tank","dark")],
     specs:[["Motor Power","10 HP / 7.5 kW"],["Stages","Two-stage, air cooled"],["FAD","1,100 lpm @ 12 bar"],
            ["Max Pressure","12.3 bar"],["Receiver Volume","500 litres"],["Receiver Standard","IS 2825 certified"],
            ["Supply","415 V, 3 phase, 50 Hz"],["Noise Level","82 dB(A)"],["Weight","420 kg"],["Warranty","12 months"]],
     features:["Two-stage compression for lower running temperature","IS 2825 certified receiver with test certificate",
               "Automatic condensate drain","Low-speed pump for extended service life"],
     applications:["Pneumatic tool supply","Spray painting booths","Automotive service bays","Packaging lines"],
     includes:"Compressor, receiver, pressure switch, safety valve, drain",tags:["compressor","air","pneumatic"]},

    {id:"p18",name:"Silent Diesel Generator 25 kVA",slug:"diesel-generator-25kva",
     cat:"c6",sub:"s63",brand:"Kirloskar",model:"KG25-S",sku:"TW-AP-6002",
     featured:true,badge:"CPCB IV+",stock:"Made to Order",moq:"1 Unit",
     short:"CPCB IV+ compliant 25 kVA silent DG set with AMF panel option and 8-hour tank.",
     desc:"A CPCB IV+ emission compliant diesel generating set in an acoustic enclosure rated 75 dB(A) at 1 metre. The 8-hour base fuel tank covers a standard shift without refuelling, and the optional AMF panel transfers load automatically within 15 seconds of a mains failure.",
     images:[twPlaceholder("DG Set 25kVA","dark"),twPlaceholder("Control Panel","steel")],
     specs:[["Prime Rating","25 kVA / 20 kW"],["Voltage","415 V, 3 phase, 50 Hz"],["Engine","4-cylinder, water cooled"],
            ["Emission Norm","CPCB IV+"],["Fuel Tank","65 litres (8 hours)"],["Noise Level","75 dB(A) @ 1 m"],
            ["Alternator","Brushless, self-excited"],["Weight","980 kg"],["Warranty","24 months / 2,000 hrs"]],
     features:["CPCB IV+ compliant","Acoustic enclosure 75 dB(A)","Optional AMF auto changeover panel",
               "Digital controller with fault logging","Anti-vibration mounts"],
     applications:["Factory standby power","Construction site power","Hospital and institutional backup"],
     includes:"DG set, enclosure, battery, standard control panel",tags:["generator","dg set","power"]},

    {id:"p19",name:"Industrial High Pressure Washer 200 Bar",slug:"pressure-washer-200bar",
     cat:"c6",sub:"s64",brand:"Karcher",model:"HD 7/20",sku:"TW-AP-6003",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"200 bar three-phase pressure washer with brass pump head for continuous industrial cleaning.",
     desc:"A three-phase cold-water washer sized for daily plant cleaning duty. Brass pump head with ceramic pistons handles hard water far better than aluminium units, and the slow-running motor keeps noise and wear down over long cleaning shifts.",
     images:[twPlaceholder("Pressure Washer","steel")],
     specs:[["Working Pressure","200 bar"],["Flow Rate","700 lph"],["Motor","5.5 kW, 3 phase"],
            ["Pump Head","Brass, ceramic pistons"],["Hose","10 m high pressure"],["Weight","62 kg"],["Warranty","12 months"]],
     features:["Brass pump head with ceramic pistons","Slow-running motor for longer life","Integrated hose reel","Detergent injection"],
     applications:["Plant and machinery cleaning","Vehicle fleet washing","Floor and facade cleaning"],
     includes:"Machine, gun, lance, 10m hose",tags:["pressure washer","cleaning"]},

    {id:"p20",name:"Pneumatic Impact Wrench 3/4 Inch 1600 Nm",slug:"pneumatic-impact-wrench-34",
     cat:"c6",sub:"s62",brand:"Ingersoll Rand",model:"2145QiMAX",sku:"TW-AP-6004",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"3/4\" drive air impact wrench delivering 1600 Nm for heavy vehicle and plant bolting.",
     desc:"A twin-hammer air impact wrench for tyre bays and heavy maintenance. The quiet-technology housing brings sound down to 88 dB(A) without losing output, and the four-position power regulator lets the same tool run light fasteners safely.",
     images:[twPlaceholder("Air Impact Wrench","dark")],
     specs:[["Drive","3/4\" square"],["Max Torque","1,600 Nm"],["Free Speed","7,000 rpm"],
            ["Air Consumption","198 lpm"],["Air Inlet","1/2\" NPT"],["Sound Level","88 dB(A)"],["Weight","3.2 kg"]],
     features:["Twin hammer mechanism","4-position power regulator","Quiet technology housing"],
     applications:["Tyre bays and truck workshops","Heavy plant maintenance","Assembly of large fasteners"],
     includes:"Tool, air fitting",tags:["pneumatic","impact","air tool"]},

    /* ---- Measuring ---- */
    {id:"p21",name:"Digital Vernier Caliper 0–300mm IP54",slug:"digital-vernier-caliper-300mm",
     cat:"c7",sub:"s71",brand:"Mitutoyo",model:"500-193",sku:"TW-MS-7001",
     featured:true,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"IP54 coolant-proof digital caliper, 0.01mm resolution, with calibration certificate.",
     desc:"A coolant-proof digital caliper for use at the machine rather than only in the inspection room. Hardened stainless steel body, 0.01mm resolution, and an absolute encoder that keeps its origin when switched off — no re-zeroing every morning.\n\nSupplied with NABL-traceable calibration certificate on request.",
     images:[twPlaceholder("Digital Caliper","light"),twPlaceholder("Measuring Jaws","steel")],
     specs:[["Range","0 – 300 mm / 0 – 12\""],["Resolution","0.01 mm"],["Accuracy","±0.03 mm"],
            ["Protection","IP54 coolant proof"],["Encoder","ABS absolute"],["Battery","SR44, ~3.5 years"],
            ["Material","Hardened stainless steel"],["Certificate","NABL traceable, on request"]],
     features:["Absolute encoder — no re-zeroing","IP54 coolant and dust proof","mm/inch instant conversion","Data output port"],
     applications:["In-process machining checks","Incoming quality inspection","Toolroom measurement"],
     includes:"Caliper, case, battery",tags:["caliper","measuring","inspection"]},

    {id:"p22",name:"Self-Levelling Green Cross Line Laser Level",slug:"cross-line-laser-level-green",
     cat:"c7",sub:"s72",brand:"Bosch",model:"GLL 3-80 G",sku:"TW-MS-7002",
     featured:false,badge:"",stock:"In Stock",moq:"1 Unit",
     short:"Three-plane 360° green laser with 30m working range for layout and installation work.",
     desc:"Three 360° green laser planes — one horizontal, two vertical — project a complete reference around a room in one setup. Green diodes are roughly four times more visible than red to the human eye, which matters on bright site conditions.",
     images:[twPlaceholder("Laser Level","amber")],
     specs:[["Working Range","30 m (120 m with receiver)"],["Accuracy","±0.2 mm/m"],["Self-Levelling Range","±4°"],
            ["Laser Class","2, green 500–540 nm"],["Protection","IP54"],["Battery","Li-ion 12V or AA"],["Weight","0.9 kg"]],
     features:["Three 360° planes in one setup","Green diode — 4× brighter than red","Self-levelling with out-of-level alert"],
     applications:["False ceiling and partition layout","Machine foundation alignment","Electrical and HVAC installation"],
     includes:"Laser, battery, charger, target plate, case",tags:["laser","level","layout"]},

    /* ---- Safety ---- */
    {id:"p23",name:"Full Body Safety Harness with Double Lanyard",slug:"full-body-harness-double-lanyard",
     cat:"c8",sub:"s83",brand:"Karam",model:"PN-56",sku:"TW-SF-8001",
     featured:true,badge:"IS Certified",stock:"In Stock",moq:"10 Nos",
     short:"IS 3521 certified fall-arrest harness with shock-absorbing double lanyard for 100% tie-off.",
     desc:"A fall-arrest harness for work at height where the user must stay connected while moving between anchor points. The double lanyard with energy absorber limits arrest force to under 6 kN, and the forked design allows 100% tie-off during transfer.\n\nEach batch ships with a test certificate; we also run harness inspection training for your safety team on request.",
     images:[twPlaceholder("Safety Harness","amber"),twPlaceholder("Lanyard Hooks","dark")],
     specs:[["Standard","IS 3521 / EN 361"],["Attachment Points","Dorsal D-ring + 2 frontal"],
            ["Lanyard","Twin leg with energy absorber"],["Hooks","Scaffold hooks, 55 mm gate"],
            ["Max Arrest Force","< 6 kN"],["User Weight Limit","140 kg"],["Webbing","Polyester, 45 mm"]],
     features:["100% tie-off with twin lanyard","Energy absorber pack","Adjustable thigh and shoulder straps","Batch test certificate"],
     applications:["Work at height","Scaffolding and erection","Tower and roof maintenance","Confined space entry"],
     includes:"Harness, twin lanyard, carry bag",tags:["safety","harness","height","ppe"]},

    {id:"p24",name:"Industrial Safety Helmet with Ratchet (Pack of 10)",slug:"safety-helmet-ratchet-pack10",
     cat:"c8",sub:"s81",brand:"3M",model:"H-700",sku:"TW-SF-8002",
     featured:false,badge:"",stock:"In Stock",moq:"10 Nos",
     short:"IS 2925 helmet with 4-point ratchet suspension and vented shell, in a pack of ten.",
     desc:"HDPE shell helmet with a four-point ratchet suspension that adjusts one-handed while wearing gloves. Accessory slots take earmuffs and visors from the same range, so one helmet covers grinding, welding and general site duty.",
     images:[twPlaceholder("Safety Helmet","amber")],
     specs:[["Standard","IS 2925 / EN 397"],["Shell Material","HDPE, UV stabilised"],["Suspension","4-point ratchet"],
            ["Accessory Slots","Universal 30 mm"],["Colours","White, Yellow, Blue, Red"],["Pack Size","10 helmets"]],
     features:["One-hand ratchet adjustment","Vented shell option","Universal accessory slots","Custom logo printing available"],
     applications:["Construction sites","Plant and factory floors","Warehouse operations"],
     includes:"10 helmets with suspension",tags:["helmet","ppe","safety"]}
  ],

  pages:{
    services:[
      {i:"🔩",t:"Installation & Commissioning",d:"Foundation guidance, levelling, alignment, trial run and operator handover for every machine we supply."},
      {i:"🧰",t:"Annual Maintenance Contracts",d:"Scheduled preventive visits, priority breakdown response and genuine spares at contract rates."},
      {i:"📐",t:"Calibration Services",d:"NABL-traceable calibration for measuring instruments, torque tools and pressure gauges."},
      {i:"🎓",t:"Operator Training",d:"On-site training on safe operation, daily checks and first-level troubleshooting for your team."},
      {i:"🏭",t:"Plant Fit-Out Consulting",d:"Layout, equipment selection and phased procurement planning for new lines and greenfield units."},
      {i:"🔁",t:"Buy-back & Exchange",d:"Trade in ageing machines against new equipment with fair, transparent valuation."}
    ],
    industries:["Automotive & Ancillaries","Fabrication & Structural","Construction & Infrastructure",
                "Pharma & Food Processing","Power & Energy","Railways & Defence","Education & Training Institutes","Warehousing & Logistics"],
    faqs:[
      {q:"Do you supply against GST invoice and tender documentation?",
       a:"Yes. All supplies are made under proper GST invoicing. We provide test certificates, warranty cards, OEM authorisation letters and any documentation required for tenders, government supply orders and internal audits."},
      {q:"What is the typical delivery time?",
       a:"Stocked items dispatch the same or next working day, reaching most metros within 48–72 hours. Machinery and made-to-order equipment typically takes 2–6 weeks depending on configuration; we confirm a firm date at order stage."},
      {q:"Do you install and commission machinery?",
       a:"Yes. All machine tools, compressors, DG sets and hoists include installation and commissioning by our own service engineers. Foundation drawings are shared on order confirmation so civil work can run in parallel."},
      {q:"Can we get bulk or rate-contract pricing?",
       a:"Absolutely. Send us your annual consumption list or MRO catalogue and we will quote an annual rate contract with fixed pricing and agreed service levels."},
      {q:"What about after-sales service and spares?",
       a:"We run an in-house service workshop and stock fast-moving spares for the brands we distribute. Annual Maintenance Contracts are available with defined response times."},
      {q:"Do you export or supply outside India?",
       a:"We supply across India and handle export consignments to select markets. Share your requirement and destination and our team will revert with logistics and documentation details."}
    ],
    testimonials:[
      {n:"Rakesh Menon",r:"Plant Head, Auto Components — Pune",
       t:"We consolidated eleven vendors into one. Their team knows the difference between what a catalogue says and what actually survives a three-shift operation."},
      {n:"S. Balaji",r:"Maintenance Manager, Fabrication Unit — Chennai",
       t:"Ordered a 250A inverter welder on a Tuesday, welding with it on Thursday. When the torch failed in month four they replaced it in two days, no argument."},
      {n:"Anita Sharma",r:"Procurement Lead, EPC Contractor — Delhi NCR",
       t:"Documentation is the part everyone gets wrong. Their invoices, test certificates and warranty papers have never once held up our audit."}
    ]
  },

  leads:[]
};

/* ---------------- Storage layer ---------------- */
const TW = {
  KEY:'TW_DB_v1',
  db:null,
  load(){
    if(this.db) return this.db;
    try{
      const raw = localStorage.getItem(this.KEY);
      this.db = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(TW_SEED));
    }catch(e){ this.db = JSON.parse(JSON.stringify(TW_SEED)); }
    // forward-compat: fill any keys added after the visitor's copy was saved
    ['settings','categories','products','pages','leads'].forEach(k=>{
      if(this.db[k]==null) this.db[k]=JSON.parse(JSON.stringify(TW_SEED[k]));
    });
    return this.db;
  },
  save(){ try{ localStorage.setItem(this.KEY, JSON.stringify(this.db)); }catch(e){ console.warn('Storage full or blocked',e); } },
  reset(){ localStorage.removeItem(this.KEY); this.db=null; return this.load(); },
  get s(){ return this.load().settings; },
  get cats(){ return this.load().categories; },
  get prods(){ return this.load().products; },
  get pages(){ return this.load().pages; },
  cat(id){ return this.cats.find(c=>c.id===id); },
  catBySlug(sl){ return this.cats.find(c=>c.slug===sl); },
  sub(catId,subId){ const c=this.cat(catId); return c && c.subs.find(s=>s.id===subId); },
  prod(id){ return this.prods.find(p=>p.id===id || p.slug===id); },
  countIn(catId){ return this.prods.filter(p=>p.cat===catId).length; },
  addLead(l){
    const db=this.load();
    db.leads.unshift(Object.assign({id:'L'+Date.now(),date:new Date().toISOString(),status:'New'},l));
    this.save();
  },
  uid(p){ return p + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3); }
};
