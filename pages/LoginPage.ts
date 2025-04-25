// pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async navigate() {
    await super.navigate('https://newpwa.manduu.app/account/login');
  }
  
  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Email or Phone Number *').fill(email);
    await this.page.getByPlaceholder('Password *').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }
}
