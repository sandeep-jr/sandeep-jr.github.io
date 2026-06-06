export interface MusicPiece {
  title: string;
  blurb: string;
  embedUrl?: string;
}

export const music = {
  intro:
    "Music is one of the deepest ways I understand joy, connection, and human possibility. I'm still early in my musical journey, but I'm drawn to violin, guitar, piano, and the kind of musical experiences that make people feel wonder together. Artists like Jacob Collier inspire me because they remind me that music can be both deeply technical and deeply human. For me, learning music is not about perfection. It is about listening more carefully, expressing more honestly, and one day creating experiences that bring people together across backgrounds, emotions, and cultures.",
  links: {
    spotify: '',
    soundcloud: '',
    youtube: '',
  },
  pieces: [
    { title: 'First Violin Reflections', blurb: "A beginner's journey into patience, discipline, and the emotional honesty of learning an instrument." },
    { title: 'Guitar Practice Notes', blurb: 'Exploring rhythm, voice, and the joy of making music feel personal.' },
    { title: 'Piano Sketches', blurb: 'Simple melodic ideas inspired by wonder, stillness, and human connection.' },
    { title: 'Music That Moves Me', blurb: 'A collection of songs and artists that shape how I think about beauty and creativity.' },
    { title: 'Future Collaboration Experiments', blurb: 'Early ideas for musical experiences that bring people together through improvisation and shared joy.' },
  ] satisfies MusicPiece[],
} as const;
