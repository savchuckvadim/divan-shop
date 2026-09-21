type Vars = Record<string, string | number>;

export const interpolate = (template: string, vars: Vars): string =>
    template.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in vars ? String(vars[key]) : match
    );
