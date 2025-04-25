// pages/MedicalConditionsPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MedicalConditionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async signMedicalConditions() {
    await this.page.getByLabel('No').first().check();
    await this.page.click('input[type="radio"][name="pregnant"][value="No"]');
    await this.page.getByLabel('No').nth(2).check();
    await this.page.getByLabel('No').nth(3).check();
    await this.page.getByRole('button', { name: 'No, I do not have any of' }).click();
  }
}