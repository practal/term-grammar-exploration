@{%
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
%}

@{%
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
	if (isInvalid(r)) return "invalid";
	if (typeof r === "string") return r;
	if (isLabel(r)) return r[1] + ":";
	if (isAbs(r)) {
		const name = r[1];
		const args = r.slice(2).map(pretty);
		return name + "(" + args.join(", ") + ")";
	}
	if (isTemplate(r)) {
		return "{" + r[1].join(" ") + " ⟹ " + pretty(r[2]) + "}";
	}
	if (isBracket(r)) {
		return "[" + pretty(r[1]) + "]";
	}
	if (isBlock(r)) {
		return "⟦" + r.slice(1).map(pretty).join(", ") + "⟧";
	}
	if (isVar(r)) {
		return pretty(r[1]) + "[" + r.slice(2).map(pretty).join(", ") + "]";
	}
	return r;
}

function check(result, reject) {
	if (isInvalid(result)) return reject;
	else return result;
}
%}

# Pass your lexer with @lexer:
@lexer lexer

Main -> 
  Term {% d => pretty(d[0]) %}
| Template {% d => pretty(d[0]) %}

Term -> AbsApp {% id %} | VarApp {% id %} | Id {% id %}

Id -> %id {% text %}

Var -> %varid {% text %}

Abs -> %absid {% text %}

AbsOrId -> Abs {% id %} | Id {% id %}

VarOrId -> Var {% id %} | Id {% id %}

Label -> %label {% d => label(d[0].text) %}

AbsApp -> 
  Abs {% d => abs(d[0]) %} 
| AbsOrId %ws AbsArgs {% (d, l, r) => check(abs(d[0], ...d[2]), r) %}

AbsArgs -> 
  TemplateOrTerm {% d => [d[0]] %}
| TemplateOrTerm %ws AbsArgs {% d => [d[0], ...d[2]] %}
| Label {% d => [d[0]] %}
| Label %ws AbsArgs {% d => [d[0], ...d[2]] %}
| Block {% d => [d[0]] %}
| Block %ws AbsArgs {% d => [d[0], ...d[2]] %}

TemplateOrTerm -> 
  Term {% id %}
| Template {% id %}
| Bracket {% id %}

VarApp -> 
  Var {% d => varapp(d[0]) %}
| VarOrId %sopen TermList %sclose {% d => varapp(d[0], ...d[2]) %}

Template -> Binders %dot %ws Term {% d => template(d[0], d[3]) %}

Binders -> 
  VarOrId {% d => [d[0]] %}
| VarOrId %ws Binders {% d => [d[0], ...d[2]] %}

Bracket -> %ropen TemplateOrTerm %rclose {% d => bracket(d[1]) %}

Block -> %sopen AbsArgs %sclose {% (d, l, r) => check(block(d[1]), r) %}

TermList1 -> 
  Term {% d => [d[0]] %}
| Term %comma %ws TermList1 {% d => [d[0], ...d[3]] %}
| TermListBlock {% d => d[0] %}
| TermListBlock %ws TermList1 {% d => [...d[0], ...d[2]] %}

TermList -> null {% d => [] %} | TermList1 {% d => d[0] %}

TermListBlock -> %sopen TermList %sclose {% d => d[1] %}

