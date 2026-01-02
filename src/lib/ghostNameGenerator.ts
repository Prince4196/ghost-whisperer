// Arrays of adjectives and nouns for ghost name generation
const adjectives = [
  "Shadow", "Phantom", "Spectral", "Ethereal", "Mystic", "Wraith", "Spectral", 
  "Ghastly", "Eerie", "Crimson", "Azure", "Verdant", "Ancient", "Forgotten", 
  "Silent", "Whispering", "Misty", "Cobweb", "Raven", "Moonlit", "Starless", 
  "Cryptic", "Gloomy", "Haunting", "Restless", "Veiled", "Shrouded", "Solemn", 
  "Mournful", "Spectral", "Hollow", "Dusky", "Dread", "Spectral", "Phantom", 
  "Wraith", "Specter", "Apparition", "Soul", "Spirit", "Poltergeist", "Banshee", 
  "Ghoul", "Revenant", "Phantasm", "Wisp", "Shade", "Phantom", "Ghostly", 
  "Spectral", "Ethereal", "Misty", "Shadowy", "Hazy", "Vague", "Dim", "Faint", 
  "Foggy", "Hollow", "Empty", "Vacant", "Mute", "Soundless", "Still", "Quiet"
];

const nouns = [
  "Hacker", "Coder", "Developer", "Programmer", "Ninja", "Samurai", "Warrior", 
  "Knight", "Mage", "Wizard", "Sorcerer", "Alchemist", "Architect", "Builder", 
  "Creator", "Designer", "Engineer", "Scientist", "Explorer", "Adventurer", 
  "Pioneer", "Pathfinder", "Trailblazer", "Voyager", "Navigator", "Pilot", 
  "Captain", "Commander", "Leader", "Guardian", "Protector", "Sentinel", 
  "Watcher", "Observer", "Sage", "Scholar", "Student", "Master", "Apprentice", 
  "Crafter", "Artisan", "Builder", "Creator", "Innovator", "Visionary", 
  "Dreamer", "Thinker", "Philosopher", "Explorer", "Pioneer", "Founder", 
  "Originator", "Initiator", "Generator", "Producer", "Composer", "Author", 
  "Writer", "Storyteller", "Narrator", "Interpreter", "Translator", "Analyst", 
  "Specialist", "Expert", "Guru", "Mentor", "Guide", "Teacher", "Mentor"
];

const numbers = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101, 202, 303, 404, 
  505, 606, 707, 808, 909, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 
  61, 67, 71, 73, 79, 83, 89, 97, 103, 107, 109, 113, 127, 131, 137, 139, 
  149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 
  227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 
  307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 
  389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 
  467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 571, 577, 587, 
  593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 
  673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 
  769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 
  863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 
  971, 977, 983, 991, 997];

/**
 * Generates a random ghost name in the format "Adjective-Noun-Number"
 * Example: "Shadow-Hacker-77"
 */
export const generateGhostName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${adjective}-${noun}-${number}`;
};