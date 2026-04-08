import { Page, Locator } from '@playwright/test';

export class PlaceOrderPage {
    readonly page: Page;
    readonly creditCardInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly cvvInput: Locator;
    readonly cardHolderNameInput: Locator;
    readonly couponCodeInput: Locator;
    readonly applyCouponButton: Locator;
    readonly emailInput: Locator;
    readonly countrySelect: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.creditCardInput = page.locator('div > input').first();
        this.expiryMonthInput = page.locator(`select[class*='input ddl']`).first();
        this.expiryYearInput = page.locator(`select[class*='input ddl']`).last();
        this.cvvInput = page.locator('div > input').nth(1);
        this.cardHolderNameInput = page.locator('div > input').nth(2);
        this.couponCodeInput = page.locator('div > input').nth(3);
        this.applyCouponButton = page.getByRole('button', { name: "Apply Coupon" });
        this.emailInput = page.locator('div > input').nth(4);
        this.countrySelect = page.locator(`input[placeholder='Select Country']`);
        this.placeOrderButton = page.getByText("Place Order");
    }

    async pressApplyCouponButton() {
        await this.applyCouponButton.click();
    }

    async pressPlaceOrderButton() {
        await this.placeOrderButton.click();
    }   

    async inputRandomCreditCardNumber() {
        await this.creditCardInput.clear();
        const randomCreditNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // Generate a random 16-digit credit card number
        await this.creditCardInput.fill(randomCreditNumber.toString());
    }

    async inputRandomExpiryDate() {
        const expiryMonth = Math.floor(Math.random() * 12) + 1; // Generate a random month between 1 and 12
        const expiryYear = (Math.floor(Math.random() * 31) + 1); // Generate a random year between 1 and 31

        if (expiryYear < 10) {
            let cardYear = expiryYear.toString().padStart(2, '0'); // Add leading zero for single-digit years
            await this.page.locator("select[class*='input ddl']").last().selectOption(cardYear);
        }else if (expiryMonth < 10) {
            const cardMonth = expiryMonth.toString().padStart(2, '0'); // Add leading zero for single-digit months
            await this.page.locator("select[class*='input ddl']").first().selectOption(cardMonth);
        }else{
            await this.page.locator("select[class*='input ddl']").first().selectOption(expiryMonth.toString());
            await this.page.locator("select[class*='input ddl']").last().selectOption(expiryYear.toString());
        }
    }

    async inputCouponCode(couponCode: string) {
        await this.couponCodeInput.fill(couponCode);
    }

    async clearCouponCode() {
        await this.couponCodeInput.clear();
    }

    async inputCountry(country: string) {
        await this.countrySelect.pressSequentially(country, {delay: 200});
        await this.page.getByRole('button', { name: country}).first().click();
    }

    async inputCVVNameAndEmail(cvv: string, cardHolderName: string, email: string) {
        await this.cvvInput.fill(cvv);
        await this.cardHolderNameInput.fill(cardHolderName);
        await this.emailInput.fill(email);
    }
}