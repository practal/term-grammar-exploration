// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	// Moo lexer documention is here:
	// https://github.com/no-context/moo

	const moo = require("moo")
	const lexer = moo.compile({
	  ws:  /[ \t]+/,
	  label: /[a-zA-Z]+\:/,
	  id: /[a-zA-Z]+/,
	  varid: /\?[a-zA-Z]+/,
	  absid: /![a-zA-Z]+/,
	  dot: /\./,
	  ropen: "(",
	  rclose: ")",
	  sopen: "[",
	  sclose: "]",
	  comma: ",",
	});


function text(d) { return d[0].text; }

function isAbs(r) {
	return (typeof r === "object" && r[0] === "abs");
}

const invalid = ["invalid"];

function isInvalid(r) {
	return (typeof r === "object" && r[0] === "invalid");
}

function isTemplate(r) {
	return (typeof r === "object" && r[0] === "template");
}

function isBracket(r) {
	return (typeof r === "object" && r[0] === "bracket");
}

function isLabel(r) {
	return (typeof r === "object" && r[0] === "label");
}

function isBlock(r) {
	return (typeof r === "object" && r[0] === "block");
}

function isVar(r) {
	return (typeof r === "object" && r[0] === "var");
}


function argsOfAbs(r) {
	return r.slice(2);
}

function checkArgs(args) {
	for (const [i, arg] of args.entries()) {
		if (isAbs(arg) && argsOfAbs(arg).length > 0) return false;
		if (isTemplate(arg)) {
			if (args.length === 1) continue;
			if (i === args.length - 1 && isLabel(args[args.length - 2])) continue;
			return false;
		}
	}
	
	return true;
}

function abs(name, ...args) {
	if (!checkArgs(args)) return invalid;
	return ["abs", name, ...args];
}

function varapp(name, ...args) {
	return ["var", name, ...args];	
}

function template(binders, body) {
	return ["template", binders, body];
}

function bracket(r) {
	return ["bracket", r];
}

function label(r) {
	return ["label", r.slice(0, r.length-1)];
}

function block(r) {
	if (!checkArgs(r)) return invalid;
	return ["block", ...r];
}


function pretty(r) {
    function mkVar(name) {
        if (!name.startsWith("?")) return "?" + name;
        else return name;
    }
	if (isInvalid(r)) return "invalid";
	if (typeof r === "string") return r;
	if (isLabel(r)) return r[1] + ":";
	if (isAbs(r)) {
		let name = r[1];
        if (!name.startsWith("!")) name = "!" + name;
		const args = r.slice(2).map(pretty);
		return [name, ...args].join(" ");
	}
	if (isTemplate(r)) {
		return r[1].map(mkVar).join(" ") + ". " + pretty(r[2]);
	}
	if (isBracket(r)) {
		return "(" + pretty(r[1]) + ")";
	}
	if (isBlock(r)) {
		return "[" + r.slice(1).map(pretty).join(" ") + "]";
	}
	if (isVar(r)) {
        let name = mkVar(r[1]);
        const args = r.slice(2);
        if (args.length > 0)
		    return name + "[" + args.map(pretty).join(", ") + "]";
        else 
            return name;
	}
	return r;
}

