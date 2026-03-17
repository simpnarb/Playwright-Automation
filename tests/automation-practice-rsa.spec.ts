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
    const email : string = `johndoe${Date.now()}@example.com`;

    test.beforeEach(async ({ page }) => {
        // Create a new account to use for dashboard tests
        const firstName : string = 'John';
        const lastName : string = 'Doe';
        const password : string = 'SecurePassword123!'; 
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

    test('Dashboard - Verify Home Page', async ({ page }) => {
        await page.locator('.card-body').last().waitFor();
        
        const items : any = page.locator('.card-body');
        const itemCount : number = await items.count();
        let results : any = await page.locator('#res').textContent();
        let resultsCount : number = parseInt(results.trim().slice(7, -1)); // Extract the number from "Showing X items"

        expect(itemCount).toBeGreaterThan(0); // Ensure there are items displayed
        expect(resultsCount).toBe(itemCount); // Ensure the results count matches the number of items displayed
        await expect(items.locator('h5')).toHaveCount(itemCount); // Ensure each item has a title

        for(let i = 0; i < itemCount; i++) {
            await expect(items.getByRole('button', { name: 'View' }).nth(i)).toBeVisible(); // Ensure each item has a "View" button
            await expect(items.getByRole('button', { name: "Add To Cart" }).nth(i)).toBeVisible(); // Ensure each item has an "Add To Cart" button
        } 
    });

    test('Dashboard - Verify Product Details', async ({ page }) => {
        await page.locator('.card-body').last().waitFor();

        await page.getByRole('button', { name: 'View' }).first().click();
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = page.url().slice(-24);
        expect (productID.length).toBe(24); // Ensure the product ID in the URL is 24 characters long
        expect (productID).toMatch(/^[a-zA-Z0-9]+$/); // Ensure the product ID contains only alphanumeric characters
    });

    test('Dashboard - Verify blank Cart', async ({ page }) => {
        await page.locator('.card-body').last().waitFor();
        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page).toHaveURL('https://rahulshettyacademy.com/client/#/dashboard/cart');
        await expect(page.getByText("No Products in Your Cart !")).toBeVisible(); // Ensure the cart is empty
    });

    test('Dashboard - Verify Adding Item to Cart', async ({ page }) => {
        await page.locator('.card-body').last().waitFor();
        
        await page.getByRole('button', { name: 'View' }).first().click();
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        
        const productID : string = '#' + page.url().slice(-24);
        await page.getByRole('button', { name: "Add To Cart" }).first().click();
        await expect(page.getByText("Product Added To Cart")).toBeVisible();

        await page.locator(".btn.btn-custom[routerlink='/dashboard/cart']").click();
        await expect(page.locator('.itemNumber')).toHaveText(productID); // Ensure the cart shows the item added
    });

    test('Dashboard - Verify Cart and Checkout', async ({ page }) => {
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

        await page.locator('div > input').first().clear();
        const creditCardInput = Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // Generate a random 16-digit credit card number
        await page.locator('div > input').first().fill(creditCardInput.toString());

        const expiryMonth = Math.floor(Math.random() * 12) + 1; // Generate a random month between 1 and 12
        const expiryYear = (Math.floor(Math.random() * 31) + 1); // Generate a random year between 1 and 31
        
        if (expiryYear < 10) {
            let cardYear = expiryYear.toString().padStart(2, '0'); // Add leading zero for single-digit years
            await page.locator("select[class*='input ddl']").last().selectOption(cardYear);
        }else if (expiryMonth < 10) {
            const cardMonth = expiryMonth.toString().padStart(2, '0'); // Add leading zero for single-digit months
            await page.locator("select[class*='input ddl']").first().selectOption(cardMonth);
        }else{
            await page.locator("select[class*='input ddl']").first().selectOption(expiryMonth.toString());
            await page.locator("select[class*='input ddl']").last().selectOption(expiryYear.toString());
        }

        await page.getByText("Place Order").click()
        await expect(page.getByText("Please Enter Full Shipping Information")).toBeVisible(); // Ensure the appropriate error message is displayed for missing shipping information
        await page.getByRole('button', { name: "Apply Coupon" }).click()
        await expect(page.getByText("Please Enter Coupon")).toBeVisible(); // Ensure the appropriate error message is displayed for missing coupon code

        await page.locator('div > input').nth(1).fill("111");
        await page.locator('div > input').nth(2).fill("John Pork");
        await page.locator('div > input').nth(3).fill("Coupon1");
        await page.getByRole('button', { name: "Apply Coupon" }).click()
        await expect(page.getByText("* Invalid Coupon")).toBeVisible(); // Ensure the appropriate error message is displayed for invalid coupon code
        await page.locator('div > input').nth(3).clear();
        await page.locator('div > input').nth(3).fill("rahulshettyacademy");
        await page.getByRole('button', { name: "Apply Coupon" }).click()
        await expect(page.getByText("* Coupon Applied")).toBeVisible(); // Ensure the appropriate error message is displayed for invalid coupon code
        await page.locator('div > input').nth(4).fill("sean@testing.com");
        await expect(page.locator("label[type='text']")).toHaveText("sean@testing.com"); // Ensure the email input field label is in sync with user input 
        await page.locator("input[placeholder='Select Country']").pressSequentially("United States", {delay: 200});
        await page.getByRole('button', { name: "United States"}).first().click(); // Ensure the country dropdown is working and the correct country can be selected

        await page.getByText("Place Order").click()
    });

    test('Dashboard - Verify Order Details', async ({ page }) => {
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

        await page.locator('div > input').first().clear();
        const creditCardInput = Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // Generate a random 16-digit credit card number
        await page.locator('div > input').first().fill(creditCardInput.toString());

        const expiryMonth = Math.floor(Math.random() * 12) + 1; // Generate a random month between 1 and 12
        const expiryYear = (Math.floor(Math.random() * 31) + 1); // Generate a random year between 1 and 31
        
        if (expiryYear < 10) {
            let cardYear = expiryYear.toString().padStart(2, '0'); // Add leading zero for single-digit years
            await page.locator("select[class*='input ddl']").last().selectOption(cardYear);
        }else if (expiryMonth < 10) {
            const cardMonth = expiryMonth.toString().padStart(2, '0'); // Add leading zero for single-digit months
            await page.locator("select[class*='input ddl']").first().selectOption(cardMonth);
        }else{
            await page.locator("select[class*='input ddl']").first().selectOption(expiryMonth.toString());
            await page.locator("select[class*='input ddl']").last().selectOption(expiryYear.toString());
        }

        await page.locator('div > input').nth(1).fill("111");
        await page.locator('div > input').nth(2).fill("John Pork");
        await page.locator('div > input').nth(3).fill("rahulshettyacademy");
        await page.getByRole('button', { name: "Apply Coupon" }).click()
        await expect(page.getByText("* Coupon Applied")).toBeVisible();
        await page.locator('div > input').nth(4).fill("sean@testing.com");
        await page.locator("input[placeholder='Select Country']").pressSequentially("United States", {delay: 200});
        await page.getByRole('button', { name: "United States"}).first().click(); // Ensure the country dropdown is working and the correct country can be selected

        await page.getByText("Place Order").click()

        await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();
        const recentOrder : any = await page.locator("label[class='ng-star-inserted']").textContent();
        const recentOrderID : string = recentOrder.replaceAll("|","").trim();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/thanks?prop=%5B%22" + recentOrderID + "%22%5D");
        await expect(page.getByText('ADIDAS ORIGINAL')).toBeVisible();
        await expect(page.getByText('$ 11500 ')).toBeVisible();
    });
    
    test('Dashboard - Verify Order History', async ({ page }) => {
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

        await page.locator('div > input').first().clear();
        const creditCardInput = Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // Generate a random 16-digit credit card number
        await page.locator('div > input').first().fill(creditCardInput.toString());

        const expiryMonth = Math.floor(Math.random() * 12) + 1; // Generate a random month between 1 and 12
        const expiryYear = (Math.floor(Math.random() * 31) + 1); // Generate a random year between 1 and 31
        
        if (expiryYear < 10) {
            let cardYear = expiryYear.toString().padStart(2, '0'); // Add leading zero for single-digit years
            await page.locator("select[class*='input ddl']").last().selectOption(cardYear);
        }else if (expiryMonth < 10) {
            const cardMonth = expiryMonth.toString().padStart(2, '0'); // Add leading zero for single-digit months
            await page.locator("select[class*='input ddl']").first().selectOption(cardMonth);
        }else{
            await page.locator("select[class*='input ddl']").first().selectOption(expiryMonth.toString());
            await page.locator("select[class*='input ddl']").last().selectOption(expiryYear.toString());
        }

        await page.locator('div > input').nth(1).fill("111");
        await page.locator('div > input').nth(2).fill("John Pork");
        await page.locator('div > input').nth(3).fill("rahulshettyacademy");
        await page.getByRole('button', { name: "Apply Coupon" }).click()
        await expect(page.getByText("* Coupon Applied")).toBeVisible();
        await page.locator('div > input').nth(4).fill("sean@testing.com");
        await page.locator("input[placeholder='Select Country']").pressSequentially("United States", {delay: 200});
        await page.getByRole('button', { name: "United States"}).first().click(); // Ensure the country dropdown is working and the correct country can be selected

        await page.getByText("Place Order").click()

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

