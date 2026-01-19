
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Capture console messages
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        page.goto("http://localhost:8788/global-religions")

        # Wait for the blockquote elements to be populated
        page.wait_for_selector("blockquote#christianity-quote p")
        page.wait_for_selector("blockquote#islam-quote p")

        page.screenshot(path="verification.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
