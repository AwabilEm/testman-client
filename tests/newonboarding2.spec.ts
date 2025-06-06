import { test, expect } from '@playwright/test';
import { convertDate } from '../util/dateUtils.ts';
import { deleteStaffMember } from '../util/deletenew.ts';
import { checkHomeStudio } from '../util/homeStudioIsOnboarded.ts';
import { format } from 'date-fns';

// Test configuration constants
const randomPhone = `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;

const TEST_USER = {
  email: `test-${Date.now()}@example.com`, // dynamic email
  phoneNumber: randomPhone,
  password: 'TestUser@1',
  firstName: 'test',
  lastName: 'automate'
};


const TEST_CONFIG = {
  studio: 'Little Rock - Chenal',
  appointmentDate: '08/20/2025',
  expectedWarningText: 'will be deleted'
};

// Global state
let selectedTime: string | null = null;

let formattedAppointmentDate = convertDate(TEST_CONFIG.appointmentDate);

// Test suite
test.describe.serial('Client Onboarding and Management Flow', () => {
  test('Complete client onboarding process', async ({ page }) => {
    await page.goto('https://newpwa.manduu.app/account/register');

    // Step 1: Fill personal information and medical conditions
    await fillPersonalInformation(page);
    await signMedicalConditions(page);

    // Step 2: Select studio and schedule appointment
    await selectStudio(page, TEST_CONFIG.studio);
    await scheduleAppointment(page, TEST_CONFIG.appointmentDate);

    // Step 3: Complete profile setup
    await page.getByRole('button', { name: 'Next' }).click();
    await handlePopups(page);
    await completeProfile(page);
    await completeClientInfo(page);
    await howYouHearAboutUs(page);

    // Step 4: Sign waiver and confirm first appointment
    await signWaiver(page);
    await confirmFirstAppointment(page);
  });

  test('Execute first appointment', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('https://admin.manduu.app/app/main/dashboard');

    // Access session calendar
    await page.getByRole('link', { name: 'Session Calendar' }).click();

    // Set calendar filters
    await page.fill('[formcontrolname="selectedDate"]', formattedAppointmentDate);
    await selectStudioInAdmin(page, TEST_CONFIG.studio);

    // Refresh and find appointment
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'Refresh' }).click();


    await page.getByRole('searchbox', { name: 'Search...' }).fill(TEST_USER.firstName + ' ' + TEST_USER.lastName);
    await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
    await page.getByRole('searchbox', { name: 'Search...' }).click();

    // Find and click on the appointment
    await findAndClickAppointment(page, selectedTime, TEST_USER.firstName, TEST_USER.lastName);

    // Update appointment details
    await updateAppointmentDetails(page);
  });

  test('Complete onboarding on client side', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);
    await addPaymentCard(page);
    await signContract(page);
    //await agreement(page);
    await page.getByRole('button', { name: 'Complete Onboarding' }).click();
     await expect(page).toHaveURL('https://newpwa.manduu.app/app/client/dashboard', {
    timeout: 15000
  });

    
  });

  test('Verify studio and contract after onboarding', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);

    // Verify home studio
    const displayedStudio = await page.locator('text=Home Studio:').textContent();
    expect(displayedStudio).toContain(TEST_CONFIG.studio);

    // Check subscription page
    await page.getByRole('link', { name: 'Subscription' }).click();

    // Return to dashboard
    await page.goto('https://newpwa.manduu.app/app/client/dashboard');
  });
 test('Delete the first appointment booked', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('https://admin.manduu.app/app/main/dashboard');

    // Access session calendar
    await page.getByRole('link', { name: 'Session Calendar' }).click();

    // Set calendar filters
    await page.fill('[formcontrolname="selectedDate"]', formattedAppointmentDate);
    await selectStudioInAdmin(page, TEST_CONFIG.studio);

    // Refresh and find appointment
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'Refresh' }).click();


    await page.getByRole('searchbox', { name: 'Search...' }).fill(TEST_USER.firstName + ' ' + TEST_USER.lastName);
    await page.getByRole('searchbox', { name: 'Search...' }).press('Enter');
    await page.getByRole('searchbox', { name: 'Search...' }).click();

    // Find and click on the appointment
    await findAndClickAppointment(page, selectedTime, TEST_USER.firstName, TEST_USER.lastName);

    // Delete appointment 
    //await updateAppointmentDetails(page);
    await DeleteFirstAppointment(page, selectedTime);
  });
  test('Delete test user', async ({ page }) => {
    await deleteStaffMember(
      page,
      TEST_USER.firstName,
      TEST_USER.lastName,
      TEST_USER.email,
      TEST_USER.phoneNumber,
      TEST_CONFIG.studio,
      TEST_CONFIG.expectedWarningText
    );
  });
;

// Registration and onboarding functions
async function fillPersonalInformation(page) {
  // === Fill First & Last Name ===
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill(TEST_USER.firstName);
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill(TEST_USER.lastName);

  // === Fill email ===
  // await page.getByRole('textbox').nth(2).fill(TEST_USER.email);

  // const popupLocator = page.locator('#swal2-html-container');
  // const emailExists = await popupLocator.textContent()
  //   .then(text => text?.includes('Email address already taken'))
  //   .catch(() => false);

  // if (emailExists) {
  //   await page.getByRole('button', { name: 'Ok' }).click();

  //   // ✅ Update TEST_USER.email directly
  //   TEST_USER.email = `test-${Date.now()}@example.com`;
  //   await page.locator('input[type="email"]').fill(TEST_USER.email);
  //   await page.getByRole('textbox').nth(2).click(); // trigger revalidation
  //   await page.getByRole('textbox').nth(3).fill(TEST_USER.email);
  // }



    // ✅ Update TEST_USER.email directly
    await page.locator('input[type="email"]').fill(TEST_USER.email);
    await page.getByRole('textbox').nth(2).click(); // trigger revalidation
    await page.getByRole('textbox').nth(3).fill(TEST_USER.email);
  


  await page.getByRole('button', { name: 'Continue ' }).click();

  // === Set birthdate ===
  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('combobox').first().selectOption('9');
  await page.getByRole('combobox').nth(1).selectOption('3');
  await page.getByRole('combobox').nth(2).selectOption('2000');
  await page.getByRole('button', { name: 'Set Date' }).click();

  // === Fill phone number ===

  let phoneExists = false;
  try {
    await page.waitForSelector('text=Phone Number already exist', { timeout: 3000 });
    phoneExists = true;
  } catch (e) {
    phoneExists = false;
  }

  if (phoneExists) {
    // ✅ Update TEST_USER.phoneNumber directly
    TEST_USER.phoneNumber = '555' + Math.floor(1000000 + Math.random() * 8999999).toString();
    //await page.getByRole('textbox').nth(1).fill(TEST_USER.phoneNumber);
  }
  await page.getByRole('textbox').nth(1).fill(TEST_USER.phoneNumber);

  // === Agree to terms ===
  // await page.getByRole('textbox').nth(1).click({ button: 'right' });
  // await page.getByRole('textbox').nth(1).click({ button: 'right' });
  await page.getByRole('dialog').locator('div').nth(2).click();
  await page.getByRole('button', { name: 'I Agree' }).click();

  // === Set password ===
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(TEST_USER.password);
  await page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Continue' }).click();
}


async function signMedicalConditions(page) {
  await page.getByLabel('No').first().check();
  await page.click('input[type="radio"][name="pregnant"][value="No"]');
  await page.getByLabel('No').nth(2).check();
  await page.getByLabel('No').nth(3).check();
  await page.getByRole('button', { name: 'No, I do not have any of' }).click();
}

async function selectStudio(page, studioName) {
  await page.selectOption('select[formcontrolname="studioId"]', { label: studioName });
}

async function scheduleAppointment(page, appointmentDate) {
  // Fill in the scheduled date
  await page.fill('xpath=//input[@id="ScheduledDate"]', appointmentDate);
  await page.click('text="Start Time"');

  // Select available time slot
  await selectRandomTimeSlot(page);

  // Verify booking details
  await verifyBookingConfirmation(page, TEST_CONFIG.studio, appointmentDate, selectedTime);
}

async function selectRandomTimeSlot(page) {
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

  // Try to get time options with retries
  let attempts = 0;
  let availableTimes: string[] | null = null;
  while (attempts < 5 && !availableTimes) {
    availableTimes = await getTimeOptions();
    if (!availableTimes) {
      await page.waitForTimeout(1000);
      attempts++;
    }
  }

  if (availableTimes && availableTimes.length > 0) {
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
}

async function handlePopups(page) {
  try {
    const popup = await page.waitForSelector('.swal2-popup', { timeout: 5000 });
    const errorMessage = await popup.$eval('.swal2-html-container', element => element.textContent);
    console.log('Error message:', errorMessage);

    await page.evaluate(() => {
      const confirmButton = document.querySelector('.swal2-confirm');
      if (confirmButton) {
        (confirmButton as HTMLButtonElement).click();
      }
    });
  } catch (error) {
    console.log('No popup appeared or error occurred:', error);
  }
}

async function completeProfile(page) {
  await page.getByRole('button', { name: 'Complete Profile' }).first().click();
  await page.getByRole('combobox').first().selectOption('Female');
  // await page.locator('div').filter({ hasText: /^CountrySelect CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');

  await page.locator('div').filter({ hasText: /^Country \*Select CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');
  await page.getByRole('combobox').nth(2).selectOption('Tennessee');

  // await page.getByRole('combobox').nth(2).selectOption('Alabama');
  await page.locator('man-input').filter({ hasText: 'City *' }).getByRole('textbox').fill('Accra');
  await page.locator('man-input').filter({ hasText: 'Zip Code *' }).getByRole('textbox').fill('11451');
  await page.locator('man-input').filter({ hasText: 'Street *' }).getByRole('textbox').fill('accra');
  await page.getByRole('button', { name: 'Save' }).click();

}

async function completeClientInfo(page) {


  await page.locator('div').filter({ hasText: /^Heigh\(Feet\) \*Selected Inch4567$/ }).getByRole('combobox').selectOption('7');
  await page.locator('div').filter({ hasText: /^Heigh\(Inches\) \*Selected Height01234567891011$/ }).getByRole('combobox').selectOption('7');
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').click();
  await page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('testem');
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').click();
  await page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('lastname');
  await page.locator('div').filter({ hasText: /^Phone Number \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Phone Number \*$/ }).getByRole('textbox').fill('(094) 847-6363');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

}

async function howYouHearAboutUs(page) {
  const checkboxes = [
    'Print Magazine', 'Radio', 'TV', 'Social media', 'Mobile Ad',
    'Google/Internet', 'Direct mail', 'Email', 'Saw Studio', 'Referral', 'Other'
  ];

  for (const option of checkboxes) {
    await page.locator('li').filter({ hasText: option }).getByRole('checkbox').check();
  }

  await page.getByTitle('How did you hear about us?').getByRole('textbox').fill('through a movie');
  await page.getByRole('button', { name: 'Submit' }).click();
}

async function signWaiver(page) {
  await page.click('.signature-pad-canvas');

  // First section
  await page.locator('input[name="table1q1"]').nth(1).check();
  await page.locator('input[name="table1q2"]').nth(1).check();
  await page.locator('input[name="table1q3"]').nth(1).check();
  await page.locator('input[name="table1q4"]').nth(1).check();
  await page.getByRole('button', { name: 'Sign Here' }).click();

  // Second section
  const table2Questions = ['table2q1', 'table2q2', 'table2q3', 'table2q4',
    'table2q5', 'table2q6', 'table2q7', 'table2q8'];
  for (const q of table2Questions) {
    await page.locator(`input[name="${q}"]`).nth(1).check();
  }
  await page.getByRole('button', { name: 'Click To Sign' }).first().click();

  // Third section
  const table3Questions = ['table3q1', 'table3q2', 'table3q3', 'table3q4'];
  for (const q of table3Questions) {
    await page.locator(`input[name="${q}"]`).nth(1).check();
  }
  // await page.getByRole('button', { name: 'Click To Sign' }).nth(1).click();

  // // Final signature
  // await page.locator('div').filter({ hasText: /^Draw SignatureClick To Sign$/ }).getByRole('button').click();
  // //await page.getByRole('button', { name: ' Sign' }).click();
  // await this.page.getByRole('button', { name: '     Sign' }).click();
  // await page.getByRole('button', { name: ' Sign' }).click();



  await page.getByRole('button', { name: 'Click To Sign' }).nth(1).click();
  await page.locator('div').filter({ hasText: /^Draw SignatureClick To Sign$/ }).getByRole('button').click();
  //await this.page.getByRole('button', { name: '     Sign' }).click();

  await page.getByRole('button', { name: ' Sign' }).click();
  console.log('Sign Medical waiver documents test completed...');
     await page.waitForTimeout(2000);


}

async function confirmFirstAppointment(page) {
  const continueButton = page.getByRole('button', { name: 'Continue' });
  await continueButton.click();
 // await continueButton.click();

}

// Admin functions
async function selectStudioInAdmin(page, studioName) {
  await page.getByRole('button', { name: 'Select studio ' }).click();
  await page.locator('.dropdown-item', { hasText: studioName }).click();
}

async function findAndClickAppointment(page, time, firstName, lastName) {
  try {
    console.error(`Selected time: ${time}`);

    await page.locator(`div.fc-event-custom-info:has-text("${time}")`)
      .filter({ hasText: `${firstName} ${lastName}` })
      .click();
    console.log(`Clicked on the event with time ${time} and client ${firstName} ${lastName}.`);
  } catch (error) {
    console.error('Event not found or not clickable:', error);
    console.error(`Selected time: ${time}`);
    console.error(`Client details: ${firstName} ${lastName}`);
  }
}

async function updateAppointmentDetails(page) {
  // Set appointment type
  await page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
  await page.locator('.p-dropdown-item:has-text("First Appointment")').click();

  // Set status to Executed
  await page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
  await page.getByLabel('Executed').click();
  await page.waitForTimeout(1000);

  // Select trainer
  await page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
  await page.waitForTimeout(1000);
  await page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();

  // Add memo and save
  await page.locator('app-text-area').filter({ hasText: 'Client Memo *' }).getByRole('textbox')
    .fill('This whole process has been automated, to make things faster and to avoid mistakes, this session will be deleted after the testing: So as part of the onboarding admin is supposed to execute a user first appointment');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);
}
async function DeleteFirstAppointment(page, selectedTime) {
const formattedPopupDate = format(new Date(TEST_CONFIG.appointmentDate), 'MMM dd, yyyy'); // 'Aug 20, 2025'

  
  //test-1749181558720@example.com
//let formattedAppointmentDate = convertDate(TEST_CONFIG.appointmentDate);
await expect(page.getByRole('textbox', { name: 'Scheduled Date' })).toHaveValue(formattedAppointmentDate);
//await expect(page.getByRole('textbox', { name: 'Scheduled Date' })).toHaveValue(TEST_CONFIG.appointmentDate);
  // await expect(page.getByRole('textbox', { name: 'Scheduled Time' })).toHaveValue(selectedTime);
 const scheduledTime = await page.getByRole('textbox', { name: 'Scheduled Time' }).inputValue();
expect(scheduledTime.replace(/^0/, '')).toBe(selectedTime);

  await expect(page.getByRole('textbox', { name: 'Client Email' })).toHaveValue(TEST_USER.email);
  await expect(page.getByRole('textbox', { name: 'Client Phone Number' })).toHaveValue(TEST_USER.phoneNumber);
  await expect(page.locator('#selectedClient')).toContainText('Test Automate');
  await page.getByRole('button', { name: 'Delete' }).click();
  // await expect(page.locator('#swal2-title')).toContainText('Delete Client Session for test automate : Aug 20, 2025 3:30 PM');
const expectedPopupText = `Delete Client Session for test automate : ${formattedPopupDate} ${selectedTime}`;
await expect(page.locator('#swal2-title')).toContainText(expectedPopupText.trim());


// const expectedPopupText = `Delete Client Session for test automate : ${TEST_CONFIG.appointmentDate} ${selectedTime}`;
// await expect(page.locator('#swal2-title')).toContainText(expectedPopupText);

  await page.getByRole('button', { name: 'Yes' }).click();
  await page.waitForTimeout(2000);

  
}

// Client-side functions
async function login(page, email, password) {
  await page.goto('https://newpwa.manduu.app/account/login');
  await page.getByPlaceholder('Email or Phone Number *').fill(email);
  await page.getByPlaceholder('Password *').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
}

async function addPaymentCard(page) {
  await page.getByTitle('Add Your Card').locator('input[type="text"]').fill('TESTER CARD');
  await page.locator('#cc-number').first().fill('4916186141125817');
  await page.locator('#cc-exp-date').fill('06 / 2026');
  await page.locator('#cc-number').nth(1).fill('546');
  await page.getByRole('button', { name: 'Authorize' }).click();
}

async function signContract(page) {
  await page.locator('div').filter({ hasText: /^Fit 4 Plan$/ }).click();

  // await page.locator('div').filter({ hasText: /^Fit 6 Plan$/ }).click();
   //await page.locator('div').filter({ hasText: /^Fit 8 Plan$/ }).click();
    // await page.locator('div').filter({ hasText: /^Fit 12 Plan$/ }).click();

//  await page.locator('div').filter({ hasText: /^Flex 10 Pack$/ }).click();

  // await page.locator('div').filter({ hasText: /^Unlimifit Plan$/ }).click();

  await page.getByTitle('Sign Contract').locator('canvas').click({
    position: { x: 106, y: 42 }
  });

  //await page.getByRole('button', { name: '     Sign' }).click();
await page.getByRole('button', { name: '     Sign' }).click();

 
}


async function agreement(page) {
  await page.getByRole('button', { name: 'Client Agreement' }).click();


  await page.getByRole('checkbox', { name: 'AUTO RENEW' }).check();
  await page.getByRole('checkbox', { name: '-DAY CANCELLATION NOTICE' }).check();
  await page.getByRole('checkbox', { name: 'PLAN GIVES ACCESS TO TRAINING' }).check();
  await page.getByRole('checkbox', { name: 'SESSIONS DON’T ROLL OVER' }).check();
  await page.getByRole('checkbox', { name: '-SESSION ADAPTATION PERIOD' }).check();
  await page.getByRole('checkbox', { name: 'USE ANY MANDUU IN THE COMPANY' }).check();
  await page.getByRole('checkbox', { name: 'ARRIVE 15 MINUTES EARLY' }).check();


  await page.getByTitle('Manduu Agreement Check list').locator('canvas').click({
    position: {
      x: 110,
      y: 46
    } 
  });
  await page.getByRole('button', { name: 'SAVE CHANGES' }).click();


  
}

// Utility functions
async function verifyBookingConfirmation(page, studio, date, time) {
  await page.waitForLoadState('domcontentloaded');

  try {
    const confirmationModal = page.locator('.ng-tns-c3831901633-3');
    await confirmationModal.waitFor({ state: 'visible', timeout: 5000 });

    const confirmationText = await confirmationModal.locator('p.w-[68%]:nth-child(3)').textContent();

    if (confirmationText) {
      expect(confirmationText).toContain(studio);
      expect(confirmationText).toContain(date);

      if (time) {
        expect(confirmationText).toContain(time);
      }
    } else {
      console.error('No confirmation text found in the modal.');
    }
  } catch (error) {
    console.error('Error verifying booking confirmation:', error);
  }
}


})