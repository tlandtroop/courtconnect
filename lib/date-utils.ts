/**
 * Checks if a date is in the past (before today)
 * Handles date strings safely and avoids timezone issues by comparing only the date parts
 *
 * @param dateString The date string to check
 * @returns boolean True if the date is in the past, false otherwise
 */
export const isDateInPast = (dateString: string | undefined): boolean => {
  if (!dateString) return false;

  try {
    // Parse the date from the string
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return false;

    // Extract date components only (no time, no timezone)
    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Compare only the date portions
    return dateToCheck < todayDate;
  } catch (error) {
    console.error("Error checking if date is past:", error);
    return false;
  }
};

/**
 * Checks if a game is in the past
 *
 * @param game The game object to check
 * @returns boolean True if the game is in the past, false otherwise
 */
export const isGameInPast = (game: { date?: string }): boolean => {
  return isDateInPast(game.date);
};

/**
 * Formats a date string to display format
 *
 * @param dateString The date string to format
 * @returns string The formatted date
 */
export const formatDate = (dateString: string | undefined): string => {
  try {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    // Using Intl.DateTimeFormat for formatting without needing external libraries
    // You can replace this with date-fns format if you prefer
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date format error";
  }
};

/**
 * Formats a time string to display format
 *
 * @param timeString The time string to format
 * @returns string The formatted time
 */
export const formatTime = (timeString: string | undefined): string => {
  try {
    if (!timeString) return "Time not available";

    const time = new Date(timeString);
    if (isNaN(time.getTime())) return "Invalid time";

    // Format time as "h:mm am/pm"
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(time);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Time format error";
  }
};
