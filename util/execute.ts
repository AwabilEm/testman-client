import { test, expect } from '@playwright/test';
//import { currentsReporter } from '@currents/playwright';
const email = 'test.report1@gmail.com';
const PhoneNumber = '800-000-2900';

const password = 'TestUser@1'
const fName = 'test';
const lName ='automate'
const selectStu = 'Houston';
const SelectedDate ='11/13/2024'
let selectedTime: '10:30 AM'
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
  // await page.locator(`div.fc-event-custom-info:has-text("${selectedTime}")`) 
  // //await page.locator(`div.fc-event-custom-info:has-text("07:30 AM")`)
  //     .filter({ hasText: `${fName} ${lName}` })
  //     .click();
  
  
  
  // Function to get the inner HTML of an element
  async function logElementHTML(locator: any) {
    const element = await locator.elementHandle();
    if (element) {
      const html = await element.evaluate(el => el.innerHTML);
      console.log('Element HTML:', html);
    } else {
      console.log('Element not found');
    }
  }
  
  try {
    // Log the selected time and name to confirm values
    console.log('Selected Time:', selectedTime);
    console.log('Full Name:', `${fName} ${lName}`);
  
    // Locate the element containing the selected time
    const timeLocator = page.locator(`div.fc-event-custom-info:has(span.fc-event-custom-date-details:has-text("${selectedTime}"))`);
    await logElementHTML(timeLocator);
  
    // Locate the event element that also contains the full name
    const eventElement = timeLocator.locator(`span.fc-event-custom-message:has-text("${fName} ${lName}")`);
    await logElementHTML(eventElement);
  
    // Click the element
    await eventElement.click();
    console.log('Element clicked successfully');
  
  } catch (error) {
    console.error('Error occurred:', error);
  }
  
  
  await page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
  await page.locator('.p-dropdown-item:has-text("First Appointment")').click();
  await page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
  await page.getByLabel('Executed').click();
  //await page.getByRole('option', { name: 'Executed' }).click
  await page.waitForTimeout(1000);
  
  await page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
  await page.waitForTimeout(1000);
    // await page.getByLabel('test manduu', { exact: true }).click();
  await page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();
  await page.locator('app-text-area').filter({ hasText: 'Client Memo *' }).getByRole('textbox').fill('This whole process has been automated, to make things faster and to avoid mistakes, this sessions will be deleted after the testing: So as part of the onboarding admin is supposed to executed a user first appointment');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);
  
  
  });
  