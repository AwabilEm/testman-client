import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
//import { currentsReporter } from '@currents/playwright';

const email = 'manduu.test166@gmail.com';
const password = 'TestUser@1'
const PhoneNumber = '056-166-1111';
const fName = 'test';
const lName ='automate'
const selectStu = 'Houston';
const SelectedDate ='11/12/2024'
let selectedTime: string | null = null;
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



test('Onboarding', async ({ page }) => {
  await page.goto('https://newpwa.manduu.app/account/register');
 // Fill in personal information
 await fillPersonalInformation(page);
 // fill personal medicals
 await signMedicalConditions(page);
 // Select the studio
 await selectStudio(page);

 // Fill in the scheduled date
 await fillScheduledDate(page);
 // Wait for time options and select a random time
 await selectRandomTime(page);
 await page.screenshot({ path: 'screenshot.png', fullPage: true });
 // Click the next button
 await handlePopups(page);
 await completeProfile(page);
 await CompleteClientInfo(page);
 await howYouHearAboutUs(page);
 
 await SignWaiver(page);
 console.log(CalendarSelectedDate); // Output: "17 September, 2024"

 await FirstAppointment(page);

});
20


test('Executed first appointment', async ({page}) => {
   
  await page.goto('https://admin.manduu.app/app/main/dashboard');
  // await page.goto('https://admin.manduu.app/app/main/clients/client-session');
 
await page.getByRole('link', { name: 'Session Calendar' }).click();
await page.fill('[formcontrolname="selectedDate"]', CalendarSelectedDate);

 
await page.getByRole('button', { name: 'Select studio ' }).click();
await page.locator('.dropdown-item', { hasText: selectStu }).click();
// await page.waitForTimeout(1000);

await page.getByRole('button', { name: 'Refresh' }).click();
await page.waitForTimeout(1000);

await page.locator(`div.fc-event-custom-info:has-text("${selectedTime}")`)
    .filter({ hasText: `${fName} ${lName}` })
    .click();


await page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
await page.locator('.p-dropdown-item:has-text("First Appointment")').click();
await page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
await page.getByLabel('Executed').click();
await page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
await page.waitForTimeout(1000);
  // await page.getByLabel('test manduu', { exact: true }).click();
await page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();
await page.locator('app-text-area').filter({ hasText: 'Client Memo *' }).getByRole('textbox').fill('This whole process has been automated, to make things faster and to avoid mistakes, this sessions will be deleted after the testing: So as part of the onboarding admin is supposed to executed a user first appointment');
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);


});

test('LoginToCompleteOnboard', async ({ page }) => {   
  await login(page);
  await addCard(page)
  await signContract(page)
     });

  // test('Login to ensure the onboarding is successfully', async ({ page }) => {   
  //           await login(page);
  //           // await expect(page.locator('user-menu')).toContainText(`${fName}`);

  //           await expect(page.locator('heading')).toContainText(`Welcome, ${fName}`);

      
  //     // await expect(page.locator('app-user-studio')).toContainText('Home Studio: Houston');
  //     await expect(page.locator('app-user-studio')).toContainText(`Home Studio: ${selectStu}`);
  //    await page.getByRole('img', { name: 'user' }).click();
  //     await expect(page.locator('user-menu')).toContainText(`${email}`);
  //     await expect(page.locator('user-menu')).toContainText(`${fName}`);


// });
  async function fillPersonalInformation(page: any) {
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill(fName);
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill(lName);
  await page.getByRole('textbox').nth(2).fill(email);
  await page.getByRole('textbox').nth(3).fill(email);
  await page.getByRole('button', { name: 'Continue ' }).click();
  
//   await page.timeout(2000);

  await page.fill('input[name="dateOfBirth"]', '12/20/2007');
  await page.locator('input[type="text"]').fill(PhoneNumber);
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(password);
  await page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill(password);
  
  await page.getByRole('button', { name: 'Continue' }).click();
  

  }

   //Select the studio.
async function selectStudio(page: any) {

  await page.selectOption('select[formcontrolname="studioId"]', { label: selectStu });
  //await page.locator('app-session-appointment div').filter({ hasText: 'Select Studio-- Select Studio' }).getByRole('combobox').selectOption('47');

}
 // Fill in the scheduled date.
async function fillScheduledDate(page: any) {
   //await page.fill('#ScheduledDate', '05/07/2024');
   await page.fill('xpath=//input[@id="ScheduledDate"]',SelectedDate)
   await page.click('text="Start Time"');


}
 // Select a random time from available options.
