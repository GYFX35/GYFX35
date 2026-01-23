
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto('http://localhost:8788/con-valores-incubadora.html')
            time.sleep(10)  # Wait for content to load
            page.screenshot(path='programs_verification.png', full_page=True)
            print("Screenshot taken. Check programs_verification.png")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
