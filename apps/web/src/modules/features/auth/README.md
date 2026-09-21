# Customer auth (личный кабинет)

Implements ADR-0007: customers register to get a personal showroom discount code and book a
visit. No checkout, no payments.

## How it works

- `customers` is a Payload auth collection (`src/payload/collections/customers.ts`). Email +
  password, `verify: false`, 5 login attempts then a 10 minute lock, JWT lives 7 days.
  `discountCode` (`SHOW-XXXX`) and `discountPercent` (from `site-settings.showroomDiscountPercent`)
  are filled by `beforeChange` hooks on create.
- `users` stays the admin collection (`admin.user`). `payload/access` distinguishes them by
  `req.user.collection`: `authenticated` means an admin user, customers never pass it.
- Server actions in `api/auth.actions.ts` (`register`, `login`, `logout`) run the Payload Local
  API (`payload.create` / `payload.login`) and set the auth cookie. Forms (`ui/login-form.tsx`,
  `ui/register-form.tsx`) are client components on `useActionState`; every error is a dictionary
  key from the `account` namespace, never a raw message.
- Pages: `modules/pages/account-page`, `login-page`, `register-page`; routes under
  `app/(frontend)/[locale]/account/*`, all `noindex`. `account` redirects to `login` when there is
  no customer, `login`/`register` redirect to `account` when there is.
- `getCurrentCustomer(headers)` (`modules/entities/customer`) is the only way to read the current
  customer: it calls `payload.auth({ headers })` and returns `null` for admins and guests.
- `AccountLink` (`ui/account-link.tsx`) is a drop-in link for the header; it always points to
  `ROUTES.account(locale)`, which bounces guests to the login page.

## Cookie

- Name: `payload-token` (Payload's default `${cookiePrefix}-token`, so `payload.auth` reads it).
  `httpOnly`, `sameSite=lax`, `path=/`, `secure` in production, `maxAge` 7 days
  (`lib/auth-cookie.ts`).
- The admin panel uses the same cookie name. Logging in as a customer in the same browser
  replaces the admin session and vice versa; this is acceptable for now.
- `logout` only clears the cookie; the Payload session stays until the JWT expires.

## Showroom visits

- `showroom-visits` (`src/payload/collections/showroom-visits.ts`): a customer creates only their
  own visits (`beforeChange` binds `customer` to `req.user` and copies `code` from the customer),
  reads only their own, and cannot set `status` (field-level access, admin only).
- `requestVisit` server action in `modules/features/showroom-visit` validates the date (today or
  later), passes the customer as `user` with `overrideAccess: false`, and revalidates the account
  page.

## Later

- Email verification: set `auth.verify` on `customers` and add a `/{locale}/account/verify`
  route that calls `payload.verifyEmail`; move `register` to "check your inbox" instead of
  logging in right away.
- Password reset: `payload.forgotPassword` + `payload.resetPassword` with a `reset` route.
- Transactional email (visit requested / confirmed): configure `payload.email` (Resend or SMTP
  adapter) and send from an `afterChange` hook on `showroom-visits`; today nothing is sent.
- Bitrix24: push new customers and visits as leads (ADR-0004 / ADR-0007), keyed by
  `discountCode`.
