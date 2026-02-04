# Security Policy

## Overview

Ludus Magnus: Reborn is a client-side web game that runs entirely in the browser. All game data is stored locally using browser storage (localStorage via Redux Persist). There is no backend server, user accounts, or sensitive data transmission.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Considerations

### Data Storage

- **Local Storage**: Game saves are stored in browser localStorage
- **No Server Communication**: The game does not send any data to external servers
- **No Personal Data Collection**: We do not collect any personal information
- **No Authentication**: There are no user accounts or login systems

### Third-Party Dependencies

We use the following major dependencies:
- React (UI framework)
- Redux Toolkit (state management)
- Framer Motion (animations)
- Tailwind CSS (styling)

All dependencies are regularly updated to address known vulnerabilities.

## Reporting a Vulnerability

While Ludus Magnus: Reborn is a client-side game with no sensitive data handling, we still take security seriously.

### What to Report

Please report if you find:
- XSS (Cross-Site Scripting) vulnerabilities
- Dependency vulnerabilities that could affect users
- Ways to manipulate game state that could affect shared experiences
- Any issues that could compromise user browser security

### How to Report

1. **Do NOT** open a public issue for security vulnerabilities
2. Send an email to [INSERT SECURITY EMAIL] with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution**: Depends on severity
  - Critical: ASAP (1-3 days)
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Recognition

We appreciate security researchers who help keep our project safe. Contributors who report valid vulnerabilities will be:
- Credited in release notes (with permission)
- Added to our security contributors list
- Thanked publicly (with permission)

## Best Practices for Users

### Browser Security
- Keep your browser updated to the latest version
- Use browsers with good security track records (Chrome, Firefox, Safari, Edge)
- Be cautious of browser extensions that might interfere with localStorage

### Game Data
- Your save data is stored locally in your browser
- Clearing browser data will erase your game progress
- To backup your save, you can export it from Settings (if available)

## Disclaimer

This is a hobby/open-source project. While we strive to follow security best practices, we cannot guarantee absolute security. Use this software at your own risk.

---

Thank you for helping keep Ludus Magnus: Reborn safe for everyone!
