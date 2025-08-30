export function formatTime(timeString) {
  const date = new Date(timeString);
  const offset = new Date().getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(timeString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(timeString));
}

export function formatFullDate(timeString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timeString));
}
