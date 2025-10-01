from playwright.sync_api import sync_playwright, expect, Page, Dialog
import time

def handle_dialog(dialog: Dialog):
    """Handles prompt for admin password and other alerts."""
    if "admin password" in dialog.message.lower():
        dialog.accept("admin123")
    else:
        dialog.accept()

def run(playwright):
    browser = playwright.chromium.launch(
        headless=True,
        args=["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"]
    )
    context = browser.new_context(permissions=["camera"])
    page = context.new_page()
    page.on("dialog", handle_dialog)

    try:
        # Navigate to the facescan page
        base_url = "http://localhost:5173"
        page.goto(f"{base_url}/facescan", timeout=60000)

        # Wait for models to load
        loading_overlay = page.locator(".loading-overlay")
        expect(loading_overlay).to_be_hidden(timeout=90000)
        time.sleep(2)

        # Switch to registration mode
        switch_mode_button = page.locator(".mode-switch-button")
        expect(switch_mode_button).to_be_visible(timeout=10000)
        switch_mode_button.click()

        # Open registration modal
        register_face_button = page.get_by_role("button", name="Register Face")
        expect(register_face_button).to_be_visible()
        register_face_button.click()

        # Verify modal and take screenshot
        registration_modal = page.locator("ion-modal", has_text="Register Credentials")
        expect(registration_modal).to_be_visible()
        page.screenshot(path="jules-scratch/verification/registration-modal.png")
        print("Screenshot captured successfully.")

    except Exception as e:
        print(f"An error occurred during Playwright verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        run(p)