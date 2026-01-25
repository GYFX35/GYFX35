
import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        await page.goto("http://localhost:8788/global-ngos", wait_until="networkidle")

        # Give some time for async operations to complete
        await asyncio.sleep(5)

        await page.screenshot(path="verification.png", full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
