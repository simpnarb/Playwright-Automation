/*
    This automation test script uses the website: https://rahulshettyacademy.com/client/#/auth/login to practice automating the following:
    1. Navigate to the login page.
    2. Attempt to log in with invalid credentials.
    3. Verify that the appropriate error message is displayed for invalid login attempts.
    4. Creating an account
    5. Logging in with the created account
*/
import { test, expect, type Locator} from '@playwright/test';

test.describe('Account Creation and Login', () => {
    const baseURL : string= 'https://rahulshettyacademy.com/client/#/auth/login';
    const firstName : string= 'John';
    const lastName : string = 'Doe';
    const password : string = 'SecurePassword123!';
    const email : string= `johndoe${Date.now()}@example.com`; 
    const mobileNumber : string = '1234567890';
    const occupation : string = 'Engineer';

    test("Create account and login", async ({ page }) => {
        await page.goto(baseURL);

        // Navigate to account creation page
        await page.getByText('Register here').click();
        // Fill in account creation form
        await page.locator('#firstName').fill(firstName);
        await page.locator('#lastName').fill(lastName);
        await page.locator('#userEmail').fill(email);
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill(password);
        await page.locator('#confirmPassword').fill(password);
        await page.locator("select[formcontrolname$='occupation']").selectOption(occupation);
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        // Submit the registration form
        await page.getByRole('button', { name: 'Register' }).click();

        // Verify account creation success (assuming a success message appears)
        await expect(page.getByText('Account Created Successfully')).toBeVisible();
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
    const invalidEmail : string = 'non-existingaccount@gmail.com';
    const invalidEmailFormat : string = 'invalid-email-format';
    const invalidPassword : string = 'wrongpass';

    test("Login - Blank email and password", async ({ page }) => {
        const email : Locator = page.locator('#userEmail');
        const password : Locator = page.locator('#userPassword');
        const login : Locator = page.getByRole('button', { name: 'Login' });

        await page.goto(loginURL);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('*Email is required')).toBeVisible();
        await expect(page.getByText('*Password is required')).toBeVisible();

        // Check email filled but password blank
        await email.fill(invalidEmail);
        await login.click();
        await expect(page.getByText('*Password is required')).toBeVisible();

        // Check password filled but email blank
        await email.fill('');
        await password.fill(invalidPassword);
        await login.click();
        await expect(page.getByText('*Email is required')).toBeVisible();
    });

    test("Login - Invalid email format", async ({ page }) => {
        const email : Locator = page.locator('#userEmail');
        const login : Locator = page.getByRole('button', { name: 'Login' });

        await page.goto(loginURL);
        await login.click();
        await email.pressSequentially(invalidEmailFormat, {delay: 100});

        await expect(page.getByText('*Enter Valid Email')).toBeVisible();
        await email.fill(''); // Clear the field
        await expect(page.getByText('*Email is required')).toBeVisible();
    });

    test("Login - Invalid credentials", async ({ page }) => {
        const email : Locator = page.locator('#userEmail');
        const password : Locator = page.locator('#userPassword');
        const login : Locator = page.getByRole('button', { name: 'Login' });

        await page.goto(loginURL);
        // Check both email and password filled with invalid credentials
        await email.fill(invalidEmail);
        await password.fill(invalidPassword);
        await login.click();
        await expect(page.getByText('Incorrect email or password.')).toBeVisible();
    });

    test("Registration - Blank credentials", async ({ page }) => {
        await page.goto(registerURL);
        await page.getByRole('button', { name: 'Register' }).click();

        await expect(page.getByText('*First Name is required')).toBeVisible();
        await expect(page.getByText('*Email is required')).toBeVisible();
        await expect(page.getByText('*Phone Number is required')).toBeVisible();
        await expect(page.getByText('*Password is required')).toBeVisible();
        await expect(page.getByText('Confirm Password is required')).toBeVisible();
        await expect(page.getByText('*Please check above checkbox')).toBeVisible();
    });

    test("Registration - Last name blank", async ({ page }) => {
        await page.goto(registerURL);

        await page.locator('#firstName').fill(firstName);
        await page.locator('#userEmail').fill(email);
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill(password);
        await page.locator('#confirmPassword').fill(password);
        await page.locator("select[formcontrolname$='occupation']").selectOption(occupation);
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Last Name is required!')).toBeVisible();
    });

    test("Registration - First name minimum characters", async ({ page }) => {
        const firstName : Locator = page.locator('#firstName');
        await page.goto(registerURL);
        await page.getByRole('button', { name: 'Register' }).click();

        await firstName.pressSequentially('A', {delay: 100});
        await expect(page.getByText('*First Name must be 3 or more character long')).toBeVisible();
    });
    
    test("Registration - Invalid email format", async ({ page }) => {
        const email : Locator = page.locator('#userEmail');
        await page.goto(registerURL);
        await page.getByRole('button', { name: 'Register' }).click();

        await email.pressSequentially(invalidEmailFormat, {delay: 100});
        await expect(page.getByText('*Enter Valid Email')).toBeVisible();
    });

    test("Registration - Phone number minimum characters", async ({ page }) => {
        const phoneNumber : Locator = page.locator('#userMobile');
        await page.goto(registerURL);
        await page.getByRole('button', { name: 'Register' }).click();  

        await phoneNumber.pressSequentially('12345', {delay: 100});
        await expect(page.getByText('*Phone Number must be 10 digit')).toBeVisible();
    });

    test("Registration - Password mismatch", async ({ page }) => {
        const password : Locator = page.locator('#userPassword');
        const confirmPassword : Locator = page.locator('#confirmPassword');
        await page.goto(registerURL);

        await password.fill('Password123');
        await confirmPassword.fill('Password124');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Password and Confirm Password must match with each other')).toBeVisible();
    });

    test("Registration - Password minimum characters", async ({ page }) => {
        await page.goto(registerURL);

        await page.locator('#firstName').fill(firstName);
        await page.locator('#lastName').fill(lastName);
        await page.locator('#userEmail').fill(email);
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill("short");
        await page.locator('#confirmPassword').fill("short");
        await page.locator("select[formcontrolname$='occupation']").selectOption("Student");
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Password must be 8 Character Long!')).toBeVisible();
    });

    test("Registration - Invalid Password Format", async ({ page }) => {
        await page.goto(registerURL);

        await page.locator('#firstName').fill(firstName);
        await page.locator('#lastName').fill(lastName);
        await page.locator('#userEmail').fill(email);
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill(invalidPassword);
        await page.locator('#confirmPassword').fill(invalidPassword);
        await page.locator("select[formcontrolname$='occupation']").selectOption("Student");
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small')).toBeVisible();
    });

    test("Registration - Password already used for email", async ({ page }) => {
        await page.goto(registerURL);

        await page.locator('#firstName').fill(firstName);
        await page.locator('#lastName').fill(lastName);
        await page.locator('#userEmail').fill("email@example.com"); // Assuming this email is already registered
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill(password);
        await page.locator('#confirmPassword').fill(password);
        await page.locator("select[formcontrolname$='occupation']").selectOption("Student");
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('User already exisits with this Email Id!')).toBeVisible();
    });
});

