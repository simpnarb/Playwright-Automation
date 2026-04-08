/*
    This automation test script uses the website: https://rahulshettyacademy.com/client/#/auth/login to practice automating the following:
    1. Navigate to the login page.
    2. Attempt to log in with invalid credentials.
    3. Verify that the appropriate error message is displayed for invalid login attempts.
    4. Creating an account
    5. Logging in with the created account
*/
import { test, expect, type Locator} from '@playwright/test';
import { RegistrationPage } from '../fixtures/registration-page';
import { LoginPage } from '../fixtures/login-page';
import { PlaceOrderPage } from '../fixtures/placeOrder-page';
import { DashboardPage } from '../fixtures/dashboard-page';
import { log } from 'console';

test.describe('Account Creation and Login', () => {
    const baseURL : string= 'https://rahulshettyacademy.com/client/#/auth/login';
    const firstName : string= 'John';
    const lastName : string = 'Doe';
    const password : string = 'SecurePassword123!';
    const email : string= `johndoe${Date.now()}@example.com`; 
    const mobileNumber : string = '1234567890';
    const occupation : string = 'Engineer';
    const gender : string = 'Female';

    test("Create account and login", async ({ page }) => {
        const registerPage = new RegistrationPage(page);
        await page.goto(baseURL);
        
        // Navigate to account creation page
        await page.getByText('Register here').click();
        
        await registerPage.fillRegistrationForm(firstName, lastName, mobileNumber, email, password, password, occupation, gender);
        await registerPage.pressRegisterButton();

        // Verify account creation success (assuming a success message appears)
        //await expect(page.getByText('Account Created Successfully')).toBeVisible();
        await page.getByRole('button', { name: 'Login' }).click();

        // Log in with the newly created account
        await page.locator('#userEmail').fill(email);
        await page.locator('#userPassword').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/dash');
    });
});

