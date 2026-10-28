# Testing record

Test date: 2026-10-28 (Asia/Dhaka)

## Automated checks

- JavaScript syntax check: passed
- Required frontend files: passed
- Static server response: passed

## Browser smoke tests

| Test | Result |
| --- | --- |
| Dashboard loads at a narrow responsive viewport | Passed |
| Five language controls are visible | Passed |
| Education form accepts subject, level, and goal | Passed |
| Personalized fallback result includes the user's goal | Passed |
| Copy, download, save, and read-aloud controls appear | Passed |
| Saved plan is restored from browser-local storage | Passed |
| Live AI is the default mode | Passed |
| Missing local AI endpoint falls back without losing the plan | Passed |
| Skip-to-content and visible keyboard focus styles exist | Passed |
| High-contrast, large-text, and reduced-motion support exist | Passed |
| Production frontend files match the verified local build | Passed |
| Production Live AI returns a useful response | Passed |
| Production personalized study plan uses the user's stated goal | Passed |
| AI Markdown is rendered without exposing raw formatting markers | Passed |
| Empty guidance forms show localized inline errors and focus the first invalid field | Passed |
| Empty AI questions show an accessible error without losing the page | Passed |
| Active navigation exposes its current-page state to assistive technology | Passed |
| Language controls expose their selected state | Passed |
| Sidebar and language controls support arrow-key navigation | Passed |
| Mobile controls keep usable touch sizes and wrap without page overflow | Passed |
| Accessibility update v2.1 matches the deployed cPanel files byte-for-byte | Passed |

## Still requiring event-period evidence

- Real-user usability sessions
- Full keyboard-only walkthrough
- Screen-reader testing on Windows and mobile
- Measured task-completion and impact results

