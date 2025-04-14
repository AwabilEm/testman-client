import { chromium,test, expect } from '@playwright/test';
import { convertDate } from '../util/dateUtils.ts';
import { expectedStudios } from '../util/studios.ts';

//const email = 'test.awabil.1@gmail.com';
//const PhoneNumber = '810-100-0001';
const Phone = '810-100-0001';
const password = 'TestUser@1';
const fName = 'test';
const SelectedDate = '05/23/2025';
const baseEmail = 'test.awa2';
const domain = '@gmail.com';


let selectedTime: string | null = null;
let CalendarSelectedDate = convertDate(SelectedDate);
console.log('Selected date', CalendarSelectedDate); 

test.describe.parallel('Onboarding Tests', () => {
expectedStudios.forEach((studio, index) => {
  const email = `${baseEmail}${index + 1}${domain}`; // Unique email
  const phoneNumber = `810400${String(index + 1).padStart(4, '0')}`; // Unique phone number
  const lName = `automate${studio}`;
  console.log(`Generated Last Name: ${lName}`);


  test(`Onboarding for ${studio}`, async ({ page }) => {
    
    await page.goto('https://newpwa.manduu.app/account/register');
    await fillPersonalInformation(page,email, phoneNumber,lName);
    await signMedicalConditions(page);
    await selectStudio(page, studio);
    await fillScheduledDate(page);
    await selectRandomTime(page);
    await handlePopups(page);
    await completeProfile(page);
    await CompleteClientInfo(page);
    await howYouHearAboutUs(page);
    await SignWaiver(page);
    await FirstAppointment(page);
  });

  test(`Executed first appointment for ${studio}`, async ({ page }) => {
    await page.goto('https://admin.manduu.app/app/main/dashboard');
    await page.getByRole('link', { name: 'Session Calendar' }).click();
    await page.fill('[formcontrolname="selectedDate"]', CalendarSelectedDate);
    await page.getByRole('button', { name: 'Select studio ' }).click();
    await page.locator('.dropdown-item', { hasText: studio }).click();
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'Refresh' }).click();

    try {
      await page.locator(`div.fc-event-custom-info:has-text("${selectedTime}")`)
        .filter({ hasText: `${fName} ${lName}` })
        .click();
    } catch (error) {
      console.error(`Event not found for ${studio}`);
    }

    await page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
    await page.locator('.p-dropdown-item:has-text("First Appointment")').click();

    await page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
    await page.getByLabel('Executed').click();
    await page.waitForTimeout(1000);

    await page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
    await page.waitForTimeout(1000);
    await page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();


    await page.locator('app-text-area').getByRole('textbox').fill(
      'This whole process has been automated, to make things faster and to avoid mistakes, this session will be deleted after the testing: So as part of the onboarding admin is supposed to execute a user first appointment'
    );
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2000);
  });

  test(`Login and complete onboarding for ${studio}`, async ({ page }) => {
    await login(page,email);
    await addCard(page);
    await signContract(page);
  });

 
  test(`Verify studio and contract after onboarding for ${studio}`, async ({ page }) => {
    await login(page,email);
    const displayedStudio = await page.locator('text=Home Studio:').textContent();
    expect(displayedStudio).toContain(studio);

  });
});
});




async function fillPersonalInformation(page: any, email: string, phoneNumber: string, lName: string) {
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill(fName);
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill(lName);
  await page.getByRole('textbox').nth(2).fill(email);
  await page.getByRole('textbox').nth(3).fill(email);
  await page.getByRole('button', { name: 'Continue ' }).click();
  
//   await page.timeout(2000);

//await expect(page.getByPlaceholder('DD/MM/YYYY')).toBeVisible();a
//await page.getByPlaceholder('DD/MM/YYYY' ,'20/12/2007');
//await page.fill('input[name="dateOfBirth"]', '12/20/2007');
  //await page.fill('input[name="dateOfBirth"]', '12/20/2007');
await page.getByRole('button', { name: '' }).click();

await page.getByRole('combobox').first().selectOption('9');
await page.getByRole('combobox').nth(1).selectOption('3');
await page.getByRole('combobox').nth(2).selectOption('2000');
await page.getByRole('button', { name: 'Set Date' }).click();
  //await page.locator('input[type="text"]').fill(PhoneNumber);
await page.getByRole('textbox').nth(1).fill(phoneNumber);

await page.getByRole('textbox').nth(1).click({
    button: 'right'
  });
await page.getByRole('textbox').nth(1).click({
    button: 'right'
  });
  await page.getByRole('dialog').locator('div').nth(2).click();
  await page.getByRole('button', { name: 'I Agree' }).click();

  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(password);
  await page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill(password);
  
  await page.getByRole('button', { name: 'Continue' }).click();
  

  }



 // Select the studio dynamically
async function selectStudio(page: any, studio: string) {
  await page.selectOption('select[formcontrolname="studioId"]', { label: studio });
}

 // Fill in the scheduled date.
