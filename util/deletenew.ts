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

    await page.waitForTimeout(5000); // Allow some time for content to load

    const table = await page.locator('#main-page-table-container tbody.p-element.p-datatable-tbody');
    const tableContent = await table.innerText();

    if (!tableContent || tableContent.includes("There's no data available")) {
        throw new Error('Table is empty or not found.');
    }

    console.log('Table contents:', tableContent);

    const rows = await page.$$('tbody.p-element.p-datatable-tbody tr');
    let rowToClick: any = null;

    console.log('Searching for matching row...');

    for (const row of rows) {
        const rowText = await row.innerText();
        console.log('Row text:', rowText);

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
        throw new Error('No matching row found.');
    }

    console.log(`Row found: ${firstName} ${lastName}, ${email}, ${phoneNumber}, ${studioName}`);

    console.log('Locating the action button in the row...');
    const actionButton = await rowToClick.$('button.bg-primary-green.text-white.px-2.py-1.rounded-md.btn-sm.min-w-max');
    if (!actionButton) {
        throw new Error('Action button not found.');
    }

    console.log('Clicking the action button...');
    await actionButton.click();

    console.log('Selecting the "Delete" option...');
    const deleteOption = await page.getByRole('menuitem', { name: 'Delete' });
    await deleteOption.waitFor({ state: 'visible' });
    await deleteOption.click();

    console.log('Waiting for the warning message...');
    const warningMessageElement = await page.waitForSelector('div.modal-body p.text-xl', { state: 'visible' });

    const warningMessageText = await warningMessageElement.innerText();
    console.log('Warning message:', warningMessageText);

    if (!warningMessageText.includes(firstName) || !warningMessageText.includes(lastName)) {
        throw new Error('Warning message does not contain the full name.');
    }

    console.log('Attempting to confirm deletion...');
    
    let confirmSuccess = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const confirmButton = await page.getByRole('button', { name: 'Yes' });
            await confirmButton.waitFor({ state: 'visible' });
            await confirmButton.click();
            console.log('Clicked "Yes" button successfully.');
            confirmSuccess = true;
            break;
        } catch (error) {
            console.warn(`Attempt ${attempt}: Failed to click "Yes". Retrying...`);
            await page.waitForTimeout(1000);
        }
    }

    if (!confirmSuccess) {
        throw new Error('Failed to click "Yes" confirmation button after multiple attempts.');
    }

    console.log('Staff member deletion confirmed.');
}
