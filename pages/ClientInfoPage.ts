// pages/ClientInfoPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClientInfoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async completeClientInfo() {
    await this.page.locator('div').filter({ hasText: /^Heigh\(Feet\) \*Selected Inch4567$/ }).getByRole('combobox').selectOption('7');
    await this.page.locator('div').filter({ hasText: /^Heigh\(Inches\) \*Selected Height01234567891011$/ }).getByRole('combobox').selectOption('7');
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').click();
    await this.page.locator('man-input').filter({ hasText: 'First Name *' }).getByRole('textbox').fill('testem');
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').click();
    await this.page.locator('man-input').filter({ hasText: 'Last Name *' }).getByRole('textbox').fill('lastname');
    await this.page.locator('div').filter({ hasText: /^Phone Number \*$/ }).getByRole('textbox').click();
    await this.page.locator('div').filter({ hasText: /^Phone Number \*$/ }).getByRole('textbox').fill('(094) 847-6363');
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
  }
}