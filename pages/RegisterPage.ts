import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    console.log('Navigating to the registration page...');
    await super.navigate('https://newpwa.manduu.app/account/register');
    console.log('Navigation to the registration page completed.');
  }

  async fillPersonalInformation(firstName: string, lastName: string, email: string, phoneNumber: string, password: string) {
    await this.page.goto('https://newpwa.manduu.app/account/register');

    console.log('Filling personal information...');
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill(firstName);
    console.log(`First Name filled: ${firstName}`);
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill(lastName);
    console.log(`Last Name filled: ${lastName}`);
    await this.page.getByRole('textbox').nth(2).fill(email);
    console.log(`Email filled: ${email}`);
    await this.page.getByRole('textbox').nth(3).fill(email);
    await this.page.getByRole('button', { name: 'Continue ' }).click();

    console.log('Selecting date of birth...');
    await this.page.getByRole('button', { name: '' }).click();
    await this.page.getByRole('combobox').first().selectOption('9');
    await this.page.getByRole('combobox').nth(1).selectOption('3');
    await this.page.getByRole('combobox').nth(2).selectOption('2000');
    await this.page.getByRole('button', { name: 'Set Date' }).click();
    console.log('Date of birth selected.');

  //     await page.getByRole('button', { name: '' }).click();
  // await page.getByRole('combobox').first().selectOption('9');
  // await page.getByRole('combobox').nth(1).selectOption('3');
  // await page.getByRole('combobox').nth(2).selectOption('2000');
  // await page.getByRole('button', { name: 'Set Date' }).click();

    console.log('Filling phone number...');
    await this.page.getByRole('textbox').nth(1).fill(phoneNumber);
    console.log(`Phone Number filled: ${phoneNumber}`);
    await this.page.getByRole('textbox').nth(1).click({ button: 'right' });
    await this.page.getByRole('textbox').nth(1).click({ button: 'right' });
    await this.page.getByRole('dialog').locator('div').nth(2).click();
    await this.page.getByRole('button', { name: 'I Agree' }).click();

    console.log('Filling password...');
    await this.page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(password);
    await this.page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill(password);
    console.log('Password filled.');

    await this.page.getByRole('button', { name: 'Continue' }).click();
    console.log('Personal information filled and submitted.');
  }

  async validateRequiredFields() {
    console.log('Validating required fields...');

    const firstNameError = await this.page.locator('text=First Name is required').isVisible();
    const lastNameError = await this.page.locator('text=Last Name is required').isVisible();
    const emailError = await this.page.locator('text=Email is required').isVisible();
    const phoneError = await this.page.locator('text=Phone Number is required').isVisible();
    const passwordError = await this.page.locator('text=Password is required').isVisible();

    console.log('Validation results:');
    console.log(`First Name Error: ${firstNameError}`);
    console.log(`Last Name Error: ${lastNameError}`);
    console.log(`Email Error: ${emailError}`);
    console.log(`Phone Number Error: ${phoneError}`);
    console.log(`Password Error: ${passwordError}`);
  }

  async validateInvalidEmail() {
    console.log('Validating invalid email...');
    
    // Fill first name and last name
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('Test');
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('User');
  
    // Fill the first email field with invalid email
    await this.page.getByRole('textbox').nth(2).fill('invalid-email');
  
    // Check if the second email textbox exists before trying to fill it
    const secondEmailField = this.page.getByRole('textbox').nth(3);
    if (await secondEmailField.isVisible()) {
      console.log('Second email field is visible, filling it...');
      await secondEmailField.fill('invalid-email');
    } else {
      console.log('Second email field is NOT visible, skipping...');
    }
  
    // Expect the form to contain "Invalid email."
    await expect(this.page.locator('form')).toContainText('Invalid email.');
   

    console.log('Locating Continue button...');
  const continueButton = this.page.getByRole('button', { name: /Continue/i });
  continueButton.click();
  console.log('Checking if Continue button is visible...');
  await expect(continueButton).toBeVisible();
  
  const isDisabled = await continueButton.isDisabled();
  
  if (isDisabled) {
    console.log('Continue button is currently DISABLED.');
  } else {
    console.log('Continue button is currently ENABLED.');
  }

  console.log('Verifying we are still on the form page...');
 

    
    // Check for the detailed error message
    await expect(this.page.getByRole('heading', { name: 'Welcome! Create your Account' })).toBeVisible();

    console.log('Email validation passed...');

  }
  
 

  async validatePasswordMismatch() {
    console.log('Validating password mismatch...');
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('Test');
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('User');
    await this.page.getByRole('textbox').nth(2).fill('test.user@example.com');
    await this.page.getByRole('textbox').nth(3).fill('test.user@example.com');
    await this.page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill('Password123');
    await this.page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill('DifferentPassword');
   // await expect(this.page.locator('app-root')).toContainText('Passwords do not match');
    console.log('Locating Continue button...');
    const continueButton = this.page.getByRole('button', { name: /Continue/i });
    continueButton.click();
    console.log('Checking if Continue button is visible...');
    await expect(continueButton).toBeVisible();
    
    const isDisabled = await continueButton.isDisabled();
    
    if (isDisabled) {
      console.log('Continue button is currently DISABLED.');
    } else {
      console.log('Continue button is currently ENABLED.');
    }
    await this.page.getByRole('textbox').nth(1).click();

    const passwordError = await this.page.locator('text=Passwords do not match').isVisible();
    console.log(`Password Mismatch Error: ${passwordError}`);
    // await this.page.getByRole('button', { name: 'Continue     ' }).click();

  await this.page.getByRole('button', { name: 'Previous' }).click();
    console.log('Password mismatch validation completed.');
  }


}