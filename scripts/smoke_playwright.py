from playwright.sync_api import sync_playwright, expect


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.goto("http://127.0.0.1:3000", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Turn your website into an AI-ready knowledge system")).to_be_visible()
    page.screenshot(path="public/home-smoke.png", full_page=False)

    page.goto("http://127.0.0.1:3000/tools/convert-webpage-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert Webpage to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert")).to_be_visible()
    page.screenshot(path="public/tool-smoke.png", full_page=False)

    page.goto("http://127.0.0.1:3000/tools/convert-html-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert HTML to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-notion-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert Notion to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-pdf-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert PDF to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert PDF")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-docx-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert DOCX to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert DOCX")).to_be_visible()
    browser.close()
