import { test, expect } from '@playwright/test';
test('test contract',async({page})=>{

    await page.goto('https://admin.manduu.app/app/main/contracts/all-contracts')
   
    await page.getByRole('link', { name: 'Contract', exact: true }).click();
    await page.getByRole('link', { name: ' All Contracts' }).click();
    await expect(page.getByRole('textbox', { name: 'Search...' })).toBeEmpty();
    await expect(page.locator('#pn_id_25').getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create New Contract' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contract' })).toBeVisible();
    await expect(page.getByText('Actions Name Client Client Email Phone Studio ontract LARGE Michelle Stephens chellebelle0@gmail.com 6153903442 Nashville/Green Hills Action Edit Make active billing contract View contract Waiver Template Test Manduu testmanduu4@gmail.com 8004437227 Little Rock - Chenal Action Edit Make active billing contract View contract LARGE Test Manduu testmanduu4@gmail.com 8004437227 Little Rock - Chenal Action Edit Make active billing contract View contract Waiver Template Michelle Stephens chellebelle0@gmail.com 6153903442 Nashville/Green Hills Action Edit Make active billing contract View contract LARGE Michelle Harrison morrissetteharrison@yahoo 4056648308 Edmond Oklahoma Rows per page: 20201 - 20 of 45863 1 2 3 4')).toBeVisible();
    await page.getByRole('button', { name: 'Create New Contract' }).click();
    await expect(page.getByText('Create Contract')).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Clients' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Invoice' })).toBeVisible();
    await expect(page.getByLabel('Contract Template *')).toBeVisible();
    await expect(page.getByLabel('Contract Template *')).toBeEmpty();
    await expect(page.getByLabel('Client *')).toBeEmpty();
    await expect(page.getByLabel('Start date *')).toBeEmpty();
    await expect(page.getByLabel('Billing start date')).toBeEmpty();
    await page.getByLabel('Select Option').click();
    await expect(page.getByLabel('Billing start date')).toBeVisible();
    
});

