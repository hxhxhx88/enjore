# Unified authentication

This document describes the unified sign-in and sign-up process using email and OTP. The web implementation lives in `apps/app-next` and its technical rules in `docs/implementation/0001-web-session.md`.

## Overview

The authentication flow is designed to be simple and passwordless. Users enter their email address, receive a one-time password (OTP), and are either signed in or signed up depending on whether an account already exists.

## User flow

- User visits the authentication page.
- User enters their email address.
- System sends an OTP to the provided email.
- User enters the OTP.
- System verifies the OTP.
- System checks if the user account exists.
  - If yes, the user is signed in.
  - If no, a new account is created, and the user is signed in.

## Detailed behavior

### Input email

- The user is presented with an email input field.
- The user enters a valid email address.
- The user clicks the "Continue" (or similar) button.
- The system validates the email format.
- If invalid, an error message is displayed.
- If valid, the system initiates the OTP generation and sending process.

### Receive OTP

- The system generates a secure OTP.
- The system sends the OTP to the user's email address.
- The user interface updates to show an OTP input field.
- A countdown timer may be displayed for resending the OTP.

### Verify OTP

- The user enters the received OTP.
- The system validates the OTP.
- If the OTP is incorrect or expired, an error message is displayed.
- If the OTP is correct, the flow proceeds to account resolution.

### Account resolution

- The system checks if an account with the verified email exists.
- **Existing account**:
  - The user is authenticated.
  - The user is redirected to the dashboard or the intended destination.
- **New account**:
  - A new user account is created with the verified email.
  - The user is authenticated.
  - The user is redirected to the onboarding flow or dashboard.
