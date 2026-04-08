import {Page, Locator} from '@playwright/test';

export class DashboardPage {
    readonly page : Page;
    readonly items : Locator;
    readonly itemResults : Locator;
    readonly itemName : Locator;
    readonly viewButton : Locator;
    readonly addToCartButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.card-body');
        this.itemResults = page.locator('#res');
        this.itemName = this.items.locator('h5');
        this.viewButton = this.items.getByRole('button', { name: 'View' });
        this.addToCartButton = this.items.getByRole('button', { name: "Add To Cart" });
    }

    async waitForItems() {
        await this.items.last().waitFor();
    }

    async countItems(){
        const itemCount = await this.items.count();
        return itemCount;
    }

    async itemResult(){
        const results : any = await this.itemResults.textContent();
        const resultCount : number = parseInt(results.trim().slice(7, -1));
        return resultCount;
    }

    // async clickViewButtonOf(item : string){ // Click the "View" button for the item with the specified name
    //     await this.items.filter({ has: this.page.locator('h5', { hasText: item }) }).getByRole('button', { name: 'View' }).click();
    // }

    async clickViewButtonOf(index : number){
        await this.viewButton.nth(index).click();
    }

    async clickAddToCartButtonOf(index : number){
        await this.addToCartButton.nth(index).click();
    }

    async ViewRandomItem(){
        const itemCount = await this.countItems();
        const randomIndex = Math.floor(Math.random() * itemCount);
        await this.clickViewButtonOf(randomIndex);
    }

    async AddRandomItemToCart(){
        const itemCount = await this.countItems();
        const randomIndex = Math.floor(Math.random() * itemCount);
        await this.clickAddToCartButtonOf(randomIndex);
    }
}