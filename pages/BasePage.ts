// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async navigate(url: string) {
    await this.page.goto(url);
  }
  
  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }
  
  async handlePopups() {
    try {
      const popup = await this.page.waitForSelector('.swal2-popup', { timeout: 5000 });
      const errorMessage = await popup.$eval('.swal2-html-container', element => element.textContent);
      console.log('Error message:', errorMessage);
      
      await this.page.evaluate(() => {
        const confirmButton = document.querySelector('.swal2-confirm');
        if (confirmButton) {
          (confirmButton as HTMLButtonElement).click();
        }
      });
    } catch (error) {
      console.log('No popup appeared or error encountered');
    }
  }
}