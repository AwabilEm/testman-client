import { test, expect } from '@playwright/test';

test('ContractPages',async({page})=>{
  await page.goto('https://admin.manduu.app/app/main/dashboard')


  await page.getByRole('link', { name: 'Contract' }).click();
  await page.getByRole('link', { name: ' All Contracts' }).click();
  await expect(page.locator('h2')).toContainText('Contract');
  await expect(page.locator('app-main-page')).toContainText('Create New Contract');
});







 
  
  
  
test.describe('Creating new contract', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.manduu.app/app/main/contracts/all-contracts')

    })
    test('ensure all filed to create a new contract are available',async({page})=>{

        await page.getByRole('button', { name: 'Create New Contract' }).click();
    
    });
    test('creating a new contract, starting with the General info', async({page})=>{
    
    
    await page.locator('app-contract-template-selector').getByPlaceholder('Search...').fill('Unlimifit OK');
    await 
    await page.locator('app-client-selector').getByPlaceholder('Search...').fill('kenn@kennpalm.com');
    // await page.locator('app-date-picker').filter({ hasText: 'Start date *' }).getByRole('button').click();
    await page.getByLabel('Start date *').fill('06/20/2024');
    await page.getByLabel('End date *').fill('06/20/2024');
    await page.getByLabel('Active').click();
    
    await page.locator('app-general-info div').filter({ hasText: 'Contract Template * Pick' }).first().click();
    
    await page.getByLabel('Billing start date').fill('06/20/2024');
    await page.getByLabel('Select Option').click();
    await page.getByText('Yes').click();
    });
    
    test('Moving to contract term section in the contract creation',async({page})=>{
        
        await page.getByLabel('Initial Fees').fill('5');
       
        await page.getByLabel('Pause contract on this date').click();
        await page.getByRole('button', { name: '›' }).click();
        await page.getByText('16', { exact: true }).click();
        await page.getByLabel('Cancel contract on this date').click();
        await page.getByRole('button', { name: '›' }).click();
        await page.getByRole('gridcell', { name: '11' }).first().click();
        await page.getByLabel('Restart contract on this date').click();
    
        await page.locator('app-input').filter({ hasText: 'Session cost' }).locator('#face-value').fill('5');
       
        await page.locator('#kt_app_main textarea').fill('testing this app, will be deleted after creation');
        await page.getByText('Contract Adminstrations').click();
        await page.getByLabel('Date frozen').click();
        await page.getByRole('gridcell', { name: '30' }).nth(1).click();
        await page.getByLabel('Date cancelled').click();
        await page.getByLabel('Memo').fill('test');
        await page.getByLabel('Initial note').click();
        await page.getByLabel('Initial note').fill('test note');
        await page.getByLabel('Audit Note').click();
        await page.getByLabel('Audit Note').fill('audit note');
        await page.getByRole('button', { name: 'Save' }).click();
       
        await page.getByRole('textbox', { name: 'Search...' }).fill('kenn');
        await page.getByRole('row', { name: 'Action  Unlimifit OK kenn' }).locator('#dropdownButton').click();
        await page.getByRole('menuitem', { name: 'Edit' }).click();
        await page.getByLabel('Start date *').click();
        await page.getByText('21', { exact: true }).click();
        await page.locator('#pn_id_56').getByRole('combobox').click();
        await page.getByLabel('Active', { exact: true }).click();
        
       
        
    });
    test('moving to Administration section in the contract creation',async({page})=>{
        await page.getByText('Contract Adminstrations').click();
        await page.locator('#kt_app_main').getByText('Invoices').click();
        await page.getByText('Sessions', { exact: true }).click();
        await page.getByText('Billing Cycle').click();
        await page.getByRole('button', { name: 'Save' }).click();
    
    });
    

});
