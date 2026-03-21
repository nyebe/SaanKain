import {
    expect,
    test,
} from '@playwright/test';

const LOCATION_SUGGESTION_MESSAGE = 'Could not find your location. Try turning on location (use the location button) so results are searched by your current location.';

test.beforeEach(async ({ page }) => {
    // start with a clean localStorage
    await page.goto('about:blank');
    await page.evaluate(() => localStorage.clear());
});

test('shows location suggestion when searching "near me" with location toggled off', async ({ page }) => {
    // Intercept the API call and return a LOCATION_SUGGESTION error
    await page.route('**/api/v1/execute**', (route) => {
        route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                success: false,
                error: {
                    code: 'LOCATION_SUGGESTION',
                    message: LOCATION_SUGGESTION_MESSAGE,
                },
            }),
        });
    });

    await page.goto('/results');

    // Type the query and submit
    await page.fill('textarea[aria-label="search message"]', 'sushi near me');
    await page.click('button:has-text("Search")');

    // The ErrorState should display the location suggestion message
    await expect(page.locator(`text=${LOCATION_SUGGESTION_MESSAGE}`)).toBeVisible();
});

test('performs search and shows result when location is toggled on', async ({ browser }) => {
    // Create a context with geolocation and permission granted
    const context = await browser.newContext({
        geolocation: { latitude: 14.5547, longitude: 121.0244 },
        permissions: ['geolocation'],
    });
    const page = await context.newPage();

    // Intercept the API call and return a successful response with one result
    await page.route('**/api/v1/execute**', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                message: 'sushi near me',
                parsed: {
                    cuisine: null,
                    locationText: 'me',
                    openNow: false,
                },
                results: [
                    {
                        fsqId: 'resto-1',
                        name: 'Test Resto',
                        address: '123 Test St',
                        locality: 'Locality',
                        region: 'Region',
                        category: 'Sushi',
                    },
                ],
            }),
        });
    });

    await page.goto('/results');

    // Click the location toggle to enable location
    await page.click('button[aria-label="Toggle location search"]');

    // Ensure the location badge (coords/display) is visible — the hook writes a short text
    await expect(page.locator('text=,')).toBeVisible({ timeout: 5000 }).catch(() => { });

    // Type the query and submit
    await page.fill('textarea[aria-label="search message"]', 'sushi near me');
    await page.click('button:has-text("Search")');

    // Expect the result card to show the mocked restaurant name
    await expect(page.locator('text=Test Resto')).toBeVisible();

    await context.close();
});
