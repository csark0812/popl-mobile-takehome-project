export const getGreeting = (name: string | undefined) => {
  const hour = new Date().getHours();
  let greeting = 'Hello';
  let emoji = '👋';
  if (hour < 12) {
    greeting = 'Good morning';
    emoji = '☀️';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
    emoji = '🌤️';
  } else {
    greeting = 'Good evening';
    emoji = '🌙';
  }
  return `${greeting}, ${name || 'User'}`;
};
