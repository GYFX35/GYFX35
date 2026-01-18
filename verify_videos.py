
from playwright.sync_api import sync_playwright, expect
import datetime

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto('http://localhost:8788/videos.html', wait_until='networkidle')

            # Check for videos by asserting the first one is visible
            video_previews = page.locator('.video-preview')
            expect(video_previews.first).to_be_visible(timeout=15000)
            print('PASS: At least one video is displayed on the page.')

            page.screenshot(path='verification-final.png')
            print('SUCCESS: Verification complete, screenshot saved to verification-final.png')

        except Exception as e:
            print(f'FAIL: Error during verification: {e}')
            page.screenshot(path='verification-final-error.png')
            raise
        finally:
            browser.close()

if __name__ == '__main__':
    run()
