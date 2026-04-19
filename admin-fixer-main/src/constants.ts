import { Language } from './types';

export const ASSETS = {
  logo: 'https://i.ibb.co/p6mrsWqN/Screenshot-from-2026-02-16-23-29-47.png',
  mainBackground: 'https://i.postimg.cc/RZ0ksS9G/7f8313524e33f3802bb2cdc99a66ed45.jpg',
  heroVideo: 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
  heroFallback: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2670&auto=format&fit=crop',
  fonts: {
    heading: 'Abhaya Libre',
    body: 'DM Sans',
    vintage: 'Abhaya Libre',
    accent: 'Inter',
  },
};

// Curated Google Fonts catalog (supports Latin + Georgian where noted)
export const FONT_OPTIONS: { name: string; weights: string; category: string; ka?: boolean }[] = [
  // Display / Vintage
  { name: 'Abhaya Libre', weights: '400;600;700;800', category: 'Serif Display' },
  { name: 'Playfair Display', weights: '400;600;700;800;900', category: 'Serif Display' },
  { name: 'Cormorant Garamond', weights: '400;500;600;700', category: 'Serif Display' },
  { name: 'Cinzel', weights: '400;600;700;900', category: 'Serif Display' },
  { name: 'Bodoni Moda', weights: '400;600;700;900', category: 'Serif Display' },
  { name: 'DM Serif Display', weights: '400', category: 'Serif Display' },
  // Sans-serif
  { name: 'Inter', weights: '400;500;600;700;800;900', category: 'Sans-serif' },
  { name: 'DM Sans', weights: '400;500;700', category: 'Sans-serif' },
  { name: 'Manrope', weights: '400;500;600;700;800', category: 'Sans-serif' },
  { name: 'Poppins', weights: '400;500;600;700;800;900', category: 'Sans-serif' },
  { name: 'Montserrat', weights: '400;500;600;700;800;900', category: 'Sans-serif' },
  { name: 'Raleway', weights: '400;500;600;700;800;900', category: 'Sans-serif' },
  { name: 'Work Sans', weights: '400;500;600;700;800;900', category: 'Sans-serif' },
  { name: 'Space Grotesk', weights: '400;500;600;700', category: 'Sans-serif' },
  { name: 'Plus Jakarta Sans', weights: '400;500;600;700;800', category: 'Sans-serif' },
  // Mono / Tech
  { name: 'JetBrains Mono', weights: '400;500;600;700;800', category: 'Mono' },
  { name: 'Space Mono', weights: '400;700', category: 'Mono' },
  { name: 'IBM Plex Mono', weights: '400;500;600;700', category: 'Mono' },
  // Handwritten / Script
  { name: 'Caveat', weights: '400;600;700', category: 'Handwritten' },
  { name: 'Pacifico', weights: '400', category: 'Handwritten' },
  { name: 'Dancing Script', weights: '400;600;700', category: 'Handwritten' },
  { name: 'Great Vibes', weights: '400', category: 'Handwritten' },
  // Georgian-friendly
  { name: 'Noto Sans Georgian', weights: '400;500;600;700;800;900', category: 'Georgian', ka: true },
  { name: 'Noto Serif Georgian', weights: '400;500;600;700;800;900', category: 'Georgian', ka: true },
  { name: 'BPG Arial', weights: '400', category: 'Georgian', ka: true },
];

