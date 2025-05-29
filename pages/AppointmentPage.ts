import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AppointmentPage extends BasePage {
  private selectedTime: string | null = null;

  constructor(page: Page) {
    super(page);
  }

  async fillScheduledDate(date: string) {
    await this.page.fill('xpath=//input[@id="ScheduledDate"]', date);
    await this.page.click('text="Start Time"');
  }

  async selectRandomTime() {
    const getTimeOptions = async () => {
      const timeDropdown = await this.page.$('#inputGroupSelect02');
      if (!timeDropdown) return null;

      const options = await timeDropdown.$$eval('option', options =>
        options
          .map(option => option.getAttribute('value'))
          .filter(option => option && !option.includes('undefined'))
      );

      return options.length > 0 ? options : null;
    };

    const waitForTimeOptions = async () => {
      let attempts = 0;
      while (attempts < 5) {
        const availableTimes = await getTimeOptions();
        if (availableTimes) return availableTimes;
        await this.page.waitForTimeout(1000);
        attempts++;
      }
      return null;
    };

    const availableTimes = await waitForTimeOptions();

    if (availableTimes) {
      console.log('Available times:', availableTimes);

      const randomIndex = Math.floor(Math.random() * availableTimes.length);
      const selectedOption = availableTimes[randomIndex];
      const splitOption = selectedOption ? selectedOption.split(': ') : null;
      this.selectedTime = splitOption && splitOption[1] ? splitOption[1] : null;

      console.log('Selected time for the appointment:', this.selectedTime);

      await this.page.selectOption('#inputGroupSelect02', availableTimes[randomIndex]);
    } else {
      console.warn('No available times found for the selected date after retries.');
    }

    await this.page.waitForTimeout(2000);
   // console.log(`User first appointment booked ... on ${calendarSelectedDate}  , ${selectedTime} at ${studio}` );


    return this.selectedTime;
  }

  async completeFirstAppointment() {
   // await this.page.getByRole('button', { name: 'Next' }).click();
  
   await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  getSelectedTime() {
    return this.selectedTime;
  }

  async verifyBookingConfirmation(studio: string, date: string, time?: string) {
    await this.page.waitForLoadState('domcontentloaded');

    try {
      const confirmationModal = this.page.locator('.ng-tns-c3831901633-3');
      await confirmationModal.waitFor({ state: 'visible', timeout: 5000 });

      const confirmationText = await confirmationModal.locator('p.w-[68%]:nth-child(3)').textContent();

      if (confirmationText) {
        expect(confirmationText).toContain(studio);
        expect(confirmationText).toContain(date);

        if (time) {
          expect(confirmationText).toContain(time);
        }
      } else {
        console.error('No confirmation text found in the modal.');
      }
    } catch (error) {
      console.error('Error verifying booking confirmation:', error);
    }
  }
}
























// // pages/AppointmentPage.ts
// import { Page } from '@playwright/test';
// import { BasePage } from './BasePage';

// export class AppointmentPage extends BasePage {
//   private selectedTime: string | null = null;
  
//   constructor(page: Page) {
//     super(page);
//   }
  
//   async fillScheduledDate(date: string) {
//     await this.page.fill('xpath=//input[@id="ScheduledDate"]', date);
//     await this.page.click('text="Start Time"');
//   }
  
//   async selectRandomTime() {
//     const getTimeOptions = async () => {
//       const timeDropdown = await this.page.$('#inputGroupSelect02');
//       if (!timeDropdown) return null;
  
//       const options = await timeDropdown.$$eval('option', options =>
//         options
//           .map(option => option.getAttribute('value'))
//           .filter(option => option && !option.includes('undefined'))
//       );
  
//       return options.length > 0 ? options : null;
//     };
  
//     const waitForTimeOptions = async () => {
//       let attempts = 0;
//       while (attempts < 5) {
//         const availableTimes = await getTimeOptions();
//         if (availableTimes) return availableTimes;
//         await this.page.waitForTimeout(1000);
//         attempts++;
//       }
//       return null;
//     };
  
//     const availableTimes = await waitForTimeOptions();
  
//     if (availableTimes) {
//       console.log('Available times:', availableTimes);
  
//       const randomIndex = Math.floor(Math.random() * availableTimes.length);
//       const selectedOption = availableTimes[randomIndex];
//       const splitOption = selectedOption ? selectedOption.split(': ') : null;
//       this.selectedTime = splitOption && splitOption[1] ? splitOption[1] : null;

//             console.log('Selected time for the appointment:', this.selectedTime);
  
//       await this.page.selectOption('#inputGroupSelect02', availableTimes[randomIndex]);
//     } else {
//       console.warn('No available times found for the selected date after retries.');
//     }
  
//     await this.page.waitForTimeout(2000);
//     await this.page.getByRole('button', { name: 'Continue' }).click();
//     await this.page.getByRole('button', { name: 'Next' }).click();
    


//     return this.selectedTime;
//   }
  
//   async completeFirstAppointment() {
//     await this.page.getByRole('button', { name: 'Continue' }).click();
//   }
  
//   getSelectedTime() {
//     return this.selectedTime;
//   }


  
// }
