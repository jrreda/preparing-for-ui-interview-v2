# Tabs takeaways

`Tabs` owns the active name. Each `Tab` is a header the caller already created, and the panel is that tab's `children`, rendered once.

## A click only changes the name

The handler sits on the `<ul>`. React passes the event, and `({ target })` is `event.target`: the `<button>` under the cursor. The `<ul>` itself is `event.currentTarget`.

`data-tab-name="Features"` is read as `target.dataset.tabName`. The handler calls `setActiveTab("Features")` and stops there. It does not touch the panel.

Naming the parameter `target` and checking `target instanceof HTMLButtonElement` compares the whole `MouseEvent` to a button. That check is always false, so the name never updates.

`onClick` runs while the event bubbles from the button back up to the list. `onClickCapture` runs on the way down, before the button's own handler. The buttons do not call `stopPropagation()`, so either listener sees the click.

## The next render swaps the panel

`activeTab` starts as `defaultTab` or the first child's `name`. After the state update, `children.find` returns the child whose `name` matches, and the `<section role="tabpanel">` renders that child's `children`. `aria-labelledby` becomes `tab-{activeTab}`.

The caller writes `<Tab name="Features">…</Tab>` and never passes `isActive`. `cloneElement` copies the element and adds `isActive={child.props.name === activeTab}`. The button then renders `aria-selected={isActive}`. The green style is `button[aria-selected='true']` with no space before the brackets. A space looks for an element inside the button, and `[dataset=active]` is not a CSS attribute.

## The portal moves the panel, not the headers

`target` is a ref to a DOM node outside this component. When `target.current` is mounted, `createPortal` places the same panel in that node. The tab buttons stay in the `<ul>`. With no target, or before the node is mounted, the panel stays inline under the list.
