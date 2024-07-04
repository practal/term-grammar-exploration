import { configureDebugging, runTests } from "things";
import "./term.test.js";

configureDebugging(console.log);
runTests();

