import test, {expect } from '@playwright/test';
 
    test('test', async ({page}) => {
        await page.goto('https://admin.manduu.app/account/login');
      await page.getByPlaceholder('Email Address or Phone Number').fill(process.env.NEWADUSERNAME!);
      await page.getByPlaceholder('Password').fill(process.env.NEWADPASSWORD!);
      await page.getByRole('button', { name: 'Login' }).click();
       await page.getByRole('heading', { name: 'Welcome, POSTestStaff' }).click();

      await expect(page.getByRole('heading', { name: 'Welcome, POSTestStaff' })).toBeVisible();
      
      await page.context().storageState({path: "./LoginAuthCQ.json"})
      });
  
  
  
 