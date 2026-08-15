export const colors = {
  canvas: '#F6F1E8',
  card: '#FCFAF5',
  sunken: '#EDE6D8',
  ink: '#2A251E',
  muted: '#6E6558',
  hairline: '#E2DACB',
  terracotta: '#C2684A',
  terracottaPressed: '#A5533A',
  terracottaTint: '#F3E3DA',
  moss: '#6F7A56',
  ochre: '#CD9A3C',
  // Reserved exclusively for the impostor-reveal card. Do not use elsewhere.
  oxblood: '#8E3B2D',
} as const;

export type ColorToken = keyof typeof colors;
