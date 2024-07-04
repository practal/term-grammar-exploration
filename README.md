# Term Grammar Exploration with [Nearley](https://nearley.js.org)

This is a playground for experimenting with what restrictions are necessary to
allow abstraction algebra syntax such as 
```
forall x. exists y. equals x y
```
as short form for 
```
forall (x. exists (y. equals x y))
```
while making sure that the parse result is still unique. 

Two conditions have been identified:

* Arguments of abstraction applications which are abstraction applications
 themselves cannot have any arguments.
* If the argument of an abstraction application is a template, it is either
  the only argument, or it is the last argument with a label directly in front of it.

To make sure that an identifier is interpreted as an abstraction name, prefix it with
`!`, as in `!forall`. To make sure that an identifier is interpreted as a variable name,
prefix it with `?`. The parse result will prefix all identifiers accordingly,
but will leave those identifiers unprefixed where it cannot be determined without 
further context if the identifier refers to an abstraction or a variable.

To run all examples: 
```
npm install
npm test
```