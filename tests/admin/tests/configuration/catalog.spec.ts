import { test, expect, config } from '../../utils/setup';
import { launchBrowser } from '../../utils/admin/coreHelper';
import  * as forms from '../../utils/admin/formHelper';
import logIn from '../../utils/admin/loginHelper';

test.describe('attribute management', () => {
    let browser;
    let context;
    let page;

    test.beforeEach(async () => {
        browser = await launchBrowser();
        context = await browser.newContext();
        page = await context.newPage();

        await logIn(page);
    });

    test.afterEach(async () => {
        await browser.close();
    });

    test('products of catalog', async () => {
        await page.goto(`${config.baseUrl}/admin/configuration/catalog/products`);

        const selects = await page.$$('select.custom-select');

        for (let select of selects) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 3 == 1) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await select.selectOption(options[randomIndex]);
                }
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 3 == 1) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }
        }

        const errors = await page.$$('input[type="number"]:visible, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of errors) {
            await error.fill((Math.random() * 10).toString());
        }

        const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of newErrors) {
            await error.fill((Math.floor(Math.random() * 10) + 1).toString());
        }

        const files = await page.$$('input[type="file"]');

        for (let file of files) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                const filePath = forms.getRandomImageFile();

                await file.setInputFiles(filePath);
            }
        }

        const deletes = await page.$$('input[type="checkbox"] + label.icon-uncheckbox:visible');

        for (let checkbox of deletes) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        await page.click('button[type="submit"].primary-button:visible');

        await expect(page.getByText('Configuration saved successfully')).toBeVisible();
    });

    test('rich snippets of catalog', async () => {
        await page.goto(`${config.baseUrl}/admin/configuration/catalog/rich_snippets`);

        await page.click('button[type="submit"].primary-button:visible');

        await expect(page.getByText('Configuration saved successfully')).toBeVisible();
    });

    test('inventory of catalog', async () => {
        await page.goto(`${config.baseUrl}/admin/configuration/catalog/inventory`);

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 3 == 1) {
            await page.fill('input[type="number"]:visible', (Math.random() * 1000).toString());
        }

        await page.click('button[type="submit"].primary-button:visible');

        await expect(page.getByText('Configuration saved successfully')).toBeVisible();
    });
});
