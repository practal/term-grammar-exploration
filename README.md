# Term Grammar Exploration with [Nearley](https://nearley.js.org)

This is a playground for experimenting with restrictions necessary to
allow abstraction algebra syntax such as 
```
forall x. exists y. equals x y
```
as short form for 
```
forall (x. exists (y. equals x y))
```
while making sure that the parse result is still unique. 

Two sufficient (?) restrictions have been identified:

* Arguments of abstraction applications which are abstraction applications
 themselves cannot have any arguments.
* If the argument of an abstraction application is a template, it is either
  the only argument, or it is the last argument with a label directly in front of it.

To make sure that an identifier is interpreted as an abstraction name, prefix it with
`!`, as in `!forall`. To make sure that an identifier is interpreted as a variable name,
prefix it with `?`. The parse result will prefix all identifiers accordingly,
but will leave those identifiers unprefixed where it cannot be determined without 
further context if the identifier refers to an abstraction or a variable.

The syntax `[ ... ]` for blocks is used to simulate indentation blocks,
as when parsing recursive text.

To run all examples: 
```
npm install
npm test
```

The output should be something like:
```
There are 18 tests to run.
------------------------------------------------
~~~~~~~~~~~~~~~~~~
parsing 'equals x y'
  1) !equals x y

~~~~~~~~~~~~~~~~~~
parsing 'a b: (x z. y) c:'
  1) !a b: (!x ?z. y) c:
  2) !a b: (?x ?z. y) c:

~~~~~~~~~~~~~~~~~~
parsing '#'

~~~~~~~~~~~~~~~~~~
parsing 'q forall x y. a b'
  1) ?q ?forall ?x ?y. !a b
  2) !q ?forall ?x ?y. !a b

~~~~~~~~~~~~~~~~~~
parsing 'forall x y. a b'
  1) ?forall ?x ?y. !a b
  2) !forall ?x ?y. !a b

~~~~~~~~~~~~~~~~~~
parsing 'forall x. exists y. equals x y'
  1) ?forall ?x. !exists ?y. !equals x y
  2) !forall ?x. !exists ?y. !equals x y

~~~~~~~~~~~~~~~~~~
parsing 'forall (x. exists (y. equals x y))'
  1) !forall (?x. !exists (?y. !equals x y))

~~~~~~~~~~~~~~~~~~
parsing 'equals (x y)'
  1) !equals (!x y)

~~~~~~~~~~~~~~~~~~
parsing 'equals (forall x y. a b)'
  1) !equals (!forall ?x ?y. !a b)
  2) !equals (?forall ?x ?y. !a b)

~~~~~~~~~~~~~~~~~~
parsing 'x y z. a'
  1) ?x ?y ?z. a
  2) !x ?y ?z. a

~~~~~~~~~~~~~~~~~~
parsing 'forall x. y d: a. b e:'
  1) ?forall ?x. !y d: ?a. !b e:
  2) !forall ?x. !y d: ?a. !b e:

~~~~~~~~~~~~~~~~~~
parsing 'a b [c: u. u d: u. u]'
  1) !a b [c: ?u. !u d: ?u. u]

~~~~~~~~~~~~~~~~~~
parsing 'P[x u [r], u [k]]'
  1) ?P[!x u [r], !u [k]]

~~~~~~~~~~~~~~~~~~
parsing 'P[[x] [y, z]]'
  1) ?P[x, y, z]

~~~~~~~~~~~~~~~~~~
parsing 'P[]'
  1) ?P

~~~~~~~~~~~~~~~~~~
parsing 'P'
  1) P

~~~~~~~~~~~~~~~~~~
parsing 'filter (x. P[x]) L'
  1) !filter (?x. ?P[x]) L

~~~~~~~~~~~~~~~~~~
parsing 'filter L pred: x. P[x]'
  1) !filter L pred: ?x. ?P[x]

------------------------------------------------
All 18 tests concluded successfully.
```