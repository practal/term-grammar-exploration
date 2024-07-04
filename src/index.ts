import nearley from "nearley";
import grammar from "./term.cjs";

export function parseString(s : string) : string[] {
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(s);
        return parser.results;
    } catch {
        return [];
    }
}