export const TRANSLATIONS: Record<Language, any> = {
  ka: {
    ui: {
      book: "დაჯავშნა",
      discoverRooms: "აღმოაჩინე ოთახები",
      premiumCenter: "პრემიუმ სათავგადასავლო ცენტრი",
      heroDesc: "სპორტულ-სათავგადასავლო თამაშები Fort-Boyard-ის სტილში.",
      backToList: "სიაში დაბრუნება",
      back: "დაბრუნება",
      seeAll: "იხილეთ ყველა",
      rooms: "ოთახები",
      services: "სერვისები",
      price: "ფასი",
      copied: "დაკოპირდა",
      contactUs: "დაგვიკავშირდით",
      writeUs: "მოგვწერეთ",
      followUs: "დაგვათვალიერეთ",
      callUs: "დაგვირეკეთ",
      pricingTitle: "ფასები",
      pricingDesc: "შეარჩიეთ საუკეთესო დრო თქვენი დღესასწაულისთვის. პროგრამა გრძელდება 2 საათი.",
      rulesTitle: "წესები",
      rulesDesc: "გთხოვთ გაითვალისწინოთ შემდეგი პირობები ღონისძიების დაგეგმვისას.",
      menuTitle: "მენიუ",
      menuDesc: "ჩვენი რესტორნის სრული ასორტიმენტი თქვენი სადღესასწაულო სუფრისთვის.",
      bookingTitle: "დაჯავშნა",
      bookingDesc: "დაგვიკავშირდით სასურველი მეთოდით თქვენი დაუვიწყარი თავგადასავლის დასაგეგმად.",
      footerDesc: "სპორტულ-სათავგადასავლო თამაშები და დაუვიწყარი დაბადების დღეები თბილისში.",
      product: "პროდუქტი",
      company: "კომპანია",
      copyright: "© 2024 LOST LOCK ENTERTAINMENT",
      session: "სესია",
      nextChild: "ყოველი შემდეგი ბავშვი",
      faq: "ხშირად დასმული კითხვები"
    },
    nav: [
      { label: 'მთავარი', href: '#' },
      { label: 'ფასები', href: '#prices' },
      { label: 'ოთახები', href: '#obstacles' },
      { label: 'სერვისები', href: '#services' },
      { label: 'მენიუ', href: '#menu' },
      { label: 'ხშირად დასმული კითხვები', href: '#faq' },
      { label: 'წესები', href: '#privacy' },
    ],
    obstacles: [
      { id: 'marao', name: 'მარაო', category: 'ოთახები', image: 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png', link: '#marao', description: 'მარაო არის ერთ-ერთი ყველაზე დახვეწილი და ტექნიკური დაბრკოლება Lost-Lock-ში. აქ მოთამაშეებს მოუწევთ წონასწორობის დაცვა და სწრაფი რეაგირება.' },
      { id: 'train', name: 'მატარებელი', category: 'ოთახები', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#train', description: 'მატარებლის ოთახი გადაგიყვანთ ნამდვილ სათავგადასავლო ატმოსფეროში.' },
      { id: 'numbers', name: 'ციფრები', category: 'ოთახები', image: 'https://framerusercontent.com/images/uMFgcLNLDKCjhlXiiwGov4.png', link: '#numbers', description: 'ლოგიკური აზროვნების და მათემატიკური სიზუსტის ოთახი.' },
      { id: 'sawdust', name: 'ნახერხი', category: 'ოთახები', image: 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png', link: '#sawdust', description: 'ფიზიკური აქტივობის და გართობის იდეალური ნაზავი.' },
      { id: 'prison', name: 'საპატიმრო', category: 'ოთახები', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#prison', description: 'გახდით ციხიდან გაქცევის გმირი.' },
      { id: 'balls', name: 'ბურთები', category: 'ოთახები', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#balls', description: 'მხიარული და ფერადი ოთახი, სადაც ბურთების ზღვაში უნდა იპოვოთ საჭირო გასაღებები.' },
      { id: 'pipe', name: 'მილი', category: 'ოთახები', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#pipe', description: 'ვიწრო გასასვლელები და რთული მარშრუტები.' },
      { id: 'golf', name: 'გოლფი', category: 'ოთახები', image: 'https://framerusercontent.com/images/k3SnFvBIk9U5QWL2JQxZJuMhOb4.png', link: '#golf', description: 'სიზუსტე და სიმშვიდე - ეს არის ის, რაც გოლფის ოთახში დაგჭირდებათ.' }
    ],
    services: [
      { id: 'photo', name: 'პროფესიონალი ფოტოგრაფი', price: '80₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#photo', description: 'პროფესიონალური ფოტო გადაღება.' },
      { id: 'video', name: 'პროფესიონალური ვიდეო გადაღება+მონტაჟი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#video', description: 'პროფესიონალური ვიდეო გადაღება და მონტაჟი.' },
      { id: 'xbox_laser', name: 'XBOX ცეკვები, ლაზერ შოუ, სკანერები', price: '80₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#xbox_laser', description: 'ტორტის ჩაქრობის ცერემონია და სპეცეფექტები.' },
      { id: 'animator_ru', name: 'რუსულენოვანი ანიმატორი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#animator_ru', description: 'პროფესიონალი ანიმატორი რუსულენოვანი ბავშვებისთვის.' },
      { id: 'animator_en', name: 'ინგლისურენოვანი ანიმატორი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#animator_en', description: 'პროფესიონალი ანიმატორი ინგლისურენოვანი ბავშვებისთვის.' },
      { id: 'barman', name: 'ბარმენ შოუ', price: '300₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#barman', description: 'კოქტეილ წვეულება და სანახაობრივი ბარმენ შოუ.' }
    ],
    pricing: [
      { title: "11:00 & 13:30 სესია", price: "700₾", features: ["2-საათიანი პროგრამა", "მენიუ 20 ბავშვზე", "საჩუქარი დამსახურეს ბავშვს", "XBOX, ლაზერ შოუ", "ტორტის ცერემონია", "Lost ჰოსტები", "ყოველი შემდეგი ბავშვი: 30₾"] },
      { title: "16:00 სესია", price: "750₾", recommended: true, features: ["2-საათიანი პროგრამა", "მენიუ 20 ბავშვზე", "საჩუქარი დამსახურეს ბავშვს", "XBOX, ლაზერ შოუ", "ტორტის ცერემონია", "Lost ჰოსტები", "ყოველი შემდეგი ბავშვი: 30₾"] },
      { title: "18:30 სესია", price: "800₾", features: ["2-საათიანი პროგრამა", "მენიუ 20 ბავშვზე", "საჩუქარი დამსახურეს ბავშვს", "XBOX, ლაზერ შოუ", "ტორტის ცერემონია", "Lost ჰოსტები", "ყოველი შემდეგი ბავშვი: 30₾"] },
      { title: "21:00 სესია", price: "1000₾", features: ["2-საათიანი პროგრამა", "მენიუ 20 ბავშვზე", "საჩუქარი დამსახურეს ბავშვს", "XBOX, ლაზერ შოუ", "ტორტის ცერემონია", "Lost ჰოსტები", "ყოველი შემდეგი ბავშვი: 30₾"] }
    ],
    rules: [
      "1. დაჯავშნისთვის აუცილებელია ბეს გადახდა. დაჯავშნის შემდეგ თარიღი არ იცვლება და ბე არ ბრუნდება.",
      "2. ბავშვების საბოლოო რაოდენობა და მშობლების მენიუ უნდა დადასტურდეს წინა დღის 19:00-მდე.",
      "3. დღეს მოყვანილ დამატებით ბავშვებზე ვრცელდება მენიუს ღირებულება (საკვების გარეშე).",
      "4. ღონისძიება გრძელდება ზუსტად 2 საათი. დაგვიანების შემთხვევაში დრო არ გაიხანგრძლივება.",
      "5. მხოლოდ ტორტის და ნამცხვრების მოტანა ნებადართულია.",
      "6. გარე სასმელების მოტანა აკრძალულია. დარღვევისას ვრცელდება 20% დანამატი მშობლების მენიუზე.",
      "7. ფეიერვერკები აკრძალულია ცენტრიდან 200მ რადიუსში.",
      "8. პროგრამა 6+ ასაკისთვისაა. 6 წლამდე ბავშვებს სჭირდებათ მშობლის მუდმივი ზედამხედველობა.",
      "9. მედია ლინკებს აქვთ შეზღუდული ვადა; ხელახლა ატვირთვა ღირს 20 ლარი.",
      "10. თამაშის ზონებში ფოტო/ვიდეო გადაღება ნებადართულია მხოლოდ Lost-ის პერსონალის მიერ."
    ],
    faq: [
      { question: "რა არის მინიმალური ასაკი?", answer: "პროგრამა განკუთვნილია 6 წლის და უფროსი ასაკის ბავშვებისთვის." },
      { question: "რამდენ ხანს გრძელდება პროგრამა?", answer: "ღონისძიება გრძელდება ზუსტად 2 საათი." },
      { question: "შეგვიძლია საკუთარი საკვების მოტანა?", answer: "მხოლოდ დაბადების დღის ტორტის და ნამცხვრების მოტანა ნებადართულია." },
      { question: "როგორ დავადასტუროთ ჯავშანი?", answer: "ჯავშნისთვის საჭიროა წინასწარი ბეს გადახდა." }
    ],
    menu: {
      soft: { title: "გამაგრილებელი", items: [{ name: "კოკა-კოლა (0.5)", price: "3₾" }, { name: "ფანტა (0.5)", price: "3₾" }, { name: "სპრაიტი (0.5)", price: "3₾" }, { name: "კაპი (0.5)", price: "4₾" }, { name: "აის თი (0.5)", price: "4₾" }, { name: "წყალი (0.5)", price: "2₾" }] },
      dough: { title: "ცომეული", items: [{ name: "პიცა მარგარიტა (8 ნაჭრიანი)", price: "24₾" }, { name: "პიცა პეპერონი (8 ნაჭრიანი)", price: "28₾" }, { name: "ოთხი ყველის პიცა (8 ნაჭრიანი)", price: "28₾" }, { name: "ხაჭაპური იმერული (8 ნაჭრიანი)", price: "26₾" }, { name: "ხაჭაპური მეგრული (8 ნაჭრიანი)", price: "28₾" }, { name: "ლობიანი (8 ნაჭრიანი)", price: "17₾" }] },
      hot: { title: "ყავა / ჩაი", items: [{ name: "ამერიკანო", price: "6₾" }, { name: "ესპრესო", price: "6₾" }, { name: "თურქული ყავა", price: "6₾" }, { name: "ჩაი", price: "4₾" }] },
      meat_salad: { title: "სალათები / ხორცეული", items: [{ name: "კიტრი-პომიდვრის სალათი ნიგვზით", price: "17₾" }, { name: "მწვადი ღორის (5 ნაჭერი)", price: "24₾" }, { name: "მწვადი ქათმის (5 ნაჭერი)", price: "20₾" }, { name: "ქათმის ნაგეთსები (5 ნაჭერი)", price: "20₾" }] },
      garnir_dessert: { title: "გარნირი / დესერტი", items: [{ name: "კარტოფილი ფრი", price: "12₾" }, { name: "ფრი სოუსით", price: "15₾" }, { name: "ხილის ასორტი (სეზონური)", price: "26₾" }] }
    }
  },
  en: {
    ui: {
      book: "Book Now",
      discoverRooms: "Discover Rooms",
      premiumCenter: "Premium Adventure Center",
      heroDesc: "Sports-adventure games in the style of Fort Boyard.",
      backToList: "Back to List",
      back: "Back",
      seeAll: "See All",
      rooms: "Rooms",
      services: "Services",
      price: "Price",
      copied: "Copied",
      contactUs: "Contact Us",
      writeUs: "Message Us",
      followUs: "Follow Us",
      callUs: "Call Us",
      pricingTitle: "Pricing",
      pricingDesc: "Choose the best time for your celebration. The program lasts 2 hours.",
      rulesTitle: "Rules",
      rulesDesc: "Please consider the following conditions when planning your event.",
      menuTitle: "Menu",
      menuDesc: "Complete range of our restaurant for your festive table.",
      bookingTitle: "Booking",
      bookingDesc: "Contact us by your preferred method to plan your unforgettable adventure.",
      footerDesc: "Sports-adventure games and unforgettable birthdays in Tbilisi.",
      product: "Product",
      company: "Company",
      copyright: "© 2024 LOST LOCK ENTERTAINMENT",
      session: "Session",
      nextChild: "Each next child",
      faq: "FAQ"
    },
    nav: [
      { label: 'Home', href: '#' },
      { label: 'Prices', href: '#prices' },
      { label: 'Rooms', href: '#obstacles' },
      { label: 'Services', href: '#services' },
      { label: 'Menu', href: '#menu' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Rules', href: '#privacy' },
    ],
    obstacles: [
      { id: 'marao', name: 'The Fan', category: 'Rooms', image: 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png', link: '#marao', description: 'The Fan is one of the most sophisticated technical obstacles in Lost-Lock.' },
      { id: 'train', name: 'The Train', category: 'Rooms', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#train', description: 'The Train room takes you into a real adventure atmosphere.' },
      { id: 'numbers', name: 'Numbers', category: 'Rooms', image: 'https://framerusercontent.com/images/uMFgcLNLDKCjhlXiiwGov4.png', link: '#numbers', description: 'Room for logical thinking and mathematical precision.' },
      { id: 'sawdust', name: 'Sawdust', category: 'Rooms', image: 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png', link: '#sawdust', description: 'Perfect mix of physical activity and fun.' },
      { id: 'prison', name: 'Prison', category: 'Rooms', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#prison', description: 'Become a prison break hero.' },
      { id: 'balls', name: 'Ball Pit', category: 'Rooms', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#balls', description: 'Fun and colorful room where you must find keys hidden in a sea of balls.' },
      { id: 'pipe', name: 'The Pipe', category: 'Rooms', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#pipe', description: 'Narrow passages and difficult routes.' },
      { id: 'golf', name: 'Golf', category: 'Rooms', image: 'https://framerusercontent.com/images/k3SnFvBIk9U5QWL2JQxZJuMhOb4.png', link: '#golf', description: 'Precision and calm - that\'s what you\'ll need.' }
    ],
    services: [
      { id: 'photo', name: 'Photographer', price: '80₾', category: 'Services', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#photo', description: 'Professional photo session.' },
      { id: 'video', name: 'Video Production', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#video', description: 'Professional video shooting and editing.' },
      { id: 'xbox_laser', name: 'XBOX, Laser Show, Scanners', price: '80₾', category: 'Services', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#xbox_laser', description: 'Cake ceremony special effects.' },
      { id: 'animator_ru', name: 'Russian Animator', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#animator_ru', description: 'Professional animator for Russian-speaking kids.' },
      { id: 'animator_en', name: 'English Animator', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#animator_en', description: 'Professional animator for English-speaking kids.' },
      { id: 'barman', name: 'Barman Show', price: '300₾', category: 'Services', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#barman', description: 'Cocktail party and spectacular barman show.' }
    ],
    pricing: [
      { title: "11:00 & 13:30 Session", price: "700₾", features: ["2-hour program", "Menu for 20 kids", "Birthday gift", "XBOX, Laser show", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "16:00 Session", price: "750₾", recommended: true, features: ["2-hour program", "Menu for 20 kids", "Birthday gift", "XBOX, Laser show", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "18:30 Session", price: "800₾", features: ["2-hour program", "Menu for 20 kids", "Birthday gift", "XBOX, Laser show", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "21:00 Session", price: "1000₾", features: ["2-hour program", "Menu for 20 kids", "Birthday gift", "XBOX, Laser show", "Cake ceremony", "Lost hosts", "Next child: 30₾"] }
    ],
    rules: [
      "1. A deposit is required to confirm the booking. Date cannot be changed and deposit is non-refundable.",
      "2. Final child count and parents' menu must be confirmed by 19:00 the day before.",
      "3. For extra children brought on the day, menu cost (without food) applies.",
      "4. The event lasts exactly 2 hours. In case of delay, time will not be extended.",
      "5. Only cakes and pastries are allowed to be brought in.",
      "6. Bringing outside drinks is prohibited. Violations incur a 20% surcharge.",
      "7. Explosives/fireworks are prohibited within 200m of the center.",
      "8. Program is for age 6+. Under 6 requires constant parental supervision.",
      "9. Media links have a limited time; re-uploading costs 20 GEL.",
      "10. Photography/videography in game zones is only allowed by Lost staff."
    ],
    faq: [
      { question: "What is the minimum age?", answer: "The program is designed for children aged 6 and up." },
      { question: "How long is the program?", answer: "The event lasts exactly 2 hours." },
      { question: "Can we bring our own food?", answer: "Only birthday cakes and pastries are allowed." },
      { question: "How to confirm booking?", answer: "Booking requires a prepayment deposit." }
    ],
    menu: {
      soft: { title: "Soft Drinks", items: [{ name: "Coca-Cola (0.5)", price: "3₾" }, { name: "Fanta (0.5)", price: "3₾" }, { name: "Sprite (0.5)", price: "3₾" }, { name: "Water (0.5)", price: "2₾" }] },
      dough: { title: "Baked", items: [{ name: "Pizza Margherita (8 slices)", price: "24₾" }, { name: "Pizza Pepperoni (8 slices)", price: "28₾" }, { name: "Four Cheese Pizza (8 slices)", price: "28₾" }, { name: "Khachapuri Imeruli (8 slices)", price: "26₾" }] },
      hot: { title: "Coffee / Tea", items: [{ name: "Americano", price: "6₾" }, { name: "Espresso", price: "6₾" }, { name: "Turkish Coffee", price: "6₾" }, { name: "Tea", price: "4₾" }] },
      meat_salad: { title: "Salads / Meat", items: [{ name: "Cucumber-Tomato Salad", price: "17₾" }, { name: "Pork Skewers (5 pcs)", price: "24₾" }, { name: "Chicken Skewers (5 pcs)", price: "20₾" }, { name: "Chicken Nuggets (5 pcs)", price: "20₾" }] },
      garnir_dessert: { title: "Sides / Dessert", items: [{ name: "French Fries", price: "12₾" }, { name: "Fries with Sauce", price: "15₾" }, { name: "Fruit Assortment", price: "26₾" }] }
    }
  }
};
