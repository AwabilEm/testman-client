// pages/PaymentPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async addCard() {
    await this.page.getByTitle('Add Your Card').locator('input[type="text"]').fill('TESTER CARD');
    await this.page.locator('#cc-number').first().fill('4916186141125817');
    await this.page.locator('#cc-exp-date').fill('06 / 2026');
    await this.page.locator('#cc-number').nth(1).fill('546');
    await this.page.getByRole('button', { name: 'Authorize' }).click();
  }
}