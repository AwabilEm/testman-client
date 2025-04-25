// pages/ContractPage.ts
import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContractPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async signContract() {
    await this.page.locator('div').filter({ hasText: /^Fit 8 Plan$/ }).click();
    
    await this.page.getByTitle('Sign Contract').locator('canvas').click({
      position: {
        x: 109,
        y: 56
      }
    });
    
    await this.page.getByTitle('Sign Contract').locator('canvas').click({
      position: {
        x: 152,
        y: 54
      }
    });
    
    await this.page.getByRole('button', { name: '     Sign' }).click();
    await this.page.getByRole('button', { name: 'Complete Onboarding' }).click();

      await expect(this.page).toHaveURL('https://newpwa.manduu.app/app/client/dashboard', {
        timeout: 15000
      });
  }
}


