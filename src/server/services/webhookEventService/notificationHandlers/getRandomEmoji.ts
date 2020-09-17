
const availableEmojis = ["🗞", "🐔", "🌻"];
export const getRandomEmoji = (): string => availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
