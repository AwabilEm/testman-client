import { test, expect, Page } from "@playwright/test";

// Utility function to check and manage a staff member
export async function checkHomeStudio(
  page: Page,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  studioName: string
) {
  console.log("Navigating to dashboard...");
  await page.goto("https://admin.manduu.app/app/main/dashboard");

  console.log("Filling in the search field with email:", email);
  await page.getByRole("textbox", { name: "Search Client" }).fill(email);

  console.log("Clicking the search button...");
  await page.getByRole("button", { name: "" }).click();

  console.log("Waiting for the table rows to load...");
  await page.waitForSelector(
    "#main-page-table-container tbody.p-element.p-datatable-tbody",
    { state: "visible" }
  );

  // Optionally, add a small timeout to allow table content to load
  await page.waitForTimeout(5000); // Wait for 5 seconds

  const table = await page.locator(
    "#main-page-table-container tbody.p-element.p-datatable-tbody"
  );
  const tableContent = await table.innerText();

  if (!tableContent || tableContent.includes("There's no data available")) {
    console.error("Table is empty or not found.");
    throw new Error("Table is empty or not found.");
  } else {
    console.log("Table contents:", tableContent); // Log the entire table contents for debugging
  }

  const rows = await page.$$("tbody.p-element.p-datatable-tbody tr");
  let rowToClick: any = null;

  console.log("Iterating through table rows to find a match...");

  for (const row of rows) {
    const rowText = await row.innerText();
    console.log("Row text:", rowText); // Log the text of each row for debugging

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
    console.error("No matching row found for the specified details.");
    throw new Error("No matching row found.");
  }

  console.log(
    `Row found: ${firstName} ${lastName}, ${email}, ${phoneNumber}, ${studioName}`
  );

  console.log("Locating the action button in the row...");
  const actionButton = await rowToClick.$(
    "button.bg-primary-green.text-white.px-2.py-1.rounded-md.btn-sm.min-w-max"
  );
  if (!actionButton) {
    console.error("Action button not found in the row.");
    throw new Error("Action button not found.");
  }

  console.log("Clicking the action button...");
  await actionButton.click();

  console.log('Selecting the "Manage" option from the dropdown...');
  const manageOption = await page
    .getByRole("menuitem")
    .filter({ hasText: /^\s*Manage\s*$/i });  if (!manageOption) {
    console.error("Manage option not found.");
    throw new Error("Manage option not found.");
  }
  await manageOption.click();

  console.log("Waiting for the Manage page to load...");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2000); // Small delay for page transition



  console.log("Successfully navigated to the Manage page.");

  await page.getByText('Settings', { exact: true }).click();
 
  await expect(page.getByLabel('Is Onboarded')).toBeChecked();
// await page.getByText('HoustonHoustonDefault Studio').click();
// await expect(page.locator('app-account-settings')).toContainText('HoustonHoustonDefault Studio');
 

// Wait for the studio display element to appear
//await page.waitForSelector('.studio-name', { state: 'visible' });

// Get the default studio text
// Wait for the default studio element to be visible
await page.waitForSelector('#defaultStudio', { state: 'visible' });

// Get the text inside the default studio span
const defaultStudio = await page.locator('#defaultStudio').innerText();

// Ensure the default studio is "Houston"
await expect(page.locator('#defaultStudio')).toContainText('Houston');


}

// Test data
const firstName = "test";
const lastName = "automate";
const email = "awabil.new.card@gmail.com";
const phoneNumber = "8000000001";
const studioName = "Houston";

//Main test
// test('Manage test user by email and other details with full name validation', async ({ page }) => {
//     console.log('Starting test: Manage user by email and other details with full name validation');
//     await checkHomeStudio(page, firstName, lastName, email, phoneNumber, studioName);
//     console.log(`Test completed successfully: Managed the client; ${email} and other details with full name validation`);
// });
