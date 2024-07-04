import { Test, assertEqT, nat } from "things";
import nearley from "nearley";
import grammar from "./term.cjs";

function parse(s : string, numResults : nat) {
    Test(() => {
        console.log("~~~~~~~~~~~~~~~~~~");
        console.log("parsing '" + s + "'");
        let num = 0;
        try {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            parser.feed(s);
            console.log(parser.results);
            console.log("");
            num = parser.results.length;
        } catch {}
        assertEqT(numResults, num);
    }, "parsing '" + s + "'");
}

parse("equals x y", 1);
parse("a b: (x z. y) c:", 2);
parse("#", 0);
parse("q forall x y. a b", 2);
parse("forall x y. a b", 2);
parse("forall x. exists y. equals x y", 2);
parse("forall (x. exists (y. equals x y))", 1);
parse("equals (x y)", 1);
parse("equals (forall x y. a b)", 2);
parse("x y z. a", 2);
parse("forall x. y d: a. b e:", 2);
parse("a b [c: u. u d: u. u]", 1);
parse("P[x u [r], u [k]]", 1);
parse("P[[x] [y, z]]", 1);