test.describe('Account Creation and Login Validations', () => {
    const loginURL = 'https://rahulshettyacademy.com/client/#/auth/login';
    const registerURL = 'https://rahulshettyacademy.com/client/#/auth/register';
    const firstName : string= 'John';
    const lastName : string = 'Doe';
    const password : string = 'SecurePassword123!';
    const email : string= `johndoe${Date.now()}@example.com`; 
    const mobileNumber : string = '1234567890';
    const occupation : string = 'Engineer';
    const gender : string = 'Female';
    const invalidEmail : string = 'non-existingaccount@gmail.com';
    const invalidEmailFormat : string = 'invalid-email-format';
    const invalidPassword : string = 'wrongpass';

    test("Login - Blank email and password", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(loginURL);
        await loginPage.pressLoginButton();

        await expect(page.getByText('*Email is required')).toBeVisible();
        await expect(page.getByText('*Password is required')).toBeVisible();

        // Check email filled but password blank
        await loginPage.fillEmail(email);
        await loginPage.pressLoginButton();
        await expect(page.getByText('*Password is required')).toBeVisible();

        // Check password filled but email blank
        await loginPage.clearEmail();
        await loginPage.fillPassword(password);
        await loginPage.pressLoginButton();
        await expect(page.getByText('*Email is required')).toBeVisible();
    });

    test("Login - Invalid email format", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(loginURL);
        await loginPage.fillEmail(invalidEmailFormat);
        await loginPage.pressLoginButton();

        await expect(page.getByText('*Enter Valid Email')).toBeVisible();
        await loginPage.clearEmail();
        await expect(page.getByText('*Email is required')).toBeVisible();
    });

    test("Login - Invalid credentials", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(loginURL);
        // Check both email and password filled with invalid credentials
        await loginPage.fillEmail(invalidEmail);
        await loginPage.fillPassword(invalidPassword);
        await loginPage.pressLoginButton();
        await expect(page.getByText('Incorrect email or password.')).toBeVisible();
    });

    test("Registration - Blank credentials", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);
        await registrationPage.pressRegisterButton();

        await expect(page.getByText('*First Name is required')).toBeVisible();
        await expect(page.getByText('*Email is required')).toBeVisible();
        await expect(page.getByText('*Phone Number is required')).toBeVisible();
        await expect(page.getByText('*Password is required')).toBeVisible();
        await expect(page.getByText('Confirm Password is required')).toBeVisible();
        await expect(page.getByText('*Please check above checkbox')).toBeVisible();
    });

    test("Registration - Last name blank", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);

        await registrationPage.fillRegistrationForm(firstName, '', mobileNumber, email, password, password, occupation, gender)

        await registrationPage.pressRegisterButton();
        await expect(page.getByText('Last Name is required!')).toBeVisible();
    });

    test("Registration - First name minimum characters", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);

        await page.goto(registerURL);
        await registrationPage.pressRegisterButton();

        await registrationPage.firstNameInput.pressSequentially("Jo", {delay: 100});
        await expect(page.getByText('*First Name must be 3 or more character long')).toBeVisible();
    });
    
    test("Registration - Invalid email format", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);

        await page.goto(registerURL);
        await registrationPage.pressRegisterButton();

        await registrationPage.emailInput.pressSequentially(invalidEmailFormat, {delay: 100});
        await expect(page.getByText('*Enter Valid Email')).toBeVisible();
    });

    test("Registration - Phone number minimum characters", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);

        await page.goto(registerURL);
        await registrationPage.pressRegisterButton();

        await registrationPage.mobileNumberInput.pressSequentially('12345', {delay: 100});
        await expect(page.getByText('*Phone Number must be 10 digit')).toBeVisible();
    });

    test("Registration - Password mismatch", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);

        await registrationPage.passwordInput.fill('Password123');
        await registrationPage.confirmPasswordInput.fill('Password124');
        await registrationPage.pressRegisterButton();
        await expect(page.getByText('Password and Confirm Password must match with each other')).toBeVisible();
    });

    test("Registration - Password minimum characters", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);

        await registrationPage.fillRegistrationForm(firstName, lastName, mobileNumber, email, 'Pass1!', 'Pass1!', occupation, gender);
        await registrationPage.pressRegisterButton();
        await expect(page.getByText('Password must be 8 Character Long!')).toBeVisible();
    });

    test("Registration - Invalid Password Format", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);

        await registrationPage.fillRegistrationForm(firstName, lastName, mobileNumber, email, invalidPassword, invalidPassword, occupation, gender);

        await registrationPage.pressRegisterButton();
        await expect(page.getByText('Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small')).toBeVisible();
    });

    test("Registration - Password already used for email", async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await page.goto(registerURL);

        await registrationPage.fillRegistrationForm(firstName, lastName, mobileNumber, 'email@example.com', password, password, occupation, gender);

        await registrationPage.pressRegisterButton();
        await expect(page.getByText('User already exisits with this Email Id!')).toBeVisible();
    });
});

