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

    page.goto("http://127.0.0.1:3000/tools/convert-google-docs-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert Google Docs to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-xml-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert XML to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-json-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert JSON to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-csv-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert CSV to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-rtf-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert RTF to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-paste-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert Paste to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert to Markdown")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-reply-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Reply Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate reply")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-prompt-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Prompt Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Prompt")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-prompt-optimizer", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Prompt Optimizer")).to_be_visible()
    expect(page.get_by_role("button", name="Optimize Prompt")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-faq-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI FAQ Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate FAQs")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-answer-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Answer Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Answer")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-email-response-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Email Response Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Email Response")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-letter-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Letter Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Letter")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-blog-title-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Blog Title Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Blog Titles")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-chatbot-name-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Chatbot Name Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate Chatbot Names")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-saas-brand-name-generator", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI SaaS Brand Name Generator")).to_be_visible()
    expect(page.get_by_role("button", name="Generate SaaS Brand Names")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-chat-with-your-text-data", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Chat with Your Text Data")).to_be_visible()
    expect(page.get_by_role("button", name="Ask", exact=True)).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/ai-chat-with-your-website-data", wait_until="networkidle")
    expect(page.get_by_role("heading", name="AI Chat with Your Website Data")).to_be_visible()
    expect(page.get_by_role("button", name="Ask", exact=True)).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-pdf-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert PDF to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert PDF")).to_be_visible()

    page.goto("http://127.0.0.1:3000/tools/convert-docx-to-markdown", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Convert DOCX to Markdown")).to_be_visible()
    expect(page.get_by_role("button", name="Convert DOCX")).to_be_visible()
    browser.close()
