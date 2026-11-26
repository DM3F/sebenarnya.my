/**
 * Sebenarnya design system — React components.
 * Import the CSS once (tokens.css, base.css, ui.css) and use these components; never restyle them
 * with your own colours or sizes. Rules: docs/design-system-rules.md in DM3F/sebenarnya.my.
 */
import type {
  AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ElementType, HTMLAttributes, InputHTMLAttributes,
  ReactElement, ReactNode, Ref, SelectHTMLAttributes, SVGProps, TableHTMLAttributes, TdHTMLAttributes,
  TextareaHTMLAttributes, ThHTMLAttributes,
} from 'react';

/** A Lucide icon component, e.g. `import { ArrowRight } from 'lucide-react'`. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string; absoluteStrokeWidth?: boolean }>;
export type VerdictType = 'palsu' | 'makluman' | 'benar';
type Div = HTMLAttributes<HTMLDivElement>;

/* ── Icon ─────────────────────────────────────────────────────────────── */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  icon: IconComponent;
  /** sm 14 · md 16 (default) · lg 20 · xl 24 · display 40. Never a number. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'display';
}
/** The only way to draw an icon: Lucide, 1.75px stroke, currentColor, aria-hidden. */
export declare function Icon(props: IconProps): ReactElement;

/* ── Actions ──────────────────────────────────────────────────────────── */
export type ButtonVariant = 'filled' | 'outline' | 'secondary' | 'ghost' | 'quiet' | 'media' | 'link';
export type ButtonSize = 'sm' | 'md' | 'default' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  /** filled (default, one per view) · outline · secondary · ghost (underlined) · quiet (toolbars, rows) · media (on photos) · link */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Lucide icon before the label. */
  icon?: IconComponent | ReactElement;
  /** Lucide icon after the label (e.g. ArrowRight). */
  iconEnd?: IconComponent | ReactElement;
  /** Renders a link. Pass `as={Link}` for next/link. */
  href?: string;
  as?: ElementType;
  type?: 'button' | 'submit' | 'reset';
  /** Element to focus first when inside a Dialog. */
  'data-autofocus'?: boolean;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}
export declare function Button(props: ButtonProps): ReactElement;
export interface IconButtonProps extends Omit<ButtonProps, 'icon' | 'iconEnd' | 'children'> {
  icon: IconComponent;
  /** Required: the accessible name (Malay), e.g. "Tutup". */
  label: string;
}
/** Icon-only button. Default variant outline, size icon. */
export declare function IconButton(props: IconButtonProps): ReactElement;
export declare function ButtonGroup(props: { className?: string; children?: ReactNode }): ReactElement;

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  /** Makes it a toggle (aria-pressed); selected = ink. */
  pressed?: boolean;
  /** Verdict dot for a verdict filter. */
  dot?: VerdictType;
  size?: 'sm' | 'md' | 'lg';
}
/** Taupe pill for suggestions and filters. */
export declare function Chip(props: ChipProps): ReactElement;
export declare function ChipRow(props: { label?: ReactNode; className?: string; children?: ReactNode }): ReactElement;

/* ── Labels ───────────────────────────────────────────────────────────── */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'muted' | 'outline' | 'media';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconComponent;
}
/** Static label. Not clickable. */
export declare function Badge(props: BadgeProps): ReactElement;
export interface VerdictProps {
  /** The only three verdicts. */
  type?: VerdictType;
  tone?: 'default' | 'single';
  variant?: 'pill' | 'overlay' | 'tint' | 'plain';
  /** e.g. "KPDN" — shown as "· KPDN". */
  agency?: string;
  /** Override the word (default Palsu / Makluman / Benar). */
  label?: string;
  className?: string;
}
/** Always dot + word (+ agency): never colour alone. */
export declare function Verdict(props: VerdictProps): ReactElement;

