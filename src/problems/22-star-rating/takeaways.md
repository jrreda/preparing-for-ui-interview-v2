# Star rating takeaways

The rating is a controlled radiogroup. The parent owns the number. The component only reports clicks and previews hover.

## The click does not store the rating

`value` and `onChange` are the whole contract. A click reads `data-star-value` and calls `onChange`. The stars light up on the next render, when the parent passes the new `value`. Mounting `<StarRating />` with neither prop leaves every star inactive, and the click throws because `onChange` is missing. The preview has to hold the number in `useState` and pass `setRating` down.

One handler sits on the container. The event target is often the emoji inside the button, so `closest('button')` is what finds the star. `mouseenter` does not bubble, so it cannot use that same trick.

## Checked and active are different questions

`aria-checked` is true only when `starValue === value`. A radiogroup has one selected option, so a rating of 3 marks star 3 checked and leaves the others unchecked. The screen reader should hear "3 Stars, radio, checked".

`data-active` is the fill: a star is lit when `displayValue >= starValue`. The CSS rule has to be `[data-active='false']`. A selector for `data-checked` never matches, and every star stays at full opacity. Labels are 1-based: "1 Star", then "2 Stars" through "5 Stars".

## Hover previews without replacing the saved rating

Hover lives in local state and never calls `onChange`. `aria-checked` keeps using `value`.

`hover || value` replaces the rating, so hovering star 2 while the value is 3 sets the displayed rating to 2 and dims the third star. `Math.max(hover, value)` keeps the committed stars lit and only extends the row when the pointer is on a higher star. `0` means "not hovering", and `Math.max(0, value)` falls back to the saved rating.

## Leave belongs on the group

`mouseleave` fires when the pointer exits the element the handler is on. It stays quiet while the pointer moves among that element's children.

On each button, moving from star 2 to star 3 leaves star 2 first. That calls `setHover(0)`, the row flashes back to the saved rating, and then star 3's `mouseenter` sets the preview again. The same reset happens in the gap between buttons.

On the container, both stars are inside one region, so moving between them does not fire `mouseleave`. The handler runs only when the pointer leaves the group, which is when the preview should disappear. `onMouseEnter` stays on each button because the container cannot tell which star you entered.
