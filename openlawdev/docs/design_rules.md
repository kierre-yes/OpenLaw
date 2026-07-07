# Design Rules

## Typography
- **Headings**: Inter Semibold
- **Body**: Inter Regular
- **Small labels and navigation**: Inter Medium

### Responsive Font Sizes (LearnUI Guidelines)
- **Mobile baseline**: Body text default at **17px** (16–20px range).
- **Mobile text inputs**: At least **16px** (avoids awkward browser zoom on focus).
- **Mobile secondary/caption text**: **13–14px** (about 2 sizes below body).
- **Desktop main text**: **14–20px** (interaction layouts) or **18–24px** (reading/text-heavy layouts).
- **Desktop line character count**: **50–75 characters per line** for body text.
- **Desktop headlines**: **30–50px** range.
- **Size constraint**: Restrict design to around **four distinct sizes**: Header, Default, Secondary, and Caption.
- **Section Kickers/Overlines**: Small, tracking-widest text, with a prominent underline (e.g., `underline underline-offset-[5px] decoration-[2px]`).

## Color Palette (Red Aesthetic)
Use these explicit hex codes mapped to standard roles:
- **Fresh red** (`#A41F13`): Primary actions, active states, focus rings, brand accents.
- **White fog** (`#FAF5F1`): Main page backgrounds, offset colors.
- **Light gray** (`#E0DBD8`): Dividers, subtle backgrounds.
- **Carbon gray** (`#292F36`): Primary text (headings and body), default icons.
- **Soft Brown** (`#8F7A6E`): Secondary text, disabled states, subtle borders.

## Interaction & Accessibility Guidelines
- **Clickable Elements**: Whenever designing an interactive or clickable component (buttons, custom links, items, headers with actions), it must explicitly include `cursor-pointer` in its `className` (unless native element behavior handles it, though Tailwind custom components should explicitly declare it for clarity).
- **Focus Rings**: All interactive elements must have clear focus states. Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A41F13]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5F1]` (adjust ring color and offset base color depending on context).
- **Active States**: Add a subtle scale-down effect on click for buttons: `active:scale-[0.97]`.
- **Transitions**: Use smooth transitions for interactive elements (e.g., `transition-all duration-200 ease-in-out`).

## Layout & Aesthetic Patterns

### Legal Notepad Card
For premium, card-like containers, use the "Legal Notepad" design pattern:
1. **Container**: White background (`#FFFFFF`), rounded corners (`rounded-2xl` or `rounded-[24px]`), subtle border (`border-[rgba(41,47,54,0.08)]`), and left padding to accommodate the margin line (e.g., `pl-12 pr-7 py-8`).
2. **Red Margin Line**: Absolute positioned vertical line on the left to simulate ruled paper. 
   ```jsx
   <div className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#A41F13]/20" aria-hidden="true" />
   ```
3. **Sticky Tape/Adhesive**: Absolute positioned graphic at the top left.
   ```jsx
   <div className="absolute -top-2.5 left-10 w-12 h-5 border-l border-r border-[#8F7A6E]/5 transform -rotate-1 rounded-sm bg-[rgba(143,122,110,0.1)]" aria-hidden="true" />
   ```
4. **Document Tab / Sticky Marker**: Rotated badge at the top right.
   ```jsx
   <div className="absolute -top-3.5 right-6 px-3.5 py-2 rounded-lg shadow-md shadow-[#A41F13]/10 transform rotate-2 bg-[#A41F13] text-[#FAF5F1] text-sm font-bold tracking-wide flex items-center gap-2">...</div>
   ```