/* ── Navigation ───────────────────────────────────────────────────────── */
export interface TabItem { value: string; label: ReactNode; title?: string; lang?: string }
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name of the group. */
  label: string;
  /** tabs: switches views (arrow keys) · toggle: a setting (aria-pressed). */
  mode?: 'tabs' | 'toggle';
  className?: string;
}
export declare function Tabs(props: TabsProps): ReactElement;
export declare function NavLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; current?: boolean }): ReactElement;
export interface DropdownMenuProps {
  label: ReactNode;
  items: { label: ReactNode; href: string; current?: boolean }[];
  current?: boolean;
  align?: 'start' | 'end';
  className?: string;
}
export declare function DropdownMenu(props: DropdownMenuProps): ReactElement;
export interface LanguageMenuProps {
  items: { value: string; label: string; lang: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  groupLabel?: string;
  align?: 'start' | 'end';
  className?: string;
}
export declare function LanguageMenu(props: LanguageMenuProps): ReactElement;
export interface BreadcrumbProps {
  /** The last item is the current page. */
  items: { label: ReactNode; href?: string }[];
  /** e.g. next/link */
  linkAs?: ElementType;
  label?: string;
  className?: string;
}
export declare function Breadcrumb(props: BreadcrumbProps): ReactElement;
export interface PaginationProps {
  /** 1-based. */
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Render links instead of buttons. */
  href?: (page: number) => string;
  label?: string;
  className?: string;
}
export declare function Pagination(props: PaginationProps): ReactElement | null;

/* ── Forms ────────────────────────────────────────────────────────────── */
export interface SearchFieldProps {
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  /** null drops the submit button (live filtering). */
  buttonLabel?: string | null;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  error?: ReactNode;
  action?: string;
  onSubmit?: (query: string) => void;
  /** lg (default, the primary search) · md · sm (toolbar) */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function SearchField(props: SearchFieldProps): ReactElement;
export interface FieldProps {
  /** Always give a label; hideLabel keeps it for screen readers only. */
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  className?: string;
  /** Exactly one control (Input, Textarea, Select): Field wires id, aria-invalid, aria-describedby. */
  children: ReactElement;
}
export declare function Field(props: FieldProps): ReactElement;
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Pill shape for toolbar fields. */
  pill?: boolean;
  /** Leading Lucide icon. */
  icon?: IconComponent;
  size?: 'sm' | 'md' | 'lg';
  'data-autofocus'?: boolean;
}
export declare function Input(props: InputProps): ReactElement;
export declare function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>): ReactElement;
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  pill?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
/** Native select. Children are <option>s. */
export declare function Select(props: SelectProps): ReactElement;

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Required, also when hidden: it is the accessible name. */
  label: ReactNode;
  hint?: ReactNode;
  hideLabel?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
/** A choice sent with a form. */
export declare function Checkbox(props: ChoiceProps & { indeterminate?: boolean }): ReactElement;
/** A setting that applies at once (no Save). */
export declare function Switch(props: ChoiceProps): ReactElement;
export interface RadioGroupProps {
  /** The question (legend). */
  label: ReactNode;
  hideLabel?: boolean;
  name?: string;
  items: { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}
/** One of a few visible options (over ~5: use Select). */
export declare function RadioGroup(props: RadioGroupProps): ReactElement;

/* ── Surfaces & content ───────────────────────────────────────────────── */
export interface CardProps extends Div {
  /** muted (default, taupe) · outline (work panels) · raised (white, on taupe) */
  variant?: 'muted' | 'outline' | 'raised';
  /** sm · md (default) · lg — padding and radius travel together */
  size?: 'sm' | 'md' | 'lg';
  as?: ElementType;
}
export declare function Card(props: CardProps): ReactElement;
export declare function CardHeader(props: Div): ReactElement;
export declare function CardTitle(props: HTMLAttributes<HTMLHeadingElement> & { as?: ElementType }): ReactElement;
export declare function CardDescription(props: HTMLAttributes<HTMLParagraphElement>): ReactElement;
/** Top-right of a CardHeader. */
export declare function CardAction(props: Div): ReactElement;
export declare function CardContent(props: Div): ReactElement;
export declare function CardFooter(props: Div): ReactElement;

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Names the scroll region for screen readers and makes it keyboard-scrollable. */
  label?: string;
  caption?: ReactNode;
}
export declare function Table(props: TableProps): ReactElement;
export declare function TableHeader(props: HTMLAttributes<HTMLTableSectionElement>): ReactElement;
export declare function TableBody(props: HTMLAttributes<HTMLTableSectionElement>): ReactElement;
export declare function TableFooter(props: HTMLAttributes<HTMLTableSectionElement>): ReactElement;
export declare function TableCaption(props: HTMLAttributes<HTMLTableCaptionElement>): ReactElement;
export declare function TableRow(props: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }): ReactElement;
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-align numbers. */
  align?: 'num';
  /** Selection column. */
  check?: boolean;
  sort?: 'ascending' | 'descending' | 'none';
  /** Makes the heading a sort button. */
  onSort?: () => void;
}
export declare function TableHead(props: TableHeadProps): ReactElement;
export declare function TableCell(props: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'num'; check?: boolean }): ReactElement;

export declare function Separator(props: { orientation?: 'horizontal' | 'vertical'; decorative?: boolean; className?: string }): ReactElement;
export interface AvatarProps { src?: string; alt?: string; fallback?: string; size?: 'sm' | 'md'; className?: string }
/** Person or agency; initials when there is no image. */
export declare function Avatar(props: AvatarProps): ReactElement;
export interface SkeletonProps { variant?: 'block' | 'text' | 'circle'; width?: string; height?: string; className?: string }
/** Loading shape. Put aria-busy on the loading region. */
export declare function Skeleton(props: SkeletonProps): ReactElement;
export interface EmptyStateProps { icon?: IconComponent; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }
/** Nothing here yet: say what will appear and how to add the first one. */
export declare function EmptyState(props: EmptyStateProps): ReactElement;

/* ── Messages ─────────────────────────────────────────────────────────── */
export interface AlertProps {
  /** destructive is announced at once (role="alert"). */
  variant?: 'default' | 'success' | 'destructive';
  title?: ReactNode;
  icon?: IconComponent;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}
