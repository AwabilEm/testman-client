import { test, expect, Page } from '@playwright/test';

// Utility function to delete a staff member
export async function deleteStaffMember(
    page: Page,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    studioName: string,
    expectedWarningText: string
) {
    console.log('Navigating to dashboard...');
    await page.goto('https://admin.manduu.app/app/main/dashboard');

    console.log('Filling in the search field with email:', email);
    await page.getByRole('textbox', { name: 'Search Client' }).fill(email);

    console.log('Clicking the search button...');
    await page.getByRole('button', { name: '' }).click();

    console.log('Waiting for the table rows to load...');
    await page.waitForSelector('#main-page-table-container tbody.p-element.p-datatable-tbody', { state: 'visible' });

    // Optionally, add a small timeout to allow table content to load
    await page.waitForTimeout(5000); // Wait for 5 seconds

    const table = await page.locator('#main-page-table-container tbody.p-element.p-datatable-tbody');
    const tableContent = await table.innerText();

    if (!tableContent || tableContent.includes("There's no data available")) {
        console.error('Table is empty or not found.');
        throw new Error('Table is empty or not found.');
    } else {
        console.log('Table contents:', tableContent);  // Log the entire table contents for debugging
    }

    const rows = await page.$$('tbody.p-element.p-datatable-tbody tr');
    let rowToClick: any = null;

    console.log('Iterating through table rows to find a match...');
    
    for (const row of rows) {
        const rowText = await row.innerText();
        console.log('Row text:', rowText);  // Log the text of each row for debugging

        // Check if all the necessary information is present in the row
        if (
            rowText.includes(firstName) &&
            rowText.includes(lastName) &&
            rowText.includes(email) &&
            rowText.includes(phoneNumber) &&
            rowText.includes(studioName)
        ) {
            rowToClick = row;
            break;
        }
    }

    if (!rowToClick) {
        console.error('No matching row found for the specified details.');
        throw new Error('No matching row found.');
    }

    console.log(`Row found: ${firstName} ${lastName}, ${email}, ${phoneNumber}, ${studioName}`);

    console.log('Locating the action button in the row...');
    const actionButton = await rowToClick.$('button.bg-primary-green.text-white.px-2.py-1.rounded-md.btn-sm.min-w-max');
    if (!actionButton) {
        console.error('Action button not found in the row.');
        throw new Error('Action button not found.');
    }

    console.log('Clicking the action button...');
    await actionButton.click();

    console.log('Selecting the "Delete" option from the dropdown...');
    const deleteOption = await page.getByRole('menuitem', { name: 'Delete' });
    if (!deleteOption) {
        console.error('Delete option not found.');
        throw new Error('Delete option not found.');
    }
    await deleteOption.click();

    console.log('Validating the warning message...');
    const warningMessageElement = await page.$('div.modal-body p.text-xl');
    if (!warningMessageElement) {
        console.error('Warning message element not found.');
        throw new Error('Warning message not found.');
    }

    const warningMessageText = await warningMessageElement.innerText();
    console.log('Warning message displayed:', warningMessageText);

    // Ensure the warning message contains the full name (first and last name)
    if (!warningMessageText.includes(firstName) || !warningMessageText.includes(lastName)) {
        console.error('Warning message does not contain the full name.');
        throw new Error('Warning message does not contain the full name.');
    }

    console.log('Confirming the deletion...');
    const confirmButton = await page.getByRole('button', { name: 'Yes' });
    if (!confirmButton) {
        console.error('Confirmation button not found.');
        throw new Error('Confirmation button not found.');
    }
    await confirmButton.click();

    console.log('Staff member deletion confirmed.');
}

// Test data
const firstName = 'test';
const lastName = 'automate';
const email = 'awabil.test1@gmail.com';
const phoneNumber = '8000000001';
const studioName = 'Downtown Franklin';
const expectedWarningText = 'will be deleted';

// Main test
// test('Delete test user by email and other details with full name validation', async ({ page }) => {
//     console.log('Starting test: Delete user by email and other details with full name validation');
//     await deleteStaffMember(page, firstName, lastName, email, phoneNumber, studioName, expectedWarningText);
//     console.log(`Test completed successfully: Delete the new created client; ${email} and other details with full name validation`);
// });
