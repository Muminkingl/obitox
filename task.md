Thank you. Let’s refine and **correct the behavior and architecture** of
`/dashboard/settings/appearance` to make it **consistent, predictable, and enterprise-grade**.

---

## Appearance Page – Required Improvements & Corrections

### 1. User Logo: Source of Truth & Storage Fix

* Remove the **old logo upload mechanism** that stores the logo in browser storage.
* The displayed logo must always reflect the **actual authenticated user’s logo**, not a locally stored value.

#### Required Behavior

* Fetch and display the user’s logo directly from **Supabase user metadata / profile source**.
* If the user authenticated via:

  * Google
  * GitHub
  * Any social provider
    → Always display the provider’s profile image (or the user’s updated profile image if overridden server-side).
* Do **not** use local storage for the logo.
* The logo must update **globally and consistently** for the logged-in user across the dashboard.

**Result:**
The logo becomes a **true identity attribute**, not a UI preference.

---

### 2. Display Preference: Unsaved State Must Not Persist

There is currently a **critical UX bug**.

#### Current Problem

* When a user selects a display preference (e.g. Light mode), the UI updates immediately.
* If the user **does not click “Save Changes”** and navigates away:

  * The new theme still persists.
* This violates expected behavior and breaks user trust.

#### Correct Required Behavior

* Selecting a display preference should:

  * Apply the theme **temporarily (preview mode)** only.
  * Mark the state as **unsaved / dirty**.

* If the user:

  * Clicks **Save Changes**
    → Persist the theme to browser storage.
  * Clicks **Cancel**
    → Revert immediately to the previously saved theme.
  * Navigates away **without saving**
    → Automatically revert to the last saved theme.

#### Key Rule

> **No appearance change is allowed to persist unless “Save Changes” is explicitly clicked.**

---

### Implementation Principle

* Maintain two states:

  * **Saved state** (source of truth from browser storage)
  * **Draft state** (temporary preview selection)
* Route changes or unmount events must:

  * Detect unsaved changes
  * Restore the saved state automatically

---

### Objective

These changes ensure:

* Identity data (logo) is **authoritative and consistent**
* UI preferences behave in a **transactional, reversible manner**
* No accidental persistence
* Enterprise-grade UX with zero ambiguity

The Appearance page must feel **safe, intentional, and predictable** at all times.
