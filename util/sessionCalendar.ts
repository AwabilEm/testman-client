import { test, expect, Page } from '@playwright/test';

const email = 'test.report8@gmail.com';
const phoneNumber = '800-000-2927';

const fName = 'test';
const lName = 'automate';
const selectStu = 'Houston';
const selectedDate = '03/13/2025';

// Convert selected date to calendar format
const calendarSelectedDate = convertDate(selectedDate);
console.log('Selected date', calendarSelectedDate); // Output: "March 13, 2025"

// Function to convert date format
function convertDate(date: string): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [month, day, year] = date.split('/').map(part => parseInt(part, 10));
    return `${months[month - 1]} ${day}, ${year}`;
}

// Test suite for session booking flow
test.describe('Session Booking Flow', () => {
    let page: Page; // Declare page variable to share across tests

    // Run once before all tests to visit the page and navigate to the session calendar
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext(); // Create a new browser context
        page = await context.newPage(); // Assign the page
        await page.goto('https://admin.manduu.app/app/main/dashboard');
        await page.getByRole('link', { name: 'Session Calendar' }).click();
        await page.fill('[formcontrolname="selectedDate"]', calendarSelectedDate);
    });

    // Test for selecting a studio
    test('Select Studio', async () => {
        await page.getByRole('button', { name: 'Select studio ' }).click();
        await page.locator('.dropdown-item', { hasText: selectStu }).click();
        await page.waitForTimeout(4000);
    });

    // Test for refreshing the calendar view
    test('Refresh Calendar View', async () => {
        await page.getByRole('button', { name: 'Refresh' }).click();
        await page.waitForTimeout(4000);
    });

    // Test for clicking an empty time slot
    test('Click Empty Time Slot', async () => {
        // Example slot click: Thursday at 12 PM
        await page.locator('tr:nth-child(38) > td:nth-child(2)').click();
        await page.getByRole('button', { name: 'Close' }).click();
        await page.locator('tr').filter({ hasText: /^11:00am$/ }).locator('td').nth(1).click();
    });

    // Close the page after all tests are done
    test.afterAll(async () => {
        await page.close();
    });
});
