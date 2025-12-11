
import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def main():
    if not os.path.exists('screenshots'):
        os.makedirs('screenshots')

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        server_process = subprocess.Popen(['python3', '-m', 'http.server', '8000'])
        time.sleep(2)

        try:
            await page.goto('http://localhost:8000/index.html', timeout=60000)

            # Wait for the UNESCO data to be rendered by looking for its content
            await page.wait_for_selector('#unesco-data p:not(:empty)', timeout=30000)
            print("UNESCO section content has been rendered.")

            await page.screenshot(path='screenshots/final_verification.png', full_page=True)
            print("Screenshot saved to screenshots/final_verification.png")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            await browser.close()
            server_process.kill()


if __name__ == '__main__':
    asyncio.run(main())
