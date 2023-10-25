import * as package_1 from "../_dependencies/onchain/0x1/init";
import * as package_2 from "../_dependencies/onchain/0x2/init";
import * as package_26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72 from "../coco/init";
import {structClassLoaderOnchain as structClassLoader} from "./loader";

let initialized = false; export function initLoaderIfNeeded() { if (initialized) { return } initialized = true; package_1.registerClasses(structClassLoader);
package_2.registerClasses(structClassLoader);
package_26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72.registerClasses(structClassLoader);
 }
