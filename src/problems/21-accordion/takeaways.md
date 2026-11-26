# Accordion takeaways

The accordion is a native `<details>` element plus a few CSS rules you should be able to explain out loud.

## The browser already owns the behavior

`<details>` and `<summary>` toggle on click, Enter, and Space, and they expose the right roles to assistive technology. There is no `useState` in the component. An empty `items` array renders nothing.

## The animation is the part worth knowing

`::details-content` is the box around everything except the summary. Collapsed, its `max-height` is `0` and `overflow` is `hidden`. Open, `max-height` becomes `500px`. The transition lists both `max-height` and `content-visibility`, and `allow-discrete` is what lets the close animation run. Without it the content disappears immediately. `500px` is a compromise: a short section animates through empty space, and anything taller has to scroll.

## The marker is two rules, not one

`list-style: none` removes the disclosure marker. `::-webkit-details-marker { display: none }` removes the older WebKit triangle. The plus is a `::after`, and `.details[open] .summary::after` rotates it 45 degrees.

## Clipping and hit targets are easy to get wrong

`border-radius` does not crop children. `overflow: hidden` has to sit on the same element as the radius, or the bottom corners stay square. `cursor: pointer` belongs on the summary, because the body is not the control. `overflow-y: auto` shows a scrollbar only when the text exceeds the cap. `scroll` reserves one even for a short paragraph.

## Write the CSS yourself in the interview

The selectors above are what the interviewer wants to hear. Tailwind can reproduce them, but the interesting rules turn into arbitrary variants and the reasoning disappears. Prefixed copies of `border-radius`, `transition`, and `transform` are leftover from old browsers. Current engines use the unprefixed properties.