test.describe('Dashboard', () => {
    const loginURL = 'https://rahulshettyacademy.com/client/#/auth/login';
    const registerURL = 'https://rahulshettyacademy.com/client/#/auth/register';
    const dashboardURL = 'https://rahulshettyacademy.com/client/#/dashboard/dash';
    const email : string = `johndoe${Date.now()}@example.com`;

    test.beforeEach(async ({ page }) => {
        // Create a new account to use for dashboard tests
        const firstName : string = 'John';
        const lastName : string = 'Doe';
        const password : string = 'SecurePassword123!'; 
        const mobileNumber : string = '1234567890';
        const occupation : string = 'Engineer';
        const gender : string = 'Female';
        const registerPage = new RegistrationPage(page);

        await page.goto(registerURL);

        await registerPage.fillRegistrationForm(firstName, lastName, mobileNumber, email, password, password, occupation, gender);
        await registerPage.pressRegisterButton();

        // Verify account creation success (assuming a success message appears)
        //await expect(page.getByText('Account Created Successfully')).toBeVisible();
        await page.getByRole('button', { name: 'Login' }).click();

        // Log in with the newly created account
        await page.locator('#userEmail').fill(email);
        await page.locator('#userPassword').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/dash');
    });

    test('Dashboard - Verify Home Page', async ({ page }) => {
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();
        
        let itemCount : number = await dashboardPage.countItems(); // Get the number of items displayed on the dashboard
        let resultsCount : number = await dashboardPage.itemResult(); // Extract the number from "Showing X items"

        expect(itemCount).toBeGreaterThan(0); // Ensure there are items displayed
        expect(resultsCount).toBe(itemCount); // Ensure the results count matches the number of items displayed
        await expect(dashboardPage.itemName).toHaveCount(itemCount); // Ensure each item has a title

        for(let i = 0; i < itemCount; i++) {
            await expect(dashboardPage.viewButton.nth(i)).toBeVisible(); // Ensure each item has a "View" button
            await expect(dashboardPage.addToCartButton.nth(i)).toBeVisible(); // Ensure each item has an "Add To Cart" button
        } 
    });

    test('Dashboard - Verify Product Details', async ({ page }) => {
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();
        //await dashboardPage.clickViewButtonOf('ADIDAS ORIGINAL'); // Click the "View" button for the item with the specified name
        // await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        await dashboardPage.ViewRandomItem();
       
        
        // Quest: Have an array of the item names and assert the item name in the product details page matches the item name in the array based on the index of the "View" button clicked

        const productID : string = page.url().slice(-24);
        expect (productID.length).toBe(24); // Ensure the product ID in the URL is 24 characters long
        expect (productID).toMatch(/^[a-zA-Z0-9]+$/); // Ensure the product ID contains only alphanumeric characters
    });

    test('Dashboard - Verify blank Cart', async ({ page }) => {
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();
        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
        await expect(page.getByText("No Products in Your Cart !")).toBeVisible(); // Ensure the cart is empty
    });

    test('Dashboard - Verify Adding Item to Cart', async ({ page }) => {
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();
        
        // await dashboardPage.ViewRandomItem();
        await dashboardPage.ViewRandomItem();
        // await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = '#' + page.url().slice(-24);
        await page.locator('.img-fluid').waitFor(); // Wait for the product image to load before clicking "Add To Cart"
        await page.getByRole('button', { name: "Add To Cart" }).click();
        await expect(page.getByText("Product Added To Cart")).toBeVisible();

        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page.locator('.itemNumber')).toHaveText(productID); // Ensure the cart shows the item added
    });

    test('Dashboard - Verify Cart and Checkout', async ({ page }) => {
        const placeOrderPage = new PlaceOrderPage(page);
        await page.locator('.card-body').last().waitFor();

        await page.getByRole('button', { name: 'View' }).first().click();
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = page.url().slice(-24);
        
        await page.getByRole('button', { name: "Add To Cart" }).first().click();
        await expect(page.getByText("Product Added To Cart")).toBeVisible();

        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
        await expect(page.getByText("No Products in Your Cart !")).not.toBeVisible(); // Ensure the cart is not empty
        await expect(page.locator('.itemNumber')).toHaveText("#" + productID); // Ensure the cart shows the item added
        await page.getByRole('button', { name: "Checkout" }).click();

        await placeOrderPage.inputRandomCreditCardNumber();
        await placeOrderPage.inputRandomExpiryDate();

        await placeOrderPage.pressPlaceOrderButton();
        await expect(page.getByText("Please Enter Full Shipping Information")).toBeVisible(); // Ensure the appropriate error message is displayed for missing shipping information
        await placeOrderPage.pressApplyCouponButton();
        await expect(page.getByText("Please Enter Coupon")).toBeVisible(); // Ensure the appropriate error message is displayed for missing coupon code

        await placeOrderPage.inputCVVNameAndEmail("111", "John Pork", email);
        await placeOrderPage.inputCouponCode("invalidcoupon");
        await placeOrderPage.pressApplyCouponButton();
        await expect(page.getByText("* Invalid Coupon")).toBeVisible(); // Ensure the appropriate error message is displayed for invalid coupon code
        await placeOrderPage.clearCouponCode();
        await placeOrderPage.inputCouponCode("rahulshettyacademy");
        await placeOrderPage.pressApplyCouponButton();
        await expect(page.getByText("* Coupon Applied")).toBeVisible(); // Ensure the appropriate error message is displayed for invalid coupon code
        await expect(page.locator("label[type='text']")).toHaveText(email); // Ensure the email input field label is in sync with user input 

        await page.getByText("Place Order").click()
    });

    test('Dashboard - Verify Order Details', async ({ page }) => {
        const placeOrderPage = new PlaceOrderPage(page);
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();

        await page.getByRole('button', { name: 'View' }).first().click();
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = page.url().slice(-24);
        
        await page.getByRole('button', { name: "Add To Cart" }).first().click();
        await expect(page.getByText("Product Added To Cart")).toBeVisible();

        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
        await expect(page.getByText("No Products in Your Cart !")).not.toBeVisible(); // Ensure the cart is not empty
        await expect(page.locator('.itemNumber')).toHaveText("#" + productID); // Ensure the cart shows the item added
        await page.getByRole('button', { name: "Checkout" }).click();

        await placeOrderPage.inputRandomCreditCardNumber();
        await placeOrderPage.inputRandomExpiryDate();
        await placeOrderPage.inputCVVNameAndEmail("111", "John Pork", email);
        await placeOrderPage.inputCouponCode("rahulshettyacademy");
        await placeOrderPage.pressApplyCouponButton();
        await expect(page.getByText("* Coupon Applied")).toBeVisible();

        await placeOrderPage.inputCountry("United States");

        await placeOrderPage.pressPlaceOrderButton();

        await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();
        const recentOrder : any = await page.locator("label[class='ng-star-inserted']").textContent();
        const recentOrderID : string = recentOrder.replaceAll("|","").trim();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/thanks?prop=%5B%22" + recentOrderID + "%22%5D");
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        await expect(page.getByText('$ 11500 ')).toBeVisible();
    });
    
    test('Dashboard - Verify Order History', async ({ page }) => {
        const placeOrderPage = new PlaceOrderPage(page);
        const dashboardPage = new DashboardPage(page); 
        await dashboardPage.waitForItems();

        await page.getByRole('button', { name: 'View' }).first().click();
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = page.url().slice(-24);
        
        await page.getByRole('button', { name: "Add To Cart" }).first().click();
        await expect(page.getByText("Product Added To Cart")).toBeVisible();

        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
        await expect(page.getByText("No Products in Your Cart !")).not.toBeVisible(); // Ensure the cart is not empty
        await expect(page.locator('.itemNumber')).toHaveText("#" + productID); // Ensure the cart shows the item added
        await page.getByRole('button', { name: "Checkout" }).click();

         await placeOrderPage.inputRandomCreditCardNumber();
        await placeOrderPage.inputRandomExpiryDate();
        await placeOrderPage.inputCVVNameAndEmail("111", "John Pork", email);
        await placeOrderPage.inputCouponCode("rahulshettyacademy");
        await placeOrderPage.pressApplyCouponButton();
        await expect(page.getByText("* Coupon Applied")).toBeVisible();

        await placeOrderPage.inputCountry("United States");

        await placeOrderPage.pressPlaceOrderButton();

        await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();
        const recentOrder : any = await page.locator("label[class='ng-star-inserted']").textContent();
        const recentOrderID : string = recentOrder.replaceAll("|","").trim();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/thanks?prop=%5B%22" + recentOrderID + "%22%5D");
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        await expect(page.getByText('$ 11500 ')).toBeVisible();


        await page.getByRole('button', { name: "Orders" }).click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/myorders');

        await page.locator("tbody tr").last().waitFor();
        const orderCount : any = await page.locator("tbody tr").count();
        for (let i=0; i < orderCount; i++) {
            const orderID : any = await page.locator("tbody tr").nth(i).locator("th").textContent();
            if (orderID.trim() === recentOrderID) {
                await page.locator("tbody tr").nth(i).getByRole('button', { name: "View" }).click();
                await expect(page.getByText(email)).toHaveCount(2);
                await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
                await expect(page.getByText('$ 11500 ')).toBeVisible();
                break;
            }
        }
    });
});

