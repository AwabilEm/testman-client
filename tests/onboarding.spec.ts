// tests/onboarding.spec.ts
import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/testConfig';
import { STUDIOS } from '../config/studioConfig';
import { convertDate, generateUniqueIdentifiers } from '../utils/dateUtils';

import { RegisterPage } from '../pages/RegisterPage';
import { MedicalConditionsPage } from '../pages/MedicalConditionsPage';
import { StudioSelectionPage } from '../pages/StudioSelectionPage';
import { AppointmentPage } from '../pages/AppointmentPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ClientInfoPage } from '../pages/ClientInfoPage';
import { MarketingPage } from '../pages/MarketingPage';
import { WaiverPage } from '../pages/WaiverPage';
import { LoginPage } from '../pages/LoginPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ContractPage } from '../pages/ContractPage';
import { AdminPage } from '../pages/AdminPage';

let selectedTime: string | null = null;

let calendarSelectedDate = convertDate(TEST_CONFIG.credentials.selectedDate);

test.describe.serial('Onboarding Tests', () => {
  STUDIOS.forEach((studio, index) => {
    const { email, phoneNumber } = generateUniqueIdentifiers(
      TEST_CONFIG.credentials.baseEmail, 
      TEST_CONFIG.credentials.domain, 
      index
    );
    //const lastName = `automate${studio}`;
 

    test(`Onboarding for ${studio}`, async ({ page }) => {
      // Initialize page objects
      const registerPage = new RegisterPage(page);
      const medicalPage = new MedicalConditionsPage(page);
      const studioPage = new StudioSelectionPage(page);
      const appointmentPage = new AppointmentPage(page);
      const profilePage = new ProfilePage(page);
      const clientInfoPage = new ClientInfoPage(page);
      const marketingPage = new MarketingPage(page);
      const waiverPage = new WaiverPage(page);
      
      // Start registration process
      await registerPage.navigate();
      await registerPage.fillPersonalInformation(
        TEST_CONFIG.credentials.firstName, 
        TEST_CONFIG.credentials.lastName, 
        
        email,
        phoneNumber, 
        TEST_CONFIG.credentials.password
      );
      
      // Complete medical conditions
      await medicalPage.signMedicalConditions();
      
      // Select studio
      await studioPage.selectStudio(studio);
      
      // Schedule appointment
      await appointmentPage.fillScheduledDate(TEST_CONFIG.credentials.selectedDate);
      selectedTime = await appointmentPage.selectRandomTime();
      
      // Handle any popups
      await appointmentPage.handlePopups();
      
      // Complete profile
      await profilePage.completeProfile();
      
      // Complete client info
      await clientInfoPage.completeClientInfo();
      
      // Answer marketing survey
      await marketingPage.completeMarketingSurvey();
      
      // Sign waiver
      await waiverPage.signWaiver();
      
      // Complete first appointment
      await appointmentPage.completeFirstAppointment();
    });
    
    test(`Execute first appointment for ${studio}`, async ({ page }) => {
      const adminPage = new AdminPage(page);
      
      await adminPage.navigate();
      await adminPage.navigateToSessionCalendar();
     // console.log('Selected date:', calendarSelectedDate);

      await adminPage.filterSessionsByDate(calendarSelectedDate);

      await adminPage.selectStudio(studio);
      await page.getByRole('searchbox', { name: 'Search...' }).fill(TEST_CONFIG.credentials.firstName + ' ' + TEST_CONFIG.credentials.lastName);
await page.getByRole('searchbox', { name: 'Search...' }).click();
console.log('Selected time:', selectedTime);
//selectedTime = '11:15 AM'; // Replace with the actual selected time from the previous test
      await adminPage.selectClientAppointment(
        TEST_CONFIG.credentials.firstName, 
        TEST_CONFIG.credentials.lastName, 
        selectedTime!
      );
      await adminPage.executeFirstAppointment();
    });
    
    test(`Login and complete onboarding for ${studio}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const paymentPage = new PaymentPage(page);
      const contractPage = new ContractPage(page);
      
      await loginPage.navigate();
      await loginPage.login(email, TEST_CONFIG.credentials.password);
      await paymentPage.addCard();
      await contractPage.signContract();
    });
    
    test(`Verify studio and contract after onboarding for ${studio}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      await loginPage.navigate();
      await loginPage.login(email, TEST_CONFIG.credentials.password);
      
      const displayedStudio = await page.locator('text=Home Studio:').textContent();
      expect(displayedStudio).toContain(studio);
    });
  });
});