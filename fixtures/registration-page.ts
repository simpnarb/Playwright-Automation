import type { Page, Locator } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly occupationSelect: Locator;
    readonly genderRadio: Locator;
    readonly termsCheckbox: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.emailInput = page.locator('#userEmail');
        this.passwordInput = page.locator('#userPassword');
        this.mobileNumberInput = page.locator('#userMobile');
        this.confirmPasswordInput = page.locator('#confirmPassword');
        this.occupationSelect = page.locator("select[formcontrolname$='occupation']");
        this.genderRadio = page.locator('label');
        this.termsCheckbox = page.locator("input[type$='checkbox']");
        this.registerButton = page.getByRole('button', { name: 'Register' });
    }

    async pressRegisterButton() {
        await this.registerButton.click();
    }

    async fillRegistrationForm(firstName: string, lastName: string, mobileNumber: string, email: string, password: string, confirmPassword: string, occupation: string, gender: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.mobileNumberInput.fill(mobileNumber);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.occupationSelect.selectOption(occupation);
        await this.genderRadio.filter({ hasText: gender }).click();
        await this.termsCheckbox.check();
    }
}