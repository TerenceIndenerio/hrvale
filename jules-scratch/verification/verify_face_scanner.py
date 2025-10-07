from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Capture and print console logs
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    try:
        # Navigate to the face scanner page
        page.goto("http://localhost:5173/facescan", timeout=60000)

        # Wait for the main card to be visible to ensure the page has loaded
        expect(page.locator(".face-scan-card")).to_be_visible(timeout=30000)

        # Give the camera and models a moment to initialize
        page.wait_for_timeout(5000)

        # Take a screenshot of the face scanner page
        page.screenshot(path="jules-scratch/verification/face_scanner.png")

        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)