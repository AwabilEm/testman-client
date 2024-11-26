import { test, expect } from '@playwright/test';
//import { currentsReporter } from '@currents/playwright';
const email = 'test.report8@gmail.com';
const PhoneNumber = '800-000-2927';

const fName = 'test';
const lName ='automate'
const selectStu = 'Houston';
const SelectedDate ='01/10/2025'
let selectedTime = '07:30 AM'
const startTime = '06:30 AM'; // Start of the time range for booking
const endTime = '08:30 PM'; // End of the time range for booking

//const CalendarSelectedDate = 17 September, 2024
// Convert selected date to calendar format
let CalendarSelectedDate = convertDate(SelectedDate);
console.log('Selected date',CalendarSelectedDate); // Output: "17 September, 2024"


// Function to convert date format
function convertDate(date: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, day, year] = date.split('/').map(part => parseInt(part, 10));
  return `${months[month - 1]} ${day}, ${year}`;
}
test('Executed first appointment', async ({page}) => {
   
  await page.goto('https://admin.manduu.app/app/main/dashboard');
  // await page.goto('https://admin.manduu.app/app/main/clients/client-session');
 
await page.getByRole('link', { name: 'Session Calendar' }).click();
await page.fill('[formcontrolname="selectedDate"]', CalendarSelectedDate);

 
await page.getByRole('button', { name: 'Select studio ' }).click();
await page.locator('.dropdown-item', { hasText: selectStu }).click();
 await page.waitForTimeout(4000);

await page.getByRole('button', { name: 'Refresh' }).click();
console.log(selectedTime)

await page.locator(`div.fc-event-custom-info:has-text("${selectedTime}")`) 
//await page.locator(`div.fc-event-custom-info:has-text("07:30 AM")`)
    .filter({ hasText: `${fName} ${lName}` })
    .click();


await page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
await page.locator('.p-dropdown-item:has-text("First Appointment")').click();
await page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
// Select the "Executed" option
await page.getByRole('option', { name: 'Executed' }).click();//await page.getByRole('option', { name: 'Executed' }).click
//await page.waitForTimeout(1000);

await page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
await page.waitForTimeout(1000);
  // await page.getByLabel('test manduu', { exact: true }).click();
await page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();
await page.locator('app-text-area').filter({ hasText: 'Client Memo *' }).getByRole('textbox').fill('This whole process has been automated, to make things faster and to avoid mistakes, this sessions will be deleted after the testing: So as part of the onboarding admin is supposed to executed a user first appointment');
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);


});





