import { Reel } from '@/types';

// ============================================================================
// LOST LOCK — REELS REFERENCE
// ============================================================================
// NOTE: Reels are now managed from the admin panel and stored in Supabase
// (`lostlock_reels`, admin-gated RPCs). The live list is loaded by
// `src/store/contentStore.ts` (public SELECT + realtime).
//
// `REELS` below is kept as a documentation/seed reference matching the initial
// database seed. It is NOT used to render the site anymore.
//
// Like counts: `likes` is the seeded baseline count. Visitor likes are stored
// per-device (see src/lib/reelLikes.ts). When a backend is added, switch the
// displayed count to a live server total.
//
// Deep link format: https://your-domain/#/reels/<reel_id>
// ============================================================================

export const REELS: Reel[] = [
  {
    id: 'about',
    video: 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
    thumbnail:
      'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2670&auto=format&fit=crop',
    title: 'LOST LOCK',
    description: 'პროგრამის მთავარი მომენტები — 2 საათი თავგადასავლით, თამაშით და გართობით.',
    likes: 32,
    link: '#contact',
  },
  {
    id: 'marao',
    video: 'https://framerusercontent.com/assets/nM4DyIHwgOozU0nZZReJ4GVU.mp4',
    thumbnail: 'https://framerusercontent.com/images/K2dowoaqgVolSPYbUKOWyy1UoSU.png',
    title: 'მარაო',
    description: 'წონასწორობა და სისწრაფე — ერთი შეხედვით მარტივი, სინამდვილეში არა.',
    likes: 28,
    link: '#marao',
  },
  {
    id: 'train',
    video: '/videos/reel-3.mp4',
    thumbnail: 'https://framerusercontent.com/images/mnQSusjkG57QxShJ3V7dADvJEDg.png',
    title: 'მატარებელი',
    description: 'გადაგიყვანთ ნამდვილ სათავგადასავლო ატმოსფეროში.',
    likes: 21,
    link: '#train',
  },
  {
    id: 'ball-pit',
    video: '/videos/reel-4.mp4',
    thumbnail: 'https://framerusercontent.com/images/OZBSyU26cOuTNmRGtAlPSXm0Tlc.png',
    title: 'ბურთების ოთახი',
    description: 'ბურთების ზღვაში გასაღებები იმალება — იპოვე სანამ დრო ამოგივა.',
    likes: 18,
    link: '#balls',
  },
  {
    id: 'sawdust',
    video: '/videos/reel-5.mp4',
    thumbnail: 'https://framerusercontent.com/images/U0teqXy7OH15n2opOH6yRxEZs0.png',
    title: 'ნახერხი',
    description: 'ფიზიკური აქტივობის და გართობის იდეალური ნაზავი.',
    likes: 24,
    link: '#sawdust',
  },
];

// Section heading (shown above the Reel previews)
export const REELS_SECTION_TITLE = 'ვიდეოები';
export const REELS_SECTION_SUBTITLE = 'ნახე ჩვენი გამოცდილება';

// UI copy shown inside the Reel viewer
export const REELS_SHARE_LABEL = 'გაზიარება';
export const REELS_COPIED_LABEL = 'დაკოპირდა';