async function selectRandomTime(page: any) {
  // Define a function to check if the time dropdown is available and return all available options
  const getTimeOptions = async () => {
    const timeDropdown = await page.$('#inputGroupSelect02');
    if (!timeDropdown) return null; // Return null if dropdown is not found
    const options = await timeDropdown.$$eval('option', options => options.map(option => option.getAttribute('value')));
    return options.length > 0 ? options : null; // Return null if no options found
  };

  // Define a function to wait for the dropdown options to become available with retries
  const waitForTimeOptions = async () => {
    let attempts = 0;
    while (attempts < 5) { // Retry for a maximum of 5 attempts
      const availableTimes = await getTimeOptions();
      if (availableTimes) return availableTimes; // Return options if available
      await page.waitForTimeout(1000); // Wait for 1 second before retrying
      attempts++;
    }
    return null; // Return null if options are not available after retries
  };

  // Wait for the time dropdown options to become available
  const availableTimes = await waitForTimeOptions();

  if (availableTimes) {
    // Log out all available times
    console.log('Available times on',selectStu, ':', availableTimes);

    // Select a random index from the available times array
    const randomIndex = Math.floor(Math.random() * availableTimes.length);
    const selectedTimeWithIndex  = availableTimes[randomIndex];  // Declare a variable to store the selected time
    selectedTime = selectedTimeWithIndex.split(': ')[1];
    console.log('Selected time for the first appointment:', selectedTime);

    // Select the time option from the dropdown using the random index
    await page.selectOption('#inputGroupSelect02', availableTimes[randomIndex]);
  } else {
    console.warn('No available times found the selected date after retries.');
  }

  await page.getByRole('button', { name: 'Continue' }).click();
   // Click the OK button to continue
   await page.getByRole('button', { name: 'Next' }).click();


}

//Handle popups, if any.
async function handlePopups(page: any) {
  try {
    // Wait for the popup to appear with a timeout of 5 seconds
    const popup = await page.waitForSelector('.swal2-popup', { timeout: 5000 });

    // Extract the error message
    const errorMessage = await popup.$eval('.swal2-html-container', element => element.textContent);

    // Log the error message
    console.log('Error message:', errorMessage);

    // Click the OK button to dismiss the popup using page.evaluate
    await page.evaluate(() => {
      const confirmButton = document.querySelector('.swal2-confirm');
      if (confirmButton) {
        (confirmButton as HTMLButtonElement).click();
      }
    });
  } catch (error) {
    // Handle timeout or other errors
    console.log('Popup did not appear within the specified timeout or encountered an error.');
    console.error(error);

   
  }
}

async function signMedicalConditions(page: any) {
  await page.getByLabel('No').first().check();
  await page.click('input[type="radio"][name="pregnant"][value="No"]');
  await page.getByLabel('No').nth(2).check();
  await page.getByLabel('No').nth(3).check();
  await page.getByRole('button', { name: 'No, I do not have any of' }).click();

}

async function howYouHearAboutUs(page: any) {
  await page.getByRole('button', { name: 'Complete question' }).click()
  await page.locator('li').filter({ hasText: 'Print Magazine' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Radio' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'TV' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Social media' }).getByRole('checkbox').check();
  await page.getByText('Print Magazine Radio TV').click();
  await page.getByText('Google/Internet').click();
  await page.locator('li').filter({ hasText: 'Mobile Ad' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Google/Internet' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Direct mail' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Email' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Saw Studio' }).getByRole('checkbox').check();
  await page.locator('li').filter({ hasText: 'Referral' }).getByRole('checkbox').check();
  await page.getByRole('list').locator('li').filter({ hasText: 'Other' }).getByRole('checkbox').check();

  // await page.getByRole('textbox').fill('through a movie');
 await page. getByTitle('How did you hear about us?').getByRole('textbox').fill('through a movie');

  // Click the submit button
  await page.getByRole('button', { name: 'Submit' }).click();

  // Click the OK button to continue
}

