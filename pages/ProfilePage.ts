
// pages/ProfilePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async completeProfile() {
    await this.page.getByRole('button', { name: 'Complete Profile' }).first().click();
  await this.page.getByRole('combobox').first().selectOption('Female');
  // await page.locator('div').filter({ hasText: /^CountrySelect CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');
  
    await this.page.locator('div').filter({ hasText: /^Country \*Select CountryCanadaMexicoUnited States$/ }).getByRole('combobox').selectOption('United States');
    await this.page.getByRole('combobox').nth(2).selectOption('Tennessee');

  // await page.getByRole('combobox').nth(2).selectOption('Alabama');
  await this.page.locator('man-input').filter({ hasText: 'City *' }).getByRole('textbox').fill('Accra');
  await this.page.locator('man-input').filter({ hasText: 'Zip Code *' }).getByRole('textbox').fill('11451');
  await this.page.locator('man-input').filter({ hasText: 'Street *' }).getByRole('textbox').fill('accra');
  await this.page.getByRole('button', { name: 'Save' }).click();

  }
}