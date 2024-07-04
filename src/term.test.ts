import { Test, assertEqT, nat } from "things";
import { parseString } from "./index.js";

function parse(s : string, numResults : nat) {
    Test(() => {
        console.log("~~~~~~~~~~~~~~~~~~");
        console.log("parsing '" + s + "'");
        const results = parseString(s);
        assertEqT(numResults, results.length);
        let i = 1;
        for (const result of results) {
            console.log("  " + i + ") " + result);
            const reparsed = parseString(result);
            assertEqT(reparsed.length, 1);
            if (reparsed.length === 1) {
                assertEqT(result, reparsed[0]);
            }
            i++;
        }
        console.log("");
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
parse("P[]", 1);
parse("P", 1);
parse("filter (x. P[x]) L", 1);
parse("filter L pred: x. P[x]", 1);

