
// pages/MarketingPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MarketingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async completeMarketingSurvey() {
    await this.page.locator('li').filter({ hasText: 'Print Magazine' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Radio' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'TV' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Social media' }).getByRole('checkbox').check();
    await this.page.getByText('Print Magazine Radio TV').click();
    await this.page.getByText('Google/Internet').click();
    await this.page.locator('li').filter({ hasText: 'Mobile Ad' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Google/Internet' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Direct mail' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Email' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Saw Studio' }).getByRole('checkbox').check();
    await this.page.locator('li').filter({ hasText: 'Referral' }).getByRole('checkbox').check();
    await this.page.getByRole('list').locator('li').filter({ hasText: 'Other' }).getByRole('checkbox').check();
    await this.page.getByTitle('How did you hear about us?').getByRole('textbox').fill('through a movie');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}