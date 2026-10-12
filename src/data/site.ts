// Every fact the site states lives here once, with where it came from.
// Sources are Pelvy's own published material, read on 12 October 2026.

export const site = {
  name: 'Pelvy',
  legalName: 'Pelvy Pty Ltd',
  url: 'https://pelvy.app',
  tagline: 'Pelvic health, between appointments.',
  promise: 'Squeeze or let go. Pelvy counts you through it.',
  description:
    'Pelvy is a pelvic floor app built by a pelvic health physiotherapist. It counts you through programs for strength and for relaxation, with your own clinician’s advice when you have one.',
  disclaimer:
    'Pelvy is education and support between appointments. It isn’t medical advice and it doesn’t replace your clinician.',
  email: 'amelia@pelvy.app', // pelvy.app/privacy-policy and /clinician-faqs
  phone: '+61 456 585 447', // pelvy.app footer
  phoneHref: 'tel:+61456585447',
  address: '135 Hearl Close, Brinsmead QLD', // pelvy.app footer
  founder: 'Amelia Godfrey',
  founderRole: 'pelvic health physiotherapist',
} as const;

export const links = {
  appStore: 'https://apps.apple.com/us/app/pelvy-patient/id6752825827', // pelvy.app home
  googlePlay: 'https://play.google.com/store/apps/details?id=app.pelvy.patient_app', // pelvy.app home
  demoVideo: 'https://youtu.be/qEsIuCbE9k8', // Amelia's walkthrough, 29 March 2026
  facebook: 'https://www.facebook.com/people/Pelvy-App/61562366453185/',
  instagram: 'https://www.instagram.com/pelvy.app/',
  youtube: 'https://www.youtube.com/@PelvyApp',
  linkedin: 'https://www.linkedin.com/in/amelia-godfrey-0a9406142/',
} as const;

export const prices = {
  // pelvy.app/clinician-faqs. Brand open question q13: Amelia to confirm still current.
  clinicMonthly: '$20',
  patientFreeMonths: 'six',
  // Amelia's demo video, 29 March 2026 (Pelvy Lite), and the app's plan screen.
  liteMonthly: '$4.99',
  liteYearly: '$19.99',
  // pelvy.app/general-user-faqs
  refundDays: 'seven',
} as const;

// Amelia's post of 17 July 2026: "used in 112 clinics across 6 countries and has supported more than 5,300 patients".
export const reach = {
  clinics: 112,
  countries: 6,
  patients: '5,300',
  asOf: 'July 2026',
  source: '/queensland-health-pilot-opportunity-could-pelvy-support-your-patients/',
} as const;

// Paths are the live site's own, kept verbatim so nothing indexed or linked breaks.
export const routes = {
  home: '/',
  clinicians: '/clinicians-and-specialists/',
  people: '/general-users/',
  features: '/features/',
  about: '/about/',
  directory: '/clinicians-directory/',
  clinicianFaqs: '/clinician-faqs/',
  peopleFaqs: '/general-user-faqs/',
  blog: '/blog/',
  contact: '/contact-us/',
  signUp: '/sign-up/',
  privacy: '/privacy-policy/',
} as const;

export const nav = [
  { href: routes.clinicians, label: 'For clinicians' },
  { href: routes.people, label: 'For you' },
  { href: routes.features, label: 'What it does' },
  { href: routes.directory, label: 'Find a clinic' },
  { href: routes.about, label: 'About Amelia' },
] as const;

// The three programs that ship in the app. Demo video frames, 29 March 2026.
export const programs = [
  {
    name: 'Pelvic floor with breath',
    position: 'Lying down',
    frequency: '2 times daily',
    chips: [
      { label: 'Contract', kind: 'work' },
      { label: 'Relax', kind: 'letgo' },
    ],
    summary: 'Squeeze on the out-breath, let go on the in-breath. It teaches the timing.',
  },
  {
    name: 'Belly breathing and downtraining',
    position: 'Supported sitting, butterfly or on your side, hands on your lower belly',
    frequency: '5 times daily',
    chips: [{ label: 'Relaxation', kind: 'letgo' }],
    summary: 'Widen your belly, ribs and waist, then let it all go. For a pelvic floor that needs to soften.',
  },
  {
    name: 'Pelvic floor strength',
    position: 'Lying down or sitting, progressing to standing',
    frequency: '3 times daily',
    chips: [{ label: 'Strength', kind: 'work' }],
    summary: 'Quick squeezes, then holds, then belly breathing to finish.',
  },
] as const;

// The parts of Pelvic floor strength, as the app shows them.
export const strengthParts = [
  { n: 1, name: 'Quick squeezes', values: [['Hold', '2s'], ['Rest', '3s'], ['Reps', '10']] },
  { n: 2, name: 'Holds', values: [['Hold', '5s'], ['Rest', '5s'], ['Reps', '10']] },
  { n: 3, name: 'Belly breathing', values: [['In', '3s'], ['Hold', '2s'], ['Out', '4s'], ['Reps', '10']] },
] as const;

// Three titles from the Videos tab. Demo video frames, 29 March 2026.
export const videos = [
  'Hip Rotation for Improving Hip Mobility',
  'Pelvic Tilt for Lumbar Mobility into Flexion/Extension - Supine',
  'Lumbar Mobility into Rotation - Supine & Bilateral',
] as const;

// The Learn tab, in the order the app gives it.
export const learn = [
  { tag: 'Everyone', title: 'When to seek extra support from a pelvic health physio' },
  { tag: 'Everyone', title: 'Step 1: Pelvic floor awareness' },
  { tag: 'Everyone', title: 'Step 2: Breathing coordination' },
  { tag: 'Pain and relaxation goals', title: 'Pelvic pain and relaxation' },
  { tag: 'Strength goals', title: 'Strength and endurance' },
] as const;
