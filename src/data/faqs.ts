// Answers are Pelvy's own published answers, rewritten in the brand voice.
// Sources: pelvy.app/clinician-faqs and /general-user-faqs (read 12 October 2026),
// the privacy policy (6 October 2025) and Amelia's demo video (29 March 2026).
// Where the live FAQ is out of date against the app, the app wins and the note says so.

export interface Faq { q: string; a: string[] }

export const clinicianFaqs: Faq[] = [
  {
    q: 'Which clinicians is Pelvy for?',
    a: [
      'Pelvic health physiotherapists first: you set a specific pelvic floor program and your patient gets reminders to do it.',
      'GPs, specialists and midwives use it too. Amelia worked with all three when she designed it.',
    ],
  },
  {
    q: 'I’m a pelvic health clinician but not a physiotherapist. Can I subscribe?',
    a: [
      'Yes. Use the advice section for what you’d usually write, print or email to patients.',
      'Pelvy’s videos are there to include as well, which helps when a patient can’t get to a pelvic health physio.',
    ],
  },
  {
    q: 'Does Pelvy work with my clinical software?',
    a: ['Not yet. Tell us what you use. In a demo Amelia can show you how clinics run the two side by side.'],
  },
  {
    q: 'What does it cost?',
    a: ['$20 a month during the pilot. Join now and that stays your price. Clinics that join later are likely to pay more.'],
  },
  {
    q: 'How long do my patients get Pelvy free?',
    a: [
      'Six months, under your $20 a month subscription. We’re trialling that length, and would look at a longer free period if clinics want to pay more for it.',
      'If you run a funded program, a larger organisation or a public health service, contact Amelia. She wants to talk about how Pelvy could be used there.',
    ],
  },
  {
    q: 'How do I subscribe?',
    a: ['Sign up and Amelia will email you. She sets up every clinic herself at the moment, so check your junk folder for amelia@pelvy.app.'],
  },
  {
    q: 'How do I pay?',
    a: ['By PayPal or direct debit. Some payment options may not be available during the pilot.'],
  },
  {
    q: 'What happens when my patient is discharged, or their six months end?',
    a: [
      'They can keep using Pelvy on their own subscription. Amelia is still settling that price.',
      'If they’d rather stop, ask them to take screenshots of your programs and advice first, because we don’t keep information after an account is closed. After the pilot we want to give them a PDF instead.',
    ],
  },
  {
    q: 'What happens to my patients’ information if they stop using Pelvy?',
    a: ['We don’t keep it. During the pilot they can screenshot anything they want to keep. A PDF of your education and exercises is planned for after the pilot.'],
  },
  {
    q: 'Can I see it before I decide?',
    a: ['Yes. Sign up and we’ll email you a recorded demo. If you’d like a live one, say so when you sign up, or contact Amelia.'],
  },
  {
    q: 'Where is Pelvy based, and can I subscribe from another country?',
    a: ['Pelvy is based in Australia and stores information in Australia. You can subscribe from anywhere, but check your local rules first. Signing up takes no payment details.'],
  },
];

export const peopleFaqs: Faq[] = [
  {
    q: 'I don’t have a clinician. Can I still use Pelvy?',
    a: [
      'Yes. Download Pelvy Patient and answer no when it asks whether your clinic subscribes for you. It’s $4.99 a month or $19.99 a year, and it starts you on a physio-built program.',
    ],
  },
  {
    q: 'How do I know which pelvic floor exercises I should do?',
    a: [
      'Start with the Learn tab. Its five articles help you work out whether you need to strengthen or to relax.',
      'If you’re still unsure, book in with a pelvic health physiotherapist. Many offer telehealth. Pelvy isn’t TGA certified to prescribe specific exercises for you, and it doesn’t give individual medical advice.',
    ],
  },
  {
    q: 'Why would I want to strengthen my pelvic floor?',
    a: [
      'A pelvic floor can weaken over time. Heavy loads do it when the muscles aren’t working with them: frequent heavy lifting, high-impact exercise, straining on the toilet, repeated coughing. So do pregnancy, a vaginal birth and ageing.',
      'A strength program can help even before there are symptoms. If nothing changes, or anything hurts or gets worse, see a pelvic health physiotherapist. You may be doing a different exercise from the one you need.',
    ],
  },
  {
    q: 'Why would I want to relax my pelvic floor?',
    a: [
      'Some pelvic floors are too tight, not too weak, and struggle to let go. If you have pelvic pain, relaxation belongs in your toolbox. Sometimes leaking comes from muscles that are too tight as well.',
      'Pelvy has belly breathing and downtraining for this, and the stretches and mobility exercises that pelvic health physios most often set.',
    ],
  },
  {
    q: 'What do people use Pelvy for?',
    a: [
      'Strength, coordination, relaxation and downtraining programs for the pelvic floor.',
      'People bring them to pregnancy and the months after a birth; a leaking bladder, urgency, waking at night to wee, or bladder pain; bowel symptoms that involve the pelvic floor; painful periods, perimenopause and menopause; erection problems; pelvic pain with muscle tension; and heavy lifting or high-impact sport.',
    ],
  },
  {
    q: 'Can I track my symptoms?',
    a: ['Not yet. Symptom tracking isn’t in the app. It comes after the pilot, along with bladder, bowel and pad weight diaries.'],
  },
  {
    q: 'What happens to my information if I stop?',
    a: [
      'When you close your account we delete your information. We don’t keep it and we don’t sell it. Once it’s deleted, it’s deleted.',
      'Save anything you want first. For now that means screenshots. A PDF you can print or keep is planned for after the pilot.',
    ],
  },
  {
    q: 'How is my information kept private?',
    a: [
      'It’s stored in Google Cloud in Sydney, encrypted on the way there and while it’s stored.',
      'Only you and your clinician, if you have one, can see your profile. We never sell or share it with advertisers, and Pelvy has no ads.',
      'Pelvy follows the Australian Privacy Principles under the Privacy Act 1988.',
    ],
  },
  {
    q: 'Can I get a refund?',
    a: ['Pelvy’s published policy is a full refund if you cancel within seven days. Subscriptions taken out in the App Store or Google Play are billed by the store, so ask Amelia if you’re not sure how yours works.'],
  },
  {
    q: 'Who owns Pelvy?',
    a: ['Amelia Godfrey is Pelvy’s founder and director. She’s a physiotherapist who works only in pelvic health, with people of every sex, and she’s completing a Masters in Psychosexual Therapy at the University of Sydney.'],
  },
  {
    q: 'Where is Pelvy based, and can I use it outside Australia?',
    a: ['Pelvy is based in Australia. The app is in the App Store and on Google Play. If it isn’t available where you are, contact Amelia.'],
  },
];