async function fillScheduledDate(page: any) {
   //await page.fill('#ScheduledDate', '05/07/2024');
   await page.fill('xpath=//input[@id="ScheduledDate"]',SelectedDate)
   await page.click('text="Start Time"');


}


async function selectRandomTime(page: any) {
  const getTimeOptions = async () => {
    const timeDropdown = await page.$('#inputGroupSelect02');
    if (!timeDropdown) return null;

    const options = await timeDropdown.$$eval('option', options =>
      options
        .map(option => option.getAttribute('value'))
        .filter(option => option && !option.includes('undefined'))
    );

    return options.length > 0 ? options : null;
  };

  const waitForTimeOptions = async () => {
    let attempts = 0;
    while (attempts < 5) {
      const availableTimes = await getTimeOptions();
      if (availableTimes) return availableTimes;
      await page.waitForTimeout(1000);
      attempts++;
    }
    return null;
  };

  const availableTimes = await waitForTimeOptions();

  if (availableTimes) {
    console.log('Available times:', availableTimes);

    const randomIndex = Math.floor(Math.random() * availableTimes.length);
    selectedTime = availableTimes[randomIndex].split(': ')[1];
    console.log('Selected time for the appointment:', selectedTime);

    await page.selectOption('#inputGroupSelect02', availableTimes[randomIndex]);
  } else {
    console.warn('No available times found for the selected date after retries.');
  }

  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Continue' }).click();
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
  //await page.getByRole('button', { name: 'Complete question' }).click()
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
  //await page.click('span:has-text("First Appointment")');
  await page.getByRole('button', { name: 'Continue' }).click();
}
async function  completeProfile(page: any){
await page.getByRole('button', { name: 'Complete Profile' }).first().click();
await page.getByRole('combobox').first().selectOption('Female');
await page.locator('div').filter({ hasText: /^CountrySelect CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');
await page.getByRole('combobox').nth(2).selectOption('Alabama');
await page.locator('man-input').filter({ hasText: 'City *' }).getByRole('textbox').fill('Accra');
await page.locator('man-input').filter({ hasText: 'Zip Code *' }).getByRole('textbox').fill('11551');
await page.locator('man-input').filter({ hasText: 'Street *' }).getByRole('textbox').fill('accra');

await page.getByRole('button', { name: 'Save' }).click();



}
async function  CompleteClientInfo(page: any){
  
 
  //await page.getByRole('button', { name: 'Complete Client Info' }).click();
  await page.locator('div').filter({ hasText: /^Heigh\(Feet\)Selected Inch4567$/ }).getByRole('combobox').selectOption('5');
  await page.locator('div').filter({ hasText: /^Heigh\(Inches\)Selected Height01234567891011$/ }).getByRole('combobox').selectOption('7');
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('test');
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('mand');
  await page.locator('div').filter({ hasText: /^Phone Number$/ }).getByRole('textbox').fill('(054) 433-3333');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

}

async function SignWaiver(page:any) {
  
//await page.getByRole('button', { name: 'Sign', exact: true }).click();

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


  
  async function addCard(page:any) {
    //await page.getByRole('button', { name: 'Add Card' }).click();
    await page.getByTitle('Add Your Card').locator('input[type="text"]').fill('TESTER CARD');
    await page.locator('#cc-number').first().fill('4916186141125817');
    await page.locator('#cc-exp-date').fill('06 / 2026');
    await page.locator('#cc-number').nth(1).fill('546');
    await page.getByRole('button', { name: 'Authorize' }).click();
  
  }
  
  async function signContract(page:any){
       // await page.getByRole('button', { name: 'Sign Contract' }).click();
    // await page.locator('div').filter({ hasText: /^Fit 8 Plan \(Manduu Oklahoma\)$/ await page.getByRole('button', { name: 'Sign Contract' }).click();}).click();
    //await page.locator('div').filter({ hasText: /^Unlimi- Fit Plan Best Value \*H \(Manduu Houston\)$/ }).click();
    //await page.locator('div').filter({ hasText: /^Test Kenn Konlan$/ }).first().click()
    //await page.locator('div').filter({ hasText: /^rich_template$/ }).first().click();
    await page.locator('div').filter({ hasText: /^Fit 8 Plan$/ }).click();


  
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
    
  
    
    await page.getByRole('button', { name: ' Sign' }).click();
    //await page.getByRole('button', { name: 'Complete Onboarding' }).click();
    //await page.goto('https://newpwa.manduu.app/app/client/dashboard');

       }
      

       export async function findAndClickEvent(page: any,  lName: string) {
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
      async function login(page:any,email: string,){
        await page.goto('https://newpwa.manduu.app/account/login');
      //await page.getByPlaceholder('Username Or Email *').fill(email);
      await page.getByPlaceholder('Email or Phone Number *').fill(email);

      
      await page.getByPlaceholder('Password *').fill(password);
        await page.getByRole('button', { name: 'Log In' }).click();
       
       }

//await page.getByRole('button', { name: 'Complete Onboarding' }).click();
     