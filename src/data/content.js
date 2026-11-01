export const content = {
  name: 'Aditi',

  // Shown before the envelope. Answers are matched loosely: case, punctuation and
  // small typos don't matter. Set enabled: false to skip the gate.
  secret: {
    enabled: false,
    question: 'Where did we go on our first date?',
    answers: ['cafe', 'coffee shop'],
    hint: 'Think coffee ☕',
  },
  // The countdown ticks down to this exact moment (local time).
  countdownTo: '2026-11-01T23:59:00',
  togetherSince: '2021-05-05T00:00:00',

  heroLine:
    'Ab humko dhere dhere niche jana hai or baki ke gifts dekhne hai',

  timeline: [
    {
      image: 2,
      date: 'June 2021',
      caption:
        'at this time this girl refuse to sit on my scooty and force me to walk over over the govind puri market in rain such an insecure baku',
    },
    {
      image: 3,
      date: 'Aug 2021',
      caption:
        'here we are close enough to go out but duniya se chup kr ashique krne ka ekdha abhi tak tha',
    },
    {
      image: 8,
      date: 'Dec 2021',
      caption:
        'our first date after 2 days fight and i brought flower to this girl, taki ek fool ko fool de saku',
      wide: true,
    },
    {
      image: 9,
      date: 'Jan 2022',
      caption:
        'or yeh hai hum dono clelebate saurav birthday shayd iss din saurav ko vo charam sukh mila tha',
    },
    {
      image: 4,
      date: 'Feb 2022',
      caption:
        'or issi tarah harmara first valentine day aaya, dono berojgar the toh bs photo he le paye',
    },
    {
      image: 10,
      date: 'June 2022',
      caption: 'got selected in byjus which gonna chnage our life for real',
    },
    {
      images: [11, 12],
      date: 'Aug – Nov 2022',
      caption:
        'byjus ne chutiya kaat diya per still we are together kyuki meri life saver ne mujhe cording may daal diya tha',
    },
    {
      image: 13,
      date: 'Dec 2022',
      caption:
        'last together photo before moving to shivmonga per vo bhi kya din the. per yeh baate 3 saal purani hai, iske baad ka batata hu',
      wide: true,
    },
    {
      secret: true,
      taps: 7,
      date: 'Dec 2022 – Nov 2026',
      caption:
        'long distance relationship ne humare relation ko or bhi stronge bana diya ki ab humko lagta hai ki 3bhk may he hum rhe sakte hai',
    },
    // Stays hidden until the secret above is unlocked, then flips open.
    {
      image: 14,
      date: 'Nov 2026',
      caption: 'and we finally made - you and me against the world',
      reveal: true,
    },
  ],

  letter: `Happy Birthday mera baku
I know may best boyfriend toh nhi hu ja ki saath rhe pata hu kyuki blr may rhe rha hu per mujhe lagta hai hum jaldi saath honge toh fir bhut khush rhenge, i know yeh starting the time tha jo bs complete ho jaayega kuch time may bs usske baad saath he rhena hai. fir tera patila tere pass rhega`,

  // Each reason is either plain text or { text, images: [photo numbers], fit? }.
  // With images, the back of the card shows the photos with the text below.
  // fit: 'contain' shows a single photo uncropped (good for very wide photos).
  // focus: which part to keep when cropping, e.g. 'top' (default is a little above center).
  reasons: [
    {
      text: 'we both are hungry and need a food but still photo is required',
      images: [15, 16],
    },
    {
      text: 'bhagwan ne bhut koshish kri per hum dheet hai, ek dusre ke saath rhenge',
      images: [17],
    },
    {
      text: 'cr park hamara hamesha se first love bith rhega',
      images: [18],
      // Wide photo: show it whole over a blurred copy instead of cropping.
      fit: 'contain',
    },
    {
      text: 'start of adut dating and we are loving it.',
      images: [19],
    },
    {
      text: 'reason why i need aditi, light my mood jab bharat gaand marta hai',
      images: [20],
      fit: 'contain',
    },
    {
      text: 'itna time ke baad jab aditi milf ho gai hai toh may apne efforts kese km kr sakta hu',
      images: [21],
      focus: 'top',
    },
  ],

  riddles: {
    // The answer is the word written as letter positions: B=2 A=1 K=11 U=21.
    code: {
      question: 'What does Saurav say to Aditi?',
      note: 'Answer in numbers only',
      word: 'baku',
      answer: '211121',
      hint: 'baku',
      extraHint: 'Turn the letters into numbers: A = 1, B = 2, C = 3…',
    },
    text: {
      question: 'What motivates Aditi to do exercise?',
      answers: ["saurav's mom comments", 'saurav mom', 'mom comments', 'mom', 'mummy', 'mother', 'comments'],
      hint: "Someone in Saurav's family has opinions 👀",
      reveal: "Saurav's mom's comments 😂",
    },
    choice: {
      question: 'What is the best part of this relationship?',
      options: ['Saurav being Saurav', 'Aditi loves Saurav', 'Saurav sees his future wife in Aditi'],
      correct: 2,
      wrongReplies: ['Haha, true… but not the best part 😌', 'Also true! But think bigger ❤'],
      rightReply: 'Yes. Today, tomorrow and forever ❤',
    },
  },

  // Photo under the scratch card; once scratched, the card grows to show it whole.
  scratchImage: 22,

  finaleImage: 7,
  finaleMessage: 'I love you, today and every day after.',
}
