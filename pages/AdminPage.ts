
// pages/AdminPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async navigate() {
    await super.navigate('https://admin.manduu.app/app/main/dashboard');
  }
  
  async navigateToSessionCalendar() {
    await this.page.getByRole('link', { name: 'Session Calendar' }).click();
  }
  
  async filterSessionsByDate(date: string) {
    await this.page.fill('[formcontrolname="selectedDate"]', date);
  }
  
  async selectStudio(studio: string) {
    await this.page.getByRole('button', { name: 'Select studio ' }).click();
    await this.page.locator('.dropdown-item', { hasText: studio }).click();
    await this.page.waitForTimeout(4000);
    await this.page.getByRole('button', { name: 'Refresh' }).click();
  }
  
  async selectClientAppointment(firstName: string, lastName: string, time: string) {
    try {
      await this.page.locator(`div.fc-event-custom-info:has-text("${time}")`)
        .filter({ hasText: `${firstName} ${lastName}` })
        .click();
    } catch (error) {
      console.error(`Event not found for client ${firstName} ${lastName}`);
    }
  }
  
  async executeFirstAppointment() {
    await this.page.locator('app-dropdown[placeholder="Type"] .p-dropdown-trigger').click();
    await this.page.locator('.p-dropdown-item:has-text("First Appointment")').click();

    await this.page.locator('app-dropdown[placeholder="Status"] .p-dropdown-trigger').click();
    await this.page.getByLabel('Executed').click();
    await this.page.waitForTimeout(1000);

    await this.page.locator('app-dropdown[placeholder="Personal coach / Trainer"] .p-dropdown-trigger').click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.p-dropdown-item').filter({ hasText: /^Test Manduu$/ }).click();

    await this.page.locator('app-text-area').getByRole('textbox').fill(
      'This whole process has been automated, to make things faster and to avoid mistakes, this session will be deleted after the testing: So as part of the onboarding admin is supposed to execute a user first appointment'
    );
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(2000);
  }
}
