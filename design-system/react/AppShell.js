'use client';

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { IconButton } from './Button';
import Icon from './Icon';

/**
 * AppShell — the frame of a tool (CMS, admin): sidebar + top bar + content.
 * The product fills it; the shell only lays it out and handles the small-screen drawer.
 *
 *   <AppShell density="compact" sidebar={
 *     <Sidebar>
 *       <SidebarHeader>…logo…</SidebarHeader>
 *       <SidebarContent label="Menu utama">
 *         <SidebarGroup label="Kandungan">
 *           <SidebarItem href="/semakan" icon={FileCheck} current count={12}>Semakan fakta</SidebarItem>
 *         </SidebarGroup>
 *       </SidebarContent>
 *       <SidebarFooter>…account…</SidebarFooter>
 *     </Sidebar>
 *   }>
 *     <Topbar><SidebarTrigger /><Breadcrumb … /></Topbar>
 *     <PageContent>
 *       <PageHeader title="Semakan fakta" description="…" actions={<Button>…</Button>} />
 *       …page…
 *     </PageContent>
 *   </AppShell>
 *
 * Desktop: the sidebar is always there (--size-sidebar wide). At 900px and below it becomes
 * a drawer: SidebarTrigger opens it, Escape / the scrim / a link close it, focus returns to the
 * trigger, and the page behind is inert while it is open.
 *   density: "compact" (default, for tools) · "default"
 */
const ShellContext = createContext(null);
const useShell = () => useContext(ShellContext);
const DRAWER = '(max-width: 900px)'; // same as the md breakpoint in tokens.css

export function AppShell({ sidebar, density = 'compact', className = '', children }) {
  const [open, setOpen] = useState(false);
  const sidebarId = useId();
  const triggerRef = useRef(null);
  const sidebarRef = useRef(null);

  const returnFocus = useRef(false);

  // Escape and the scrim hand focus back to the menu button; a link click does not (a new page loads)
  const close = useCallback(() => {
    returnFocus.current = true;
    setOpen(false);
  }, []);

  // Opening moves focus into the drawer; growing past 900px closes it
  useEffect(() => {
    if (!open) {
      // After the commit: the page is no longer inert, so the button can take focus
      if (returnFocus.current) triggerRef.current?.focus();
      returnFocus.current = false;
      return undefined;
    }
    // One frame later, once the drawer is rendered visible
    const frame = requestAnimationFrame(() => sidebarRef.current?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    const mq = window.matchMedia(DRAWER);
    const onChange = () => !mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <ShellContext.Provider value={{ open, setOpen, close, sidebarId, triggerRef, sidebarRef }}>
      <div
        className={`ui-shell ${className}`.trim()}
        data-density={density === 'default' ? undefined : density}
        data-open={open ? '' : undefined}
        onKeyDown={(e) => open && e.key === 'Escape' && close()}
      >
        <div className="ui-shell__scrim" aria-hidden="true" onClick={close} />
        {sidebar}
        <div className="ui-shell__main" inert={open ? true : undefined}>
          {children}
        </div>
      </div>
    </ShellContext.Provider>
  );
}

/** Sidebar — the column beside the page: logo, navigation (SidebarContent), account. */
export function Sidebar({ label = 'Bar sisi', className = '', children }) {
  const shell = useShell();
  return (
    <aside
      ref={shell?.sidebarRef}
      id={shell?.sidebarId}
      aria-label={label}
      className={`ui-sidebar ${className}`.trim()}
      // On a phone a link click lands on a new page: close the drawer
      onClick={(e) => e.target.closest('a') && shell?.open && shell.setOpen(false)}
    >
      {children}
    </aside>
  );
}

export const SidebarHeader = ({ className = '', ...props }) => <div className={`ui-sidebar__header ${className}`.trim()} {...props} />;
/** SidebarContent — the scrolling navigation. `label` names the nav for screen readers. */
export const SidebarContent = ({ label = 'Menu utama', className = '', ...props }) => <nav aria-label={label} className={`ui-sidebar__content ${className}`.trim()} {...props} />;
export const SidebarFooter = ({ className = '', ...props }) => <div className={`ui-sidebar__footer ${className}`.trim()} {...props} />;

/** SidebarGroup — a labelled set of items ("Kandungan", "Tetapan"). */
export function SidebarGroup({ label, className = '', children }) {
  const id = useId();
  return (
    <div className={`ui-sidebar__group ${className}`.trim()} role="group" aria-labelledby={label ? id : undefined}>
      {label && <p className="ui-sidebar__group-label" id={id}>{label}</p>}
      <ul className="ui-sidebar__list">{children}</ul>
    </div>
  );
}

/**
 * SidebarItem — one destination.
 *   href · icon (Lucide) · current (this page: aria-current) · count (a number to act on, e.g. 12 new claims)
 *   as={Link} for a router link; without href it renders a button (onClick).
 */
export function SidebarItem({ href, icon, current = false, count, as, className = '', children, ...props }) {
  const Tag = href ? (as ?? 'a') : 'button';
  return (
    <li>
      <Tag
        href={href}
        type={href ? undefined : 'button'}
        aria-current={current ? 'page' : undefined}
        className={`ui-sidebar__item ${className}`.trim()}
        {...props}
      >
        {icon && <Icon icon={icon} />}
        <span className="ui-sidebar__label">{children}</span>
        {count != null && <span className="ui-sidebar__count">{count}</span>}
      </Tag>
    </li>
  );
}

/** SidebarTrigger — opens the drawer at 900px and below; hidden on wider screens. */
export function SidebarTrigger({ label = 'Buka menu' }) {
  const shell = useShell();
  return (
    <IconButton
      ref={shell?.triggerRef}
      icon={PanelLeft}
      label={label}
      variant="quiet"
      className="ui-sidebar-trigger"
      aria-expanded={shell?.open ?? false}
      aria-controls={shell?.sidebarId}
      onClick={() => shell?.setOpen((v) => !v)}
    />
  );
}

/** Topbar — the bar above the page: trigger, breadcrumb or title on the left, actions on the right. */
export function Topbar({ actions, className = '', children }) {
  return (
    <header className={`ui-topbar ${className}`.trim()}>
      <div className="ui-topbar__start">{children}</div>
      {actions && <div className="ui-topbar__actions">{actions}</div>}
    </header>
  );
}

/** PageHeader — the page's title, a one-line description and its main actions. One per page. */
export function PageHeader({ title, description, actions, className = '' }) {
  return (
    <div className={`ui-page-header ${className}`.trim()}>
      <div className="ui-page-header__text">
        <h1 className="ui-page-header__title">{title}</h1>
        {description && <p className="ui-page-header__description">{description}</p>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </div>
  );
}

/** PageContent — the padded area under the top bar: the page's <main> (target of the skip link). */
export const PageContent = ({ as: Tag = 'main', id = 'main', className = '', ...props }) => (
  <Tag className={`ui-page-content ${className}`.trim()} id={id} tabIndex={Tag === 'main' ? -1 : undefined} {...props} />
);
