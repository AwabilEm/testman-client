// pages/StudioSelectionPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudioSelectionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async selectStudio(studio: string) {
    await this.page.selectOption('select[formcontrolname="studioId"]', { label: studio });
  }
}
