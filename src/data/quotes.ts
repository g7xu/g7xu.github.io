export interface Quote {
  /** The quote text itself. */
  text: string;
  /** Attribution — shown muted, revealed on hover. Omit for anonymous. */
  author?: string;
  /** 1–5: drives font size & placement priority (default 3). 5 renders in accent; ≤2 muted. */
  weight?: number;
  /** Optional source (book, talk, etc.) — reserved for future use. */
  source?: string;
}

// Curated quote cloud. Add as many as you like — the layout auto-shrinks to fit them all.
export const quotes: Quote[] = [
  {
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    weight: 5,
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    weight: 3,
  },
  {
    text: 'What I cannot create, I do not understand.',
    author: 'Richard Feynman',
    weight: 4,
  },
  {
    text: 'Premature optimization is the root of all evil.',
    author: 'Donald Knuth',
    weight: 3,
  },
  {
    text: 'Stay hungry, stay foolish.',
    author: 'Whole Earth Catalog',
    weight: 4,
  },
  {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    weight: 2,
  },
  {
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    weight: 3,
  },
  {
    text: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
    weight: 2,
  },
  { text: 'We are what we repeatedly do.', author: 'Will Durant', weight: 3 },
  {
    text: 'Perfection is achieved when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupéry',
    weight: 4,
  },
  {
    text: 'Programs must be written for people to read.',
    author: 'Harold Abelson',
    weight: 2,
  },
  {
    text: 'The future is already here — it is just not evenly distributed.',
    author: 'William Gibson',
    weight: 3,
  },
  {
    text: 'Fall seven times, stand up eight.',
    author: 'Japanese proverb',
    weight: 2,
  },
  {
    text: 'Everything should be as simple as possible, but no simpler.',
    author: 'Albert Einstein',
    weight: 3,
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    weight: 2,
  },
  {
    text: 'A language that does not affect the way you think is not worth knowing.',
    author: 'Alan Perlis',
    weight: 3,
  },
  {
    text: 'Knowing is not enough; we must apply.',
    author: 'Bruce Lee',
    weight: 2,
  },
  { text: 'Less, but better.', author: 'Dieter Rams', weight: 5 },
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    weight: 3,
  },
  {
    text: 'Code is read more often than it is written.',
    author: 'Guido van Rossum',
    weight: 2,
  },
  {
    text: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela',
    weight: 3,
  },
  {
    text: 'The map is not the territory.',
    author: 'Alfred Korzybski',
    weight: 4,
  },
  { text: 'Hard things are hard.', author: 'Anonymous', weight: 2 },
  {
    text: 'Slow is smooth, and smooth is fast.',
    author: 'Navy SEALs',
    weight: 3,
  },
  {
    text: 'You cannot improve what you do not measure.',
    author: 'Peter Drucker',
    weight: 2,
  },
  { text: 'The obstacle is the way.', author: 'Marcus Aurelius', weight: 4 },
  {
    text: 'Whereof one cannot speak, thereof one must be silent.',
    author: 'Ludwig Wittgenstein',
    weight: 3,
  },
  { text: 'Do or do not. There is no try.', author: 'Yoda', weight: 4 },
  { text: 'The medium is the message.', author: 'Marshall McLuhan', weight: 4 },
  { text: 'Move fast and break things.', author: 'Mark Zuckerberg', weight: 2 },
  {
    text: 'Good artists copy; great artists steal.',
    author: 'Pablo Picasso',
    weight: 3,
  },
  {
    text: 'The whole is greater than the sum of its parts.',
    author: 'Aristotle',
    weight: 3,
  },
  { text: 'I think, therefore I am.', author: 'René Descartes', weight: 5 },
  {
    text: 'That which does not kill us makes us stronger.',
    author: 'Friedrich Nietzsche',
    weight: 3,
  },
  {
    text: 'Be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
    weight: 3,
  },
  {
    text: 'The best time to plant a tree was twenty years ago.',
    author: 'Chinese proverb',
    weight: 2,
  },
  {
    text: 'Done is better than perfect.',
    author: 'Sheryl Sandberg',
    weight: 3,
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    weight: 2,
  },
  {
    text: 'Quality is not an act, it is a habit.',
    author: 'Aristotle',
    weight: 3,
  },
  {
    text: 'The journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    weight: 3,
  },
  { text: 'Strong opinions, weakly held.', author: 'Paul Saffo', weight: 2 },
  { text: 'Measure twice, cut once.', author: 'Proverb', weight: 2 },
  {
    text: 'If you want to go fast, go alone. If you want to go far, go together.',
    author: 'African proverb',
    weight: 4,
  },
  {
    text: 'Everything is hard before it is easy.',
    author: 'Johann Wolfgang von Goethe',
    weight: 2,
  },
  {
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    weight: 3,
  },
  {
    text: 'Action is the foundational key to all success.',
    author: 'Pablo Picasso',
    weight: 2,
  },
  {
    text: 'A ship in harbor is safe, but that is not what ships are built for.',
    author: 'John A. Shedd',
    weight: 3,
  },
  {
    text: 'The cure for boredom is curiosity.',
    author: 'Dorothy Parker',
    weight: 3,
  },
  {
    text: 'Genius is one percent inspiration and ninety-nine percent perspiration.',
    author: 'Thomas Edison',
    weight: 2,
  },
  {
    text: 'Imagination is more important than knowledge.',
    author: 'Albert Einstein',
    weight: 4,
  },
  {
    text: 'Well done is better than well said.',
    author: 'Benjamin Franklin',
    weight: 2,
  },
  { text: 'The unexpected always happens.', author: 'Proverb', weight: 2 },
  { text: 'Form follows function.', author: 'Louis Sullivan', weight: 4 },
  { text: 'God is in the details.', author: 'Mies van der Rohe', weight: 3 },
  { text: 'Less is more.', author: 'Mies van der Rohe', weight: 5 },
  {
    text: 'Make the easy things easy and the hard things possible.',
    author: 'Larry Wall',
    weight: 3,
  },
  {
    text: 'There are only two hard things in computer science: cache invalidation and naming things.',
    author: 'Phil Karlton',
    weight: 3,
  },
  {
    text: 'Any sufficiently advanced technology is indistinguishable from magic.',
    author: 'Arthur C. Clarke',
    weight: 4,
  },
  {
    text: 'Weeks of coding can save you hours of planning.',
    author: 'Anonymous',
    weight: 2,
  },
  {
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
    weight: 2,
  },
  { text: 'Deleted code is debugged code.', author: 'Jeff Sickel', weight: 2 },
  {
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger Dijkstra',
    weight: 3,
  },
  {
    text: 'Premature abstraction is as dangerous as premature optimization.',
    author: 'Anonymous',
    weight: 2,
  },
  {
    text: 'Walking on water and developing software from a specification are easy if both are frozen.',
    author: 'Edward V. Berard',
    weight: 3,
  },
  {
    text: 'Controlling complexity is the essence of computer programming.',
    author: 'Brian Kernighan',
    weight: 3,
  },
  {
    text: 'The function of good software is to make the complex appear simple.',
    author: 'Grady Booch',
    weight: 3,
  },
  {
    text: 'Truth can only be found in one place: the code.',
    author: 'Robert C. Martin',
    weight: 2,
  },
  {
    text: 'Programming is the art of telling another human what one wants the computer to do.',
    author: 'Donald Knuth',
    weight: 3,
  },
  {
    text: 'Nine people cannot make a baby in a month.',
    author: 'Fred Brooks',
    weight: 3,
  },
  {
    text: 'Adding manpower to a late software project makes it later.',
    author: 'Fred Brooks',
    weight: 2,
  },
  {
    text: 'Make each program do one thing well.',
    author: 'Doug McIlroy',
    weight: 3,
  },
  {
    text: 'When in doubt, use brute force.',
    author: 'Ken Thompson',
    weight: 3,
  },
  {
    text: 'Beautiful is better than ugly.',
    author: 'The Zen of Python',
    weight: 4,
  },
  {
    text: 'Explicit is better than implicit.',
    author: 'The Zen of Python',
    weight: 3,
  },
  { text: 'Now is better than never.', author: 'The Zen of Python', weight: 2 },
  { text: 'Real artists ship.', author: 'Steve Jobs', weight: 4 },
  { text: 'Stay close to the metal.', author: 'Anonymous', weight: 2 },
  {
    text: 'The details are not the details; they make the design.',
    author: 'Charles Eames',
    weight: 3,
  },
  {
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
    weight: 3,
  },
  { text: 'Constraints breed creativity.', author: 'Anonymous', weight: 3 },
  {
    text: 'If you can not explain it simply, you do not understand it well enough.',
    author: 'Albert Einstein',
    weight: 3,
  },
  {
    text: 'You miss one hundred percent of the shots you do not take.',
    author: 'Wayne Gretzky',
    weight: 3,
  },
  {
    text: 'Comparison is the thief of joy.',
    author: 'Theodore Roosevelt',
    weight: 3,
  },
  {
    text: 'Whatever you are, be a good one.',
    author: 'Abraham Lincoln',
    weight: 2,
  },
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    weight: 3,
  },
  {
    text: 'Courage is grace under pressure.',
    author: 'Ernest Hemingway',
    weight: 3,
  },
  {
    text: 'The pessimist complains about the wind; the optimist expects it to change.',
    author: 'William Arthur Ward',
    weight: 2,
  },
  {
    text: 'What gets measured gets managed.',
    author: 'Peter Drucker',
    weight: 3,
  },
  {
    text: 'Culture eats strategy for breakfast.',
    author: 'Peter Drucker',
    weight: 3,
  },
  {
    text: 'Vision without execution is hallucination.',
    author: 'Thomas Edison',
    weight: 3,
  },
  {
    text: 'Ideas are easy. Execution is everything.',
    author: 'John Doerr',
    weight: 3,
  },
  { text: 'Hope is not a strategy.', author: 'Traditional', weight: 4 },
  { text: 'Perfect is the enemy of good.', author: 'Voltaire', weight: 4 },
  {
    text: 'Knowledge speaks, but wisdom listens.',
    author: 'Jimi Hendrix',
    weight: 3,
  },
  {
    text: 'The wound is the place where the light enters you.',
    author: 'Rumi',
    weight: 3,
  },
  { text: 'What you seek is seeking you.', author: 'Rumi', weight: 3 },
  {
    text: 'Energy and persistence conquer all things.',
    author: 'Benjamin Franklin',
    weight: 2,
  },
  {
    text: 'No man ever steps in the same river twice.',
    author: 'Heraclitus',
    weight: 3,
  },
  {
    text: 'The only constant in life is change.',
    author: 'Heraclitus',
    weight: 4,
  },
  { text: 'Amor fati.', author: 'Friedrich Nietzsche', weight: 5 },
  { text: 'Memento mori.', author: 'Stoic maxim', weight: 5 },
  { text: 'Carpe diem.', author: 'Horace', weight: 5 },
  { text: 'This too shall pass.', author: 'Persian adage', weight: 4 },
  { text: 'Veni, vidi, vici.', author: 'Julius Caesar', weight: 4 },
  { text: 'Cogito, ergo sum.', author: 'René Descartes', weight: 3 },
  { text: 'Festina lente — make haste slowly.', author: 'Augustus', weight: 3 },
  { text: 'Fortune favors the bold.', author: 'Virgil', weight: 3 },
  { text: 'Know thyself.', author: 'Delphic maxim', weight: 5 },
  { text: 'Nothing in excess.', author: 'Delphic maxim', weight: 3 },
];
