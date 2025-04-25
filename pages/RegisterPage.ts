// pages/RegisterPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async navigate() {
   // await super.navigate('/account/register');
    await super.navigate('https://newpwa.manduu.app/account/register');
  }
  
  async fillPersonalInformation(firstName: string, lastName: string, email: string, phoneNumber: string, password: string) {
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill(firstName);
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill(lastName);
    await this.page.getByRole('textbox').nth(2).fill(email);
    await this.page.getByRole('textbox').nth(3).fill(email);
    await this.page.getByRole('button', { name: 'Continue ' }).click();
    
    // Date of birth selection
   // Set birthdate
   await this.page.getByRole('button', { name: '' }).click();
   await this.page.getByRole('combobox').first().selectOption('9');
   await this.page.getByRole('combobox').nth(1).selectOption('3');
   await this.page.getByRole('combobox').nth(2).selectOption('2000');
   await this.page.getByRole('button', { name: 'Set Date' }).click();
    
    // Phone number
    await this.page.getByRole('textbox').nth(1).fill(phoneNumber);
    await this.page.getByRole('textbox').nth(1).click({ button: 'right' });
    await this.page.getByRole('textbox').nth(1).click({ button: 'right' });
    await this.page.getByRole('dialog').locator('div').nth(2).click();
    await this.page.getByRole('button', { name: 'I Agree' }).click();
    
    // Password
    await this.page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(password);
    await this.page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill(password);
    
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}