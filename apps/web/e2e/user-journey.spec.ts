import { test, expect } from " @playwright/test\;

test.describe(\AACC User Journey\, () => {
 test(\should allow user to login create task and see real-time update\, async ({ page }) => {
 // 1. Login
 await page.goto(\/auth/login\);
 await page.fill(\input[name=\email\]\, \admin@example.com\);
 await page.fill(\input[name=\password\]\, \password123\);
 await page.click(\button[type=\submit\]\);
 await expect(page).toHaveURL(\/dashboard\);

 // 2. Create Task
 await page.fill(\input[placeholder=\uuid\]\, \workflow-uuid-123\);
 await page.click(\text=Launch Task\);

 // 3. Observe SSE
 await expect(page.locator(\.event-log\)).toContainText(\queued\);
 await expect(page.locator(\.event-log\)).toContainText(\completed\);
 });

 test(\should block unauthorized access to other user tasks\, async ({ page }) => {
 await page.goto(\/api/v1/tasks/other-user-task-id\);
 await expect(page.locator(\body\)).toContainText(\Unauthorized\);
 });
});
