// Ghost Name Generator - Adjective + Creature + Number
const adjectives = [
  'Silent', 'Phantom', 'Shadow', 'Ethereal', 'Spectral', 'Hollow', 
  'Fading', 'Lurking', 'Whispering', 'Drifting', 'Flickering', 'Veiled',
  'Cryptic', 'Elusive', 'Wandering', 'Forgotten', 'Ancient', 'Void',
  'Midnight', 'Cursed', 'Haunted', 'Nebulous', 'Astral', 'Twilight'
];

const creatures = [
  'Specter', 'Wraith', 'Phantom', 'Shade', 'Spirit', 'Ghoul',
  'Revenant', 'Banshee', 'Poltergeist', 'Apparition', 'Entity', 'Haunt',
  'Spook', 'Eidolon', 'Daemon', 'Wisp', 'Shadow', 'Echo',
  'Remnant', 'Vestige', 'Fragment', 'Cipher', 'Glitch', 'Void'
];

export function generateGhostName(seed?: string): string {
  // Use seed for consistent name generation if provided
  const hash = seed ? hashCode(seed) : Math.random() * 1000000;
  
  const adjIndex = Math.abs(Math.floor(hash)) % adjectives.length;
  const creatureIndex = Math.abs(Math.floor(hash * 7)) % creatures.length;
  const number = Math.abs(Math.floor(hash)) % 9999;
  
  return `${adjectives[adjIndex]}${creatures[creatureIndex]}${number.toString().padStart(4, '0')}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export function getGhostAvatar(name: string): string {
  // Generate a consistent avatar based on name
  const colors = ['#00FF41', '#00CC33', '#009926', '#33FF66', '#66FF88'];
  const hash = hashCode(name);
  return colors[Math.abs(hash) % colors.length];
}
