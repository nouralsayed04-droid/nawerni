export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function checkExpiryNotifications(items) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  items.forEach(item => {
    const daysLeft = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));

    if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
      const suggestions = getSuggestions(item.cat, item.name, daysLeft);
      new Notification(`⚠️ ${item.name} expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`, {
        body: suggestions,
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    }
  });
}

function getSuggestions(cat, name, daysLeft) {
  if (cat === 'food') {
    return `💡 Use ${name} in a meal today, share with neighbors, freeze it, or donate to Saudi Food Bank before it expires!`;
  } else if (cat === 'medicine') {
    return `💡 Check if you need ${name}, return unused medicine to a pharmacy, or donate to Red Crescent Society.`;
  } else {
    return `💡 Use ${name} soon or donate to a nearby charity center before it expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.`;
  }
}