/** A message that stays on the page. */
export declare function Alert(props: AlertProps): ReactElement;
export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'success' | 'destructive';
  action?: { label: string; onClick?: () => void };
  /** ms, default 5000; Infinity keeps it. */
  duration?: number;
}
/** A short confirmation that goes away by itself. Needs <Toaster /> mounted once. */
export declare function toast(input: string | ToastOptions): number;
export declare namespace toast {
  function dismiss(id?: number): void;
}
export declare function Toaster(props: { label?: string }): ReactElement;
export interface TooltipProps {
  /** Short name of an icon-only control; never essential information. */
  content: ReactNode;
  side?: 'top' | 'bottom';
  children: ReactElement;
}
export declare function Tooltip(props: TooltipProps): ReactElement;

/* ── Dialogs ──────────────────────────────────────────────────────────── */
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** sm 400 · md 520 (default) · lg 720 */
  size?: 'sm' | 'md' | 'lg';
  /** false: a scrim click does not close it. */
  dismissible?: boolean;
  /** true while saving: Escape and the close button do nothing. */
  busy?: boolean;
  showClose?: boolean;
  icon?: ReactNode;
  className?: string;
}
/** A short task in a window. Put data-autofocus on the first control to focus. */
export declare function Dialog(props: DialogProps): ReactElement;
export interface ConfirmDialogOptions {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Say the verb: "Padam", "Terbitkan" — not "Ya". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Shown while onConfirm runs, e.g. "Memadam…". */
  pendingLabel?: string;
  /** destructive: warning mark + focus starts on Batal. The button is never red. */
  variant?: 'default' | 'destructive';
  /** May return a promise: waits, closes on success, shows the error message on failure. */
  onConfirm?: () => void | Promise<unknown>;
}
export interface ConfirmDialogProps extends ConfirmDialogOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}
/** A decision before an action that matters (role="alertdialog"). */
export declare function ConfirmDialog(props: ConfirmDialogProps): ReactElement;
/** Resolves true when confirmed (after onConfirm succeeds), false when cancelled. Needs <ConfirmDialogHost /> once. */
export declare function confirmDialog(options: ConfirmDialogOptions): Promise<boolean>;
export declare function ConfirmDialogHost(): ReactElement | null;

/* ── App shell (tools) ────────────────────────────────────────────────── */
export interface AppShellProps {
  /** A <Sidebar>. */
  sidebar: ReactNode;
  /** compact (default for tools) · default */
  density?: 'compact' | 'default';
  className?: string;
  children?: ReactNode;
}
export declare function AppShell(props: AppShellProps): ReactElement;
export declare function Sidebar(props: { label?: string; className?: string; children?: ReactNode }): ReactElement;
export declare function SidebarHeader(props: Div): ReactElement;
export declare function SidebarContent(props: HTMLAttributes<HTMLElement> & { label?: string }): ReactElement;
export declare function SidebarFooter(props: Div): ReactElement;
export declare function SidebarGroup(props: { label?: ReactNode; className?: string; children?: ReactNode }): ReactElement;
export interface SidebarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  href?: string;
  icon?: IconComponent;
  /** This page (aria-current="page"). */
  current?: boolean;
  /** A number to act on, e.g. 12 new claims. */
  count?: number;
  /** e.g. next/link */
  as?: ElementType;
}
export declare function SidebarItem(props: SidebarItemProps): ReactElement;
/** Opens the sidebar drawer at 900px and below. */
export declare function SidebarTrigger(props: { label?: string }): ReactElement;
export declare function Topbar(props: { actions?: ReactNode; className?: string; children?: ReactNode }): ReactElement;
/** One per page: title, one-line description, main actions. */
export declare function PageHeader(props: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }): ReactElement;
/** The page's <main id="main">. */
export declare function PageContent(props: HTMLAttributes<HTMLElement> & { as?: ElementType }): ReactElement;

/* ── Charts & meters (monochrome) ─────────────────────────────────────── */
export interface MeterProps { value: number; max?: number; label: ReactNode; valueText?: string; hint?: ReactNode; className?: string }
export declare function Meter(props: MeterProps): ReactElement;
export interface ChartDatum { label: string; value: number }
export interface BarListProps { title?: ReactNode; data: (ChartDatum & { href?: string })[]; format?: (value: number) => string; limit?: number; className?: string }
/** Ranking, largest first, numbers printed. */
export declare function BarList(props: BarListProps): ReactElement;
export interface BarChartProps { title?: ReactNode; description?: ReactNode; data: ChartDatum[]; format?: (value: number) => string; className?: string }
/** One measure over time (≤ ~31 columns). Never a second axis. */
export declare function BarChart(props: BarChartProps): ReactElement;
export interface StatProps {
  label: ReactNode;
  /** Already formatted, e.g. "1,208" or "6.2 jam". */
  value: ReactNode;
  /** Percent change, e.g. 12.5 or -4. */
  delta?: number;
  deltaLabel?: string;
  trend?: number[];
  className?: string;
}
export declare function Stat(props: StatProps): ReactElement;
export declare function Sparkline(props: { data: number[]; className?: string }): ReactElement;
