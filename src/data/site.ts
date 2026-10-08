// Facts and links used across the page (name, email, URLs). The visible prose lives in STORY below.

export const PERSON = {
  name: 'Nguyen Thanh Hai',
  role: 'Founder, Disa Games',
  city: 'Ho Chi Minh City',
  email: 'hai@haingt.dev',
  url: 'https://haingt.dev',
};

export const STUDIO = {
  name: 'Disa Games',
  url: 'https://disagames.com',
};

export const SOCIAL = {
  github: 'https://github.com/haingt-dev',
  linkedin: 'https://linkedin.com/in/haingt-dev',
};

/**
 * DRAFT scaffold. Every visible sentence on the page lives here so Hải can rewrite it in his
 * own words without touching markup. Nothing else on the page contains prose, except small UI
 * labels (`ui`). `showDadLine` is off until he decides.
 */
export const STORY = {
  hero: {
    hi: "Hi, I'm Hải.",
    line: 'I took the long way round to making games.',
  },
  figLabel: 'Fig. 1',
  caption: 'How a backend engineer in Ho Chi Minh City ends up making a game about insects.',
  chapters: [
    {
      title: 'A plan in a spreadsheet',
      body: "In 2016, my first year of college, I applied late to Bookie, a Vietnamese reading community, with a plan in an Excel file. They took me anyway, and I'm still one of its co-founders.",
    },
    {
      title: 'Seven years of backend',
      body: 'Then came about seven years of backend work: the part of an app nobody sees until it breaks. I left it believing one thing: understanding the problem matters more than writing the code.',
    },
    {
      title: 'A few games, set aside',
      body: "I tried several game ideas and built a few of them before this one, then set each one down. Every one left me plenty of lessons; the biggest: one person who isn't an artist can't draw everything alone.",
    },
    {
      title: 'Disa Games, now',
      body: "Now I make games full-time at Disa Games, my indie studio. I'm building Clockwork Brood in Godot: an insect kingdom builds a giant machine in its own image, and you're the engineer who puts it together and decides how it fights.",
      link: { text: 'Clockwork Brood', href: 'https://disagames.com/clockwork-brood/' },
    },
  ] as { title: string; body: string; link?: { text: string; href: string } }[],
  showDadLine: false,
  dadLine: 'Also new in 2026: I became a dad. Sleep tips welcome.',
  ui: {
    pause: 'Pause motion',
    play: 'Play motion',
    copy: 'Copy',
    copyLabel: 'Copy email address',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    skip: 'Skip to content',
  },
};
