import React, {
  cloneElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
} from 'react'
import tabs from './tabs.module.css'
import { createPortal } from 'react-dom'

type TTabProps = PropsWithChildren<{
  name: string
  isActive?: boolean
}>

type TTabsProps = {
  target?: RefObject<HTMLElement>
  defaultTab?: string
  children: ReactElement<TTabProps, typeof Tab>[]
}

/**
 * Step 1: Implement Tab component
 * - Render a <li role="presentation"> with a <button> inside
 * - Button attributes: role="tab", id="tab-{name}", data-tab-name={name},
 *   aria-controls="tab-panel", aria-selected={isActive}
 */
export function Tab({ name, isActive }: TTabProps) {
  return (
    <li role="presentation">
      <button
        type="button"
        role="tab"
        id={`tab-${name}`}
        data-tab-name={name}
        aria-controls="tab-panel"
        aria-selected={isActive}
      >
        {name}
      </button>
    </li>
  )
}

/**
 * Expected input:
 * <Tabs defaultTab="Tab 1">
 *   <Tab name="Tab 1">Content for tab 1</Tab>
 *   <Tab name="Tab 2">Content for tab 2</Tab>
 * </Tabs>
 *
 * Optional: <Tabs target={ref}> to render content into an external container via portal
 *
 * Step 2: Implement Tabs component
 * - Track activeTab with useState (default: defaultTab or first child's name)
 * - Render <nav> with <ul role="tablist"> containing children (Tab components)
 * - Use React.cloneElement to pass isActive={child.props.name === activeTab} to each Tab
 * - Handle click on <ul> to detect button clicks and update activeTab
 * - Find content of active tab from children props
 * - Render content in <section role="tabpanel" id="tab-panel" aria-labelledby="tab-{activeTab}">
 * - If target ref exists, use createPortal with a <div role="tabpanel"> wrapper instead
 */
export function Tabs({ defaultTab, children, target }: TTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || children[0].props.name)
  const content = children.find((child) => child.props.name === activeTab)?.props.children

  const handleClick = ({target}: React.MouseEvent<HTMLUListElement>) => {
    if (target instanceof HTMLButtonElement) {
      const tabName = target.dataset.tabName
      if (tabName) setActiveTab(tabName)
    }
  }

  return (
    <div>
      <nav>
        <ul role="tablist" onClick={handleClick} className={tabs.tabs}>
          {children.map((child) =>
            cloneElement(child, { isActive: child.props.name === activeTab, key: child.props.name }),
          )}
        </ul>
      </nav>

      {content && target?.current != null ? (
        createPortal(
          <div role="tabpanel" id="tab-panel" aria-labelledby={`tab-${activeTab}`} className={tabs.content}>
            {content}
          </div>,
          target.current,
        )
      ) : (
        <section role="tabpanel" id="tab-panel" aria-labelledby={`tab-${activeTab}`} className={tabs.content}>
          {content}
        </section>
      )}
    </div>
  )
}

/**
 * Step 3: Accessibility (a11y)
 * The following ARIA attributes are used in this component:
 *
 * Container:
 * - role="tablist" (on <ul>) — identifies the element as a container for tab controls,
 *   telling assistive technologies this is a set of tabs, not a regular list
 *
 * Tab items:
 * - role="presentation" (on <li>) — removes the list item semantics so screen readers
 *   don't announce "list item 1 of 3"; the meaningful role is on the <button> inside
 *
 * Tab buttons:
 * - role="tab" (on <button>) — identifies each button as a tab control, so screen readers
 *   announce it as "tab" rather than just "button"
 * - id="tab-{name}" — unique identifier used by aria-labelledby on the panel to create
 *   a programmatic link between the tab and its content
 * - aria-controls="tab-panel" — points to the id of the content panel this tab controls,
 *   allowing assistive technologies to navigate directly from tab to panel
 * - aria-selected={isActive} — indicates which tab is currently active; screen readers
 *   announce "selected" for the active tab so users know which tab they're on
 * - data-tab-name={name} — not an ARIA attribute, but used for click handling to identify
 *   which tab was clicked
 *
 * Content panel:
 * - role="tabpanel" (on <section> or portal <div>) — identifies the content area as a tab panel,
 *   so screen readers announce it as "tab panel" when the user navigates to it
 * - id="tab-panel" — unique identifier referenced by aria-controls on each tab button
 * - aria-labelledby="tab-{activeTab}" — links the panel to the currently active tab button,
 *   so screen readers announce the panel's label as the active tab's name (e.g., "Tab 1 tab panel")
 */
