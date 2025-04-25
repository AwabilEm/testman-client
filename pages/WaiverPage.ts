// pages/WaiverPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WaiverPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async signWaiver() {
    await this.page.click('.signature-pad-canvas');
    
    await this.page.locator('input[name="table1q1"]').nth(1).check();
    await this.page.locator('input[name="table1q2"]').nth(1).check();
    await this.page.locator('input[name="table1q3"]').nth(1).check();
    await this.page.locator('input[name="table1q4"]').nth(1).check();
    await this.page.getByRole('button', { name: 'Sign Here' }).click();
    
    await this.page.locator('input[name="table2q1"]').nth(1).check();
    await this.page.locator('input[name="table2q2"]').nth(1).check();
    await this.page.locator('input[name="table2q3"]').nth(1).check();
    await this.page.locator('input[name="table2q4"]').nth(1).check();
    await this.page.locator('input[name="table2q5"]').nth(1).check();
    await this.page.locator('input[name="table2q6"]').nth(1).check();
    await this.page.locator('input[name="table2q7"]').nth(1).check();
    await this.page.locator('input[name="table2q8"]').nth(1).check();
    await this.page.getByRole('button', { name: 'Click To Sign' }).first().click();
    
    await this.page.locator('input[name="table3q1"]').nth(1).check();
    await this.page.locator('input[name="table3q2"]').nth(1).check();
    await this.page.locator('input[name="table3q3"]').nth(1).check();
    await this.page.locator('input[name="table3q4"]').nth(1).check();
    await this.page.getByRole('button', { name: 'Click To Sign' }).nth(1).click();
    
    await this.page.locator('div').filter({ hasText: /^Draw SignatureClick To Sign$/ }).getByRole('button').click();
    await this.page.getByRole('button', { name: '     Sign' }).click();

    await this.waitForTimeout(2000);

  }
}
