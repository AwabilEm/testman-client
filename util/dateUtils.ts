export function convertDate(date: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, day, year] = date.split('/').map(part => parseInt(part, 10));
  const paddedDay = day.toString().padStart(2, '0'); // e.g., "08"

  return `${months[month - 1]} ${paddedDay}, ${year}`;
}
