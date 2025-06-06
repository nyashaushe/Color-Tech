import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/lib/variants";
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element;
export { Badge };
export { badgeVariants } from "@/lib/variants";
