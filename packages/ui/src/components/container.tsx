import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

function Container({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="container" className={cn("container", className)} {...props} />;
}

export { Container };
