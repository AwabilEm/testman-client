// dateUtils.ts
export function convertDate(date: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, day, year] = date.split('/').map(part => parseInt(part, 10));
  return `${months[month - 1]} ${day}, ${year}`;
}
