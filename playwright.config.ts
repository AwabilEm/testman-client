import { defineConfig, devices } from '@playwright/test';


require('dotenv').config();

export default defineConfig({
  testDir: './tests',
  timeout: 500 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['dot'],
    ['list'],
    // ['allure-playwright'],
  ],
  
 
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  screenshot: 'only-on-failure',
  trace: 'on',
  video: 'on'
  },


  projects: [
    
    {
      name: 'setup',
      testDir: './',
      testMatch: 'global-setup.ts',
     },
     
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'],storageState: './LoginAuthCQ.json'},
    },

    
  ],

 
  
});