async function FirstAppointment(page: any){
  await page.click('span:has-text("First Appointment")');
  await page.getByRole('button', { name: 'Continue' }).click();
}
async function  completeProfile(page: any){
await page.getByRole('button', { name: 'Complete Profile' }).first().click();
await page.getByRole('combobox').first().selectOption('Female');
await page.locator('div').filter({ hasText: /^CountrySelect CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');
await page.getByRole('combobox').nth(2).selectOption('Alabama');
await page.locator('man-input').filter({ hasText: 'City *' }).getByRole('textbox').fill('Accra');
await page.locator('man-input').filter({ hasText: 'Zip Code *' }).getByRole('textbox').fill('111');
await page.locator('man-input').filter({ hasText: 'Street *' }).getByRole('textbox').fill('accra');

await page.getByRole('button', { name: 'Save' }).click();



}
async function  CompleteClientInfo(page: any){
  
 
  await page.getByRole('button', { name: 'Complete Client Info' }).click();
  await page.locator('div').filter({ hasText: /^Heigh\(Feet\)Selected Inch4567$/ }).getByRole('combobox').selectOption('5');
  await page.locator('div').filter({ hasText: /^Heigh\(Inches\)Selected Height01234567891011$/ }).getByRole('combobox').selectOption('7');
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('test');
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('mand');
  await page.locator('div').filter({ hasText: /^Phone Number$/ }).getByRole('textbox').fill('(054) 433-3333');
  await page.getByRole('button', { name: 'Save' }).click();

}

async function SignWaiver(page:any) {
  
await page.getByRole('button', { name: 'Sign', exact: true }).click();

 //signature-pad-canvas
await page.click('.signature-pad-canvas');

await page.locator('input[name="table1q1"]').nth(1).check();
await page.locator('input[name="table1q2"]').nth(1).check();
await page.locator('input[name="table1q3"]').nth(1).check();
await page.locator('input[name="table1q4"]').nth(1).check();
await page.getByRole('button', { name: 'Sign Here' }).click();
await page.locator('input[name="table2q1"]').nth(1).check();
await page.locator('input[name="table2q2"]').nth(1).check();
await page.locator('input[name="table2q3"]').nth(1).check();
await page.locator('input[name="table2q4"]').nth(1).check();
await page.locator('input[name="table2q5"]').nth(1).check();
await page.locator('input[name="table2q6"]').nth(1).check();
await page.locator('input[name="table2q7"]').nth(1).check();
await page.locator('input[name="table2q8"]').nth(1).check();
await page.getByRole('button', { name: 'Click To Sign' }).first().click();
await page.locator('input[name="table3q1"]').nth(1).check();
await page.locator('input[name="table3q2"]').nth(1).check();
await page.locator('input[name="table3q3"]').nth(1).check();
await page.locator('input[name="table3q4"]').nth(1).check();
await page.getByRole('button', { name: 'Click To Sign' }).nth(1).click();
await page.locator('div').filter({ hasText: /^Draw SignatureClick To Sign$/ }).getByRole('button').click();
await page.getByRole('button', { name: ' Sign' }).click();
  
}

async (page:any) => {

  
}
  
  async function addCard(page:any) {
    await page.getByRole('button', { name: 'Add Card' }).click();
    await page.getByTitle('Add Your Card').locator('input[type="text"]').fill('TESTER CARD');
    await page.locator('#cc-number').first().fill('4916186141125817');
    await page.locator('#cc-exp-date').fill('06 / 2026');
    await page.locator('#cc-number').nth(1).fill('546');
    await page.getByRole('button', { name: 'Authorize' }).click();
  
  }
  
      async function signContract(page:any){
        await page.getByRole('button', { name: 'Sign Contract' }).click();
    // await page.locator('div').filter({ hasText: /^Fit 8 Plan \(Manduu Oklahoma\)$/ await page.getByRole('button', { name: 'Sign Contract' }).click();}).click();
    await page.locator('div').filter({ hasText: /^Unlimi- Fit Plan Best Value \*H \(Manduu Houston\)$/ }).click();
    // await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByTitle('Sign Contract').locator('canvas').click({
      position: {
        x: 109,
        y: 56
      }
    });
    await page.getByTitle('Sign Contract').locator('canvas').click({
      position: {
        x: 152,
        y: 54
      }
    });
    
  
    await page.getByRole('button', { name: 'Sign Here' }).first().click();
    await page.getByRole('button', { name: 'Sign Here' }).nth(1).click();
    await page.getByRole('button', { name: 'Sign Here' }).nth(2).click();
    await page.getByRole('button', { name: 'Sign Here' }).nth(3).click();
    await page.getByRole('button', { name: 'Sign Here' }).nth(4).click();
    await page.getByRole('button', { name: ' Sign' }).click();
    await page.getByRole('button', { name: 'Complete Onboarding' }).click();
    //await page.goto('https://newpwa.manduu.app/app/client/dashboard');

       }
      

       export async function findAndClickEvent(page: any) {
        const specificEventLocator = page.locator(`div.fc-event-custom-info:has-text("${selectedTime}")`)
                                     .locator(`span.fc-event-custom-message:has-text("${fName} ${lName}")`);
      
        const eventCount = await specificEventLocator.count();
        console.log(`Found ${eventCount} elements matching the criteria`);
      
        if (eventCount === 1) {
          await specificEventLocator.click();
        } else {
          console.error(`Expected one event but found ${eventCount}`);
        }
      }
      async function login(page:any){
        await page.goto('https://newpwa.manduu.app/account/login');
      await page.getByPlaceholder('Username Or Email *').fill(email);
      await page.getByPlaceholder('Password *').fill(password);
        await page.getByRole('button', { name: 'Log In' }).click();
       
       }