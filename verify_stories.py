
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8788/con-valores-incubadora.html")
        # Wait for the async content to load
        time.sleep(5)
        page.screenshot(path="success_stories_verification.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