test.describe('Dashboard', () => {
    const loginURL = 'https://rahulshettyacademy.com/client/#/auth/login';
    const registerURL = 'https://rahulshettyacademy.com/client/#/auth/register';
    const dashboardURL = 'https://rahulshettyacademy.com/client/#/dashboard/dash';

    test.beforeAll(async ({ page }) => {
        // Create a new account to use for dashboard tests
        const firstName : string= 'John';
        const lastName : string = 'Doe';
        const password : string = 'SecurePassword123!';
        const email : string= `johndoe${Date.now()}@example.com`; 
        const mobileNumber : string = '1234567890';
        const occupation : string = 'Engineer';

        await page.goto(registerURL);
        await page.locator('#firstName').fill(firstName);
        await page.locator('#lastName').fill(lastName);
        await page.locator('#userEmail').fill(email);
        await page.locator('#userMobile').fill(mobileNumber);
        await page.locator('#userPassword').fill(password);
        await page.locator('#confirmPassword').fill(password);
        await page.locator("select[formcontrolname$='occupation']").selectOption(occupation);
        await page.locator("input[value$='Male']").check();
        await page.locator("input[type$='checkbox']").check();

        // Submit the registration form
        await page.getByRole('button', { name: 'Register' }).click();

        // Verify account creation success (assuming a success message appears)
        await expect(page.getByText('Account Created Successfully')).toBeVisible();
        await page.getByRole('button', { name: 'Login' }).click();

        // Log in with the newly created account
        await page.locator('#userEmail').fill(email);
        await page.locator('#userPassword').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/dash');
    });

    test('Dashboard - Verify website items', async ({ page }) => {
        await page.goto(dashboardURL);

        
    });
});

