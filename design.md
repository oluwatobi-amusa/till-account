# design.md

Design foundations for all projects. Web \+ mobile. Readers: AI tools (Claude, Lovable) and developers.

**Rule for AI tools:** Use only the tokens defined in this file. Never invent hex values, font sizes, spacing, or radii. If something is missing, ask or pick the nearest token.

---

## 1\. Principles

- Clean and minimal: remove anything that doesn't help the user act.  
- Generous whitespace; one clear primary action per screen.  
- Soft shapes (8–12px radius), restrained color, strong type hierarchy.  
- Use only the defined color tokens; never raw hex values.

---

## 2\. Color

Use only these tokens. Do not introduce other colors.

/\* Colors \*/

:root {

  \--color-primary: \#009148;

  \--color-faded-primary-10: \#E5F4ED;

  \--color-faded-primary-40: \#99D3B6;

  \--color-warning-10: \#FFF5E5;

  \--color-warning-40: \#FF9900;

  \--color-black: \#000000;

  \--color-white: \#FFFFFF;

  \--color-gray: \#A4A4A4;

  \--color-faded-gray-10: \#F7F7F7;

  \--color-outline: \#EBEBEB;

}

| Token | Hex | Suggested use |
| :---- | :---- | :---- |
| `--color-primary` | \#009148 | Primary actions, links, key highlights |
| `--color-faded-primary-10` | \#E5F4ED | Light primary tint backgrounds, selected states |
| `--color-faded-primary-40` | \#99D3B6 | Mid primary tint, borders/accents on tinted areas |
| `--color-warning-10` | \#FFF5E5 | Warning backgrounds |
| `--color-warning-40` | \#FF9900 | Warning text, icons, borders |
| `--color-black` | \#000000 | Primary text |
| `--color-white` | \#FFFFFF | Page background, text on primary |
| `--color-gray` | \#A4A4A4 | Placeholder, disabled, secondary icons |
| `--color-faded-gray-10` | \#F7F7F7 | Subtle backgrounds, inputs, hover fills |
| `--color-outline` | \#EBEBEB | Dividers and outlines |

The "suggested use" column is a starting point; edit it to match how you use each color.

### 2.1 Color rules

- Never use a hex value that isn't in the list above, except the card border in section 6.2.  
- `--color-gray` (\#A4A4A4) on white is below WCAG AA contrast for body text. Use it for placeholders, disabled states, and non-essential text only.  
- Never use color alone to convey status; pair it with an icon or label.  
- Dark mode: no dark values are defined yet. Add them here before building dark mode.

---

## 3\. Typography

### 3.1 Typefaces

- **Primary:** Schibsted Grotesk, used for all UI text.  
- **Special characters:** Montserrat, used for glyphs Schibsted Grotesk doesn't cover, such as the naira sign (₦).

:root {

  \--font-sans: "Schibsted Grotesk", "Montserrat", system-ui, \-apple-system, "Segoe UI", sans-serif;

}

body { font-family: var(--font-sans); }

The browser falls back per glyph, so ₦ renders in Montserrat automatically. Always load both fonts.

### 3.2 Type scale

Weights: semibold \= 600, bold \= 700, extrabold \= 800\. Format is size / line height.

**Mobile**

| Token | Weight | Size / Line height |
| :---- | :---- | :---- |
| Base font | semibold | 14 / 20 |
| Navigation | bold | 14 / auto |
| Helper text | semibold | 12 / 18 |

**Web**

| Token | Weight | Size / Line height |
| :---- | :---- | :---- |
| Page heading | extrabold | 18 / auto |
| Base font | semibold | 14 / 20 |
| Card title | bold | 14 / 20 |
| Caption / helper text | semibold | 12 / 20 |

### 3.3 Typography rules

- Use tabular numbers for money, tables, and stats: `font-variant-numeric: tabular-nums;`  
- Sentence case for all UI text, including buttons.

---

## 4\. Spacing

Base unit: **5px**. Use only multiples of 5\.

| Token | Value |
| :---- | :---- |
| `space-1` | 5px |
| `space-2` | 10px |
| `space-3` | 15px |
| `space-4` | 20px |
| `space-5` | 25px |
| `space-6` | 30px |
| `space-7` | 35px |
| `space-8` | 40px |
| `space-10` | 50px |
| `space-12` | 60px |
| `space-16` | 80px |
| `space-20` | 100px |

### 4.1 Spacing rules

- Default screen padding: 20px mobile, 30px tablet, 40px+ desktop.  
- Gap between related items: 10–15px. Between groups: 30px. Between sections: 60–80px.  
- Touch targets: minimum 45×45px on mobile.  
- Content max-width on desktop: 1200px; reading width 720px.  
- Component padding is defined in section 6 and takes priority over these defaults.

---

## 5\. Shape

Soft corners (8–12px) are the default. Use only these radii.

| Token | Value | Use |
| :---- | :---- | :---- |
| `radius-button` | 5px | Buttons (intentional exception to the soft range) |
| `radius-sm` | 8px | Inputs, chips |
| `radius-card` | 10px | Cards and containers |
| `radius-md` | 12px | Modals, sheets |
| `radius-full` | 9999px | Avatars, pills, toggles |

Prefer borders over shadows; use shadows sparingly for overlays only.

---

## 6\. Components

### 6.1 Buttons

- Padding: 40px horizontal, 20px vertical. Radius: 5px.

\<button class="px-\[40px\] py-\[20px\] rounded-\[5px\]"\>Label\</button\>

### 6.2 Cards and containers

- Border color `#C4C4C4` (not part of the color palette; specific to cards and containers): 1px on top, left, and right; 4px on the bottom.  
- Radius: 10px.  
- **Cards:** padding 30–40px on all sides.  
- **Containers:** padding 20px top and bottom, 30px left and right.

\<\!-- Card \--\>

\<div class="border-x border-t border-b-4 border-\[\#C4C4C4\] rounded-\[10px\] p-\[30px\]"\>...\</div\>

\<\!-- Container \--\>

\<div class="border-x border-t border-b-4 border-\[\#C4C4C4\] rounded-\[10px\] py-\[20px\] px-\[30px\]"\>...\</div\>

---

## 7\. Using this file in a new project

1. Copy this file to the project root.  
2. Map the tokens to code (Tailwind config, CSS variables, or design tokens).  
3. In AI prompts (Lovable, Claude), start with: "Follow design.md strictly for color, type, spacing, shape, and components."