function check(result, reject) {
	if (isInvalid(result)) return reject;
	else return result;
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Main", "symbols": ["Term"], "postprocess": d => pretty(d[0])},
    {"name": "Main", "symbols": ["Template"], "postprocess": d => pretty(d[0])},
    {"name": "Term", "symbols": ["AbsApp"], "postprocess": id},
    {"name": "Term", "symbols": ["VarApp"], "postprocess": id},
    {"name": "Term", "symbols": ["Id"], "postprocess": id},
    {"name": "Id", "symbols": [(lexer.has("id") ? {type: "id"} : id)], "postprocess": text},
    {"name": "Var", "symbols": [(lexer.has("varid") ? {type: "varid"} : varid)], "postprocess": text},
    {"name": "Abs", "symbols": [(lexer.has("absid") ? {type: "absid"} : absid)], "postprocess": text},
    {"name": "AbsOrId", "symbols": ["Abs"], "postprocess": id},
    {"name": "AbsOrId", "symbols": ["Id"], "postprocess": id},
    {"name": "VarOrId", "symbols": ["Var"], "postprocess": id},
    {"name": "VarOrId", "symbols": ["Id"], "postprocess": id},
    {"name": "Label", "symbols": [(lexer.has("label") ? {type: "label"} : label)], "postprocess": d => label(d[0].text)},
    {"name": "AbsApp", "symbols": ["Abs"], "postprocess": d => abs(d[0])},
    {"name": "AbsApp", "symbols": ["AbsOrId", (lexer.has("ws") ? {type: "ws"} : ws), "AbsArgs"], "postprocess": (d, l, r) => check(abs(d[0], ...d[2]), r)},
    {"name": "AbsArgs", "symbols": ["TemplateOrTerm"], "postprocess": d => [d[0]]},
    {"name": "AbsArgs", "symbols": ["TemplateOrTerm", (lexer.has("ws") ? {type: "ws"} : ws), "AbsArgs"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "AbsArgs", "symbols": ["Label"], "postprocess": d => [d[0]]},
    {"name": "AbsArgs", "symbols": ["Label", (lexer.has("ws") ? {type: "ws"} : ws), "AbsArgs"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "AbsArgs", "symbols": ["Block"], "postprocess": d => [d[0]]},
    {"name": "AbsArgs", "symbols": ["Block", (lexer.has("ws") ? {type: "ws"} : ws), "AbsArgs"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "TemplateOrTerm", "symbols": ["Term"], "postprocess": id},
    {"name": "TemplateOrTerm", "symbols": ["Template"], "postprocess": id},
    {"name": "TemplateOrTerm", "symbols": ["Bracket"], "postprocess": id},
    {"name": "VarApp", "symbols": ["Var"], "postprocess": d => varapp(d[0])},
    {"name": "VarApp", "symbols": ["VarOrId", (lexer.has("sopen") ? {type: "sopen"} : sopen), "TermList", (lexer.has("sclose") ? {type: "sclose"} : sclose)], "postprocess": d => varapp(d[0], ...d[2])},
    {"name": "Template", "symbols": ["Binders", (lexer.has("dot") ? {type: "dot"} : dot), (lexer.has("ws") ? {type: "ws"} : ws), "Term"], "postprocess": d => template(d[0], d[3])},
    {"name": "Binders", "symbols": ["VarOrId"], "postprocess": d => [d[0]]},
    {"name": "Binders", "symbols": ["VarOrId", (lexer.has("ws") ? {type: "ws"} : ws), "Binders"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "Bracket", "symbols": [(lexer.has("ropen") ? {type: "ropen"} : ropen), "TemplateOrTerm", (lexer.has("rclose") ? {type: "rclose"} : rclose)], "postprocess": d => bracket(d[1])},
    {"name": "Block", "symbols": [(lexer.has("sopen") ? {type: "sopen"} : sopen), "AbsArgs", (lexer.has("sclose") ? {type: "sclose"} : sclose)], "postprocess": (d, l, r) => check(block(d[1]), r)},
    {"name": "TermList1", "symbols": ["Term"], "postprocess": d => [d[0]]},
    {"name": "TermList1", "symbols": ["Term", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "TermList1"], "postprocess": d => [d[0], ...d[3]]},
    {"name": "TermList1", "symbols": ["TermListBlock"], "postprocess": d => d[0]},
    {"name": "TermList1", "symbols": ["TermListBlock", (lexer.has("ws") ? {type: "ws"} : ws), "TermList1"], "postprocess": d => [...d[0], ...d[2]]},
    {"name": "TermList", "symbols": [], "postprocess": d => []},
    {"name": "TermList", "symbols": ["TermList1"], "postprocess": d => d[0]},
    {"name": "TermListBlock", "symbols": [(lexer.has("sopen") ? {type: "sopen"} : sopen), "TermList", (lexer.has("sclose") ? {type: "sclose"} : sclose)], "postprocess": d => d[1]}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
