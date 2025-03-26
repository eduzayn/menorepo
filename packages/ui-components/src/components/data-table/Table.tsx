import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

import { TableHeader } from "./TableHeader"
import { TableBody } from "./TableBody"
import { TableFooter } from "./TableFooter"
import { TableHead } from "./TableHead"
import { TableRow } from "./TableRow"
import { TableCell } from "./TableCell"
import { TableCaption } from "./TableCaption"

const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableHeaderVariants = cva(
  "border-b bg-muted/50 font-medium [&>tr]:last:border-b-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tr:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableBodyVariants = cva(
  "[&>tr:last-child]:border-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tr:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableFooterVariants = cva(
  "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tr:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableRowVariants = cva(
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableHeadVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableCellVariants = cva(
  "p-4 align-middle [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  children: React.ReactNode
}

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {}

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {}

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableFooterVariants> {}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableHeadVariants> {
  sortable?: boolean
  sortDirection?: "asc" | "desc"
  onSort?: () => void
}

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableCellVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn(tableVariants({ variant }), className)}
          {...props}
        />
      </div>
    )
  }
)

Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant, ...props }, ref) => (
    <thead ref={ref} className={cn(tableHeaderVariants({ variant }), className)} {...props} />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, variant, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(tableBodyVariants({ variant }), className)}
      {...props}
    />
  )
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(tableFooterVariants({ variant }), className)}
      {...props}
    />
  )
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, variant, sortable, sortDirection, onSort, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(tableHeadVariants({ variant }), className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          className="flex items-center gap-1"
          onClick={onSort}
        >
          {props.children}
          {sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ChevronDown className="h-4 w-4" />
          ) : null}
        </button>
      ) : (
        props.children
      )}
    </th>
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, variant, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ variant }), className)}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableFooterVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
} 