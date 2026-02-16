import { Language } from './types';

export const ASSETS = {
  // --- LOGO IMAGE ---
  // If you want to use an image instead of the SVG spider logo, 
  // paste the image URL here. If left empty, the SVG will be used.
  logo: 'https://i.ibb.co/p6mrsWqN/Screenshot-from-2026-02-16-23-29-47.png', // The logo provided by the user
  
  mainBackground: 'https://i.ibb.co/JjRZ4np1/background-burnt-damaged-grunge.jpg',
  heroVideo: 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
  heroFallback: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2670&auto=format&fit=crop'
};

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
      { id: 'train', name: 'მატარებელი', category: 'ოთახები', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#train', description: 'მატარებლის ოთახი გადაგიყვანთ ნამდვილ სათავგადასავლო ატმოსფეროში. მოთამაშეებმა უნდა ამოხსნან თავსატეხები ვაგონებში.' },
      { id: 'numbers', name: 'ციფრები', category: 'ოთახები', image: 'https://framerusercontent.com/images/uMFgcLNLDKCjhlXiiwGov4.png', link: '#numbers', description: 'ლოგიკური აზროვნების და მათემატიკური სიზუსტის ოთახი. იპოვეთ სწორი კომბინაცია და გადალახეთ ციფრული ბარიერი.' },
      { id: 'sawdust', name: 'ნახერხი', category: 'ოთახები', image: 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png', link: '#sawdust', description: 'ფიზიკური აქტივობის და გართობის იდეალური ნაზავი. ნუ შეგეშინდებათ დასვრის, აქ მთავარია სისწრაფე.' },
      { id: 'prison', name: 'საპატიმრო', category: 'ოთახები', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#prison', description: 'გახდით ციხიდან გაქცევის გმირი. იპოვეთ საიდუმლო გასასვლელები და დააღწიეთ თავი ტყვეობას.' },
      { id: 'balls', name: 'ბურთები', category: 'ოთახები', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#balls', description: 'მხიარული და ფერადი ოთახი, სადაც ბურთების ზღვაში უნდა იპოვოთ საჭირო გასაღებები.' },
      { id: 'pipe', name: 'მილი', category: 'ოთახები', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#pipe', description: 'ვიწრო გასასვლელები და რთული მარშრუტები. ეს ოთახი ამოწმებს თქვენს მოქნილობას და გამძლეობას.' },
      { id: 'golf', name: 'გოლფი', category: 'ოთახები', image: 'https://framerusercontent.com/images/k3SnFvBIk9U5QWL2JQxZJuMhOb4.png', link: '#golf', description: 'სიზუსტე და სიმშვიდე - ეს არის ის, რაც გოლფის ოთახში დაგჭირდებათ. გაიტანეთ ბურთი და გააღეთ კარი.' }
    ],
    services: [
      { id: 'photo', name: 'პროფესიონალი ფოტოგრაფი', price: '80₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#photo', description: 'პროფესიონალური ფოტო გადაღება თქვენი დღესასწაულის ყოველი წამისთვის.' },
      { id: 'video', name: 'პროფესიონალური ვიდეო გადაღება+მონტაჟი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#video', description: 'პროფესიონალური ვიდეო გადაღება და მონტაჟი სრული დღესასწაულისთვის.' },
      { id: 'xbox_laser', name: 'XBOX ცეკვები, ლაზერ შოუ, სკანერები', price: '80₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#xbox_laser', description: 'ტორტის ჩაქრობის ცერემონია და სპეცეფექტები.' },
      { id: 'animator_ru', name: 'რუსულენოვანი ანიმატორი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#animator_ru', description: 'პროფესიონალი ანიმატორი რუსულენოვანი ბავშვებისთვის.' },
      { id: 'animator_en', name: 'ინგლისურენოვანი ანიმატორი', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#animator_en', description: 'პროფესიონალი ანიმატორი ინგლისურენოვანი ბავშვებისთვის.' },
      { id: 'fireworks_room', name: 'ოთახის ფოიერვერკი (2 ცალი)', price: '30₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/k3SnFvBIk9U5QWL2JQxZJuMhOb4.png', link: '#fireworks_room', description: 'სადღესასწაულო ფოიერვერკი ოთახისთვის.' },
      { id: 'scientist', name: 'პროგრამა „შეშლილი მეცნიერი“', price: '150₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/lqnKvniN1HZmCDfHrnrTfSvsQBw.png', link: '#scientist', description: 'ექსპერიმენტები, აფეთქებები და მეცნიერული საოცრებები.' },
      { id: 'design', name: 'დიზაინი (დარბაზის გაფორმება)', price: '150₾-დან', category: 'სერვისები', image: 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png', link: '#design', description: 'დარბაზის თემატური გაფორმება.' },
      { id: 'barman', name: 'კოქტეილების წვეულება (ბარმენ შოუ)', price: '300₾', category: 'სერვისები', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#barman', description: 'სანახაობრივი შოუ და კოქტეილები.' },
      { id: 'pinata', name: 'პინიატა', price: '120₾-დან 170₾-მდე', category: 'სერვისები', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#pinata', description: 'მხიარული პინიატა ტკბილეულით.' }
    ],
    pricing: [
      { title: "11:00 & 13:30 სესია", price: "700₾", features: ["2 საათიანი პროგრამა", "მენიუ 20 ბავშვზე (ხაჭაპური, ლობიანი, პიცა, ფრი, კოკა-კოლა)", "საჩუქარი იუბილარს", "ცეკვა XBOX, ლაზერ შოუ, სკანერები", "ტორტის ცერემონიალი", "ლოსთის წამყვანები", "შემდეგი ბავშვი: 30₾"] },
      { title: "16:00 სესია", price: "750₾", recommended: true, features: ["2 საათიანი პროგრამა", "მენიუ 20 ბავშვზე (ხაჭაპური, ლობიანი, პიცა, ფრი, კოკა-კოლა)", "საჩუქარი იუბილარს", "ცეკვა XBOX, ლაზერ შოუ, სკანერები", "ტორტის ცერემონიალი", "ლოსთის წამყვანები", "შემდეგი ბავშვი: 30₾"] },
      { title: "18:30 სესია", price: "800₾", features: ["2 საათიანი პროგრამა", "მენიუ 20 ბავშვზე (ხაჭაპური, ლობიანი, პიცა, ფრი, კოკა-კოლა)", "საჩუქარი იუბილარს", "ცეკვა XBOX, ლაზერ შოუ, სკანერები", "ტორტის ცერემონიალი", "ლოსთის წამყვანები", "შემდეგი ბავშვი: 30₾"] },
      { title: "21:00 სესია", price: "1000₾", features: ["2 საათიანი პროგრამა", "მენიუ 20 ბავშვზე (ხაჭაპური, ლობიანი, პიცა, ფრი, კოკა-კოლა)", "საჩუქარი იუბილარს", "ცეკვა XBOX, ლაზერ შოუ, სკანერები", "ტორტის ცერემონიალი", "ლოსთის წამყვანები", "შემდეგი ბავშვი: 30₾"] }
    ],
    rules: [
      "1. ჯავშნის გასაფორმებლად აუცილებელია წინასწარი ავანსის ჩარიცხვა. ჯავშნის გაფორმების შემდეგ არ იცვლება თარიღი და გაუქმების შემთხვევაში არ ბრუნდება თანხა.",
      "2. ბავშვების საბოლოო რაოდენობისა და მშობლების მენიუს დაზუსტება ხდება ღონისძიების წინა დღის 19:00 საათამდე.",
      "3. ღონისძიების დღეს მოყვანილი დამატებითი ბავშვის შემთხვევაში, ვიხდით ბავშვის მენიუს საფასურს. (კვების გარეშე)",
      "4. ღონისძიება გრძელდება ზუსტად 2 საათი. დაგვიანების შემთხვევაში, დრო არ გადაცილდება 2 საათს.",
      "5. ობიექტზე დასაშვებია მხოლოდ ტორტის და ნამცხვრის შემოტანა.",
      "6. დაუშვებელია ობიექტზე ალკოჰოლური და უალკოჰოლო სასმელების შემოტანა. წინააღმდეგ შემთხვევაში, მშობელი ვალდებულია გადაიხადოს მშობლების მენიუს ღირებულების 20%.",
      "7. აკრძალულია ნებისმიერი ასაფეთქებლის გამოყენება დაბადების დღის ცენტრიდან 200 მეტრის რადიუსში.",
      "8. პროგრამა გათვლილია ბავშვებისთვის 6 წლის ასაკიდან. 6 წლამდე ბავშვის შემთხვევაში, აუცილებელია მშობელი იყოს ბავშვთან ღონისძიების მსვლელობის განმავლობაში.",
      "9. ფოტოგრაფის/ოპერატორის მიერ გამოგზავნილ ლინკს აქვს განსაზღვრული ვადა. წინააღმდეგ შემთხვევაში იხდით ფოტო/ვიდეოს თავიდან ატვირთვის საფასურს, 20 ლარს.",
      "10. სათამაშო ზონაში ფოტო/ვიდეოს გადაღება დასაშვებია მხოლოდ ლოსთის ფოტოგრაფის/ოპერატორის მიერ."
    ],
    faq: [
      { question: "რა ასაკიდან არის დასაშვები სტუმრობა?", answer: "პროგრამა გათვლილია ბავშვებისთვის 6 წლის ასაკიდან." },
      { question: "რამდენ ხანს გრძელდება პროგრამა?", answer: "ღონისძიება გრძელდება ზუსტად 2 საათი." },
      { question: "შესაძლებელია საკუთარი საკვების მოტანა?", answer: "ობიექტზე დასაშვებია მხოლოდ ტორტის და ნამცხვრის შემოტანა." },
      { question: "როგორ ხდება ჯავშნის დადასტურება?", answer: "ჯავშნისთვის აუცილებელია წინასწარი ავანსის ჩარიცხვა." }
    ],
    menu: {
      soft: { title: "გამაგრილებელი სასმელები", items: [{ name: "კოკა-კოლა (0.5)", price: "3₾" }, { name: "ფანტა (0.5)", price: "3₾" }, { name: "სპრაიტი (0.5)", price: "3₾" }, { name: "კაპი (0.5)", price: "4₾" }, { name: "ცივი ჩაი (0.5)", price: "4₾" }, { name: "წყალი მთის (0.5)", price: "2₾" }] },
      alcohol: { title: "ალკოჰოლური სასმელები", items: [{ name: "წითელი საფერავი (ქოხის ქვევრი)", price: "50₾" }, { name: "ქისი თეთრი/მშრალი (ფ. მჭედლიძის მარანი)", price: "50₾" }, { name: "ჭაჭა (ფ. მჭედლიძის მარანი)", price: "50₾" }, { name: "სარაჯიშვილი 5*", price: "70₾" }, { name: "ლიქიორი ბეილისი", price: "100₾" }, { name: "ბაგრატიონი", price: "30₾" }, { name: "მარტინი (ბიანკო)", price: "60₾" }] },
      dough: { title: "ცომეული", items: [{ name: "პიცა მარგარიტა (8 ნაჭრიანი)", price: "24₾" }, { name: "პიცა პეპერონი (8 ნაჭრიანი)", price: "28₾" }, { name: "ოთხი ყველის პიცა (8 ნაჭრიანი)", price: "28₾" }, { name: "პიცა ვეგანი (8 ნაჭრიანი)", price: "21₾" }, { name: "ხაჭაპური იმერული (8 ნაჭრიანი)", price: "26₾" }, { name: "ხაჭაპური მეგრული (8 ნაჭრიანი)", price: "28₾" }, { name: "საფირმო ხაჭაპური (8 ნაჭრიანი)", price: "35₾" }, { name: "ლობიანი (8 ნაჭრიანი)", price: "17₾" }, { name: "ბლინი ხორცით (5 ცალი)", price: "18₾" }, { name: "ბლინი ყველით (5 ცალი)", price: "16₾" }, { name: "ბლინი სოკოთი (5 ცალი)", price: "15₾" }] },
      hot: { title: "ყავა / ჩაი", items: [{ name: "ამერიკანო", price: "6₾" }, { name: "ესპრესო", price: "6₾" }, { name: "თურქული ყავა", price: "6₾" }, { name: "ჩაი", price: "4₾" }] },
      meat_salad: { title: "სალათები / ხორცეული", items: [{ name: "კიტრი-პომიდვრის სალათი ნიგვზით", price: "17₾" }, { name: "მწვადი ღორის (5 ნაჭერი)", price: "24₾" }, { name: "მწვადი ქათმის (5 ნაჭერი)", price: "20₾" }, { name: "ქათმის ნაგეთსები (5 ნაჭერი)", price: "20₾" }] },
      garnir_dessert: { title: "გარნირი / დესერტი", items: [{ name: "კარტოფილი ფრი", price: "12₾" }, { name: "ფრი სოუსით", price: "15₾" }, { name: "მექსიკური სოუსით", price: "20₾" }, { name: "ხილის ასორტი (სეზონური)", price: "26₾" }] }
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
      { id: 'marao', name: 'The Fan', category: 'Rooms', image: 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png', link: '#marao', description: 'The Fan is one of the most sophisticated technical obstacles in Lost-Lock. Players must maintain balance.' },
      { id: 'train', name: 'The Train', category: 'Rooms', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#train', description: 'The Train room takes you into a real adventure atmosphere. Solve puzzles inside the wagons.' },
      { id: 'numbers', name: 'Numbers', category: 'Rooms', image: 'https://framerusercontent.com/images/uMFgcLNLDKCjhlXiiwGov4.png', link: '#numbers', description: 'Room for logical thinking and mathematical precision. Find the combination to break the digital barrier.' },
      { id: 'sawdust', name: 'Sawdust', category: 'Rooms', image: 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png', link: '#sawdust', description: 'Perfect mix of physical activity and fun. Don\'t fear the mess, speed is key here.' },
      { id: 'prison', name: 'Prison', category: 'Rooms', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#prison', description: 'Become a prison break hero. Find secret exits and escape captivity with teamwork.' },
      { id: 'balls', name: 'Ball Pit', category: 'Rooms', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#balls', description: 'Fun and colorful room where you must find keys hidden in a sea of balls.' },
      { id: 'pipe', name: 'The Pipe', category: 'Rooms', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#pipe', description: 'Narrow passages and difficult routes. This room tests your flexibility and endurance.' },
      { id: 'golf', name: 'Golf', category: 'Rooms', image: 'https://framerusercontent.com/images/k3SnFvBIk9U5QWL2JQxZJuMhOb4.png', link: '#golf', description: 'Precision and calm - that\'s what you\'ll need. Sink the ball to open the door.' }
    ],
    services: [
      { id: 'photo', name: 'Photographer', price: '80₾', category: 'Services', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#photo', description: 'Professional photo session for every moment of your celebration.' },
      { id: 'video', name: 'Video Production', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/U3jr0GoG94uk4hJKsWOBqVs6WA8.webp', link: '#video', description: 'Professional video shooting and editing for your full event.' },
      { id: 'xbox_laser', name: 'XBOX, Laser Show, Scanners', price: '80₾', category: 'Services', image: 'https://framerusercontent.com/images/hiHkPliV1IV1VKmr7Ig9zfCgs.png', link: '#xbox_laser', description: 'Cake ceremony special effects.' },
      { id: 'animator_ru', name: 'Russian Animator', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png', link: '#animator_ru', description: 'Professional animator for Russian-speaking kids.' },
      { id: 'animator_en', name: 'English Animator', price: '150₾', category: 'Services', image: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png', link: '#animator_en', description: 'Professional animator for English-speaking kids.' },
      { id: 'barman', name: 'Barman Show', price: '300₾', category: 'Services', image: 'https://framerusercontent.com/images/2uIu8Q8FZT92tV7oyJbNaeXYKw.png', link: '#barman', description: 'Cocktail party and spectacular barman show.' }
    ],
    pricing: [
      { title: "11:00 & 13:30 Session", price: "700₾", features: ["2-hour program", "Menu for 20 kids (Pizza, Khachapuri, Fries...)", "Birthday gift", "XBOX, Laser show, Scanners", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "16:00 Session", price: "750₾", recommended: true, features: ["2-hour program", "Menu for 20 kids (Pizza, Khachapuri, Fries...)", "Birthday gift", "XBOX, Laser show, Scanners", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "18:30 Session", price: "800₾", features: ["2-hour program", "Menu for 20 kids (Pizza, Khachapuri, Fries...)", "Birthday gift", "XBOX, Laser show, Scanners", "Cake ceremony", "Lost hosts", "Next child: 30₾"] },
      { title: "21:00 Session", price: "1000₾", features: ["2-hour program", "Menu for 20 kids (Pizza, Khachapuri, Fries...)", "Birthday gift", "XBOX, Laser show, Scanners", "Cake ceremony", "Lost hosts", "Next child: 30₾"] }
    ],
    rules: [
      "1. A deposit is required to confirm the booking. Once booked, date cannot be changed and deposit is non-refundable.",
      "2. Final child count and parents' menu must be confirmed by 19:00 the day before.",
      "3. For extra children brought on the day, menu cost (without food) applies.",
      "4. The event lasts exactly 2 hours. In case of delay, time will not be extended.",
      "5. Only cakes and pastries are allowed to be brought in.",
      "6. Bringing outside drinks is prohibited. Violations incur a 20% surcharge on parents' menu.",
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
      soft: { title: "Soft Drinks", items: [{ name: "Coca-Cola (0.5)", price: "3₾" }, { name: "Fanta (0.5)", price: "3₾" }, { name: "Sprite (0.5)", price: "3₾" }, { name: "Cappy (0.5)", price: "4₾" }, { name: "Ice Tea (0.5)", price: "4₾" }, { name: "Water (0.5)", price: "2₾" }] },
      alcohol: { title: "Alcoholic Drinks", items: [{ name: "Red Saperavi", price: "50₾" }, { name: "Kisi White/Dry", price: "50₾" }, { name: "Chacha", price: "50₾" }, { name: "Sarajishvili 5*", price: "70₾" }, { name: "Baileys", price: "100₾" }, { name: "Bagrationi", price: "30₾" }, { name: "Martini Bianco", price: "60₾" }] },
      dough: { title: "Pastries", items: [{ name: "Pizza Margarita", price: "24₾" }, { name: "Pizza Pepperoni", price: "28₾" }, { name: "4 Cheese Pizza", price: "28₾" }, { name: "Vegan Pizza", price: "21₾" }, { name: "Khachapuri Imeruli", price: "26₾" }, { name: "Khachapuri Megruli", price: "28₾" }, { name: "Signature Khachapuri", price: "35₾" }, { name: "Lobiani", price: "17₾" }, { name: "Meat Blini (5pcs)", price: "18₾" }, { name: "Cheese Blini (5pcs)", price: "16₾" }, { name: "Mushroom Blini (5pcs)", price: "15₾" }] },
      hot: { title: "Coffee / Tea", items: [{ name: "Americano", price: "6₾" }, { name: "Espresso", price: "6₾" }, { name: "Turkish Coffee", price: "6₾" }, { name: "Tea", price: "4₾" }] },
      meat_salad: { title: "Salads / Grill", items: [{ name: "Cucumber-Tomato Salad", price: "17₾" }, { name: "Pork Grill (5pcs)", price: "24₾" }, { name: "Chicken Grill (5pcs)", price: "20₾" }, { name: "Chicken Nuggets (5pcs)", price: "20₾" }] },
      garnir_dessert: { title: "Sides / Desserts", items: [{ name: "French Fries", price: "12₾" }, { name: "Fries w/ Sauce", price: "15₾" }, { name: "Mexican w/ Sauce", price: "20₾" }, { name: "Fruit Assortment", price: "26₾" }] }
    }
  }
};