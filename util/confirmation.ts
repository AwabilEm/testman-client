import { MailSlurp } from 'mailslurp-client';
import { expect } from '@playwright/test';

const apiKey = process.env.MAILSLURP_API_KEY || '';
const mailslurp = new MailSlurp({ apiKey });
export async function verifyConfirmationMessage(
    page: any,
    studio: string,
    date: string,
    time: string
  ): Promise<string> {
    const expectedMessage = `${studio} is confirmed for ${date}, ${time}.`;
  
    // Log the date and time before the modal content is verified
    console.log('Selected Date:', date);
    console.log('Selected Time:', time);
  
    // Modify the locator to target the modal with the confirmation message more specifically
    const confirmationLocator = page.locator(
      'div.ng-tns-c3831901633-3 .modal-content p.text-base.text-center'
    );
  
    // Ensure the modal is fully visible before proceeding
    await confirmationLocator.waitFor({ state: 'visible' });
  
    const rawText = await confirmationLocator.textContent();
    console.log('🧾 Raw modal text:', rawText);
  
    const trimmedText = rawText?.trim();
    console.log('🧾 Trimmed modal text:', trimmedText);
  
    // Verify if the modal contains the expected message
    expect(trimmedText).toContain(expectedMessage);
  
    return trimmedText!;
  }
  

// ✅ Function to check confirmation in the email
export async function checkEmailConfirmation(
  inboxId: string,
  studio: string,
  date: string,
  time: string
): Promise<void> {
  console.log('📩 Waiting for confirmation email...');

  const email = await mailslurp.waitForLatestEmail(inboxId, 30000);

  if (!email || !email.body) {
    throw new Error('No confirmation email received or email body is empty.');
  }

  const body: string = email.body;
  const expectedMessage = `${studio} is confirmed for ${date}, ${time}.`;

  console.log('📧 Email subject:', email.subject);
  console.log('📧 Email body:', body);
  console.log('🔍 Expecting message:', expectedMessage);

  expect(body).toContain(expectedMessage);
}


export function formatDateToMonthDayYear(dateString: string): string {
    const [month, day, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }
  