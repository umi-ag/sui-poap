import * as package_1 from "../_dependencies/onchain/0x1/init";
import * as package_2 from "../_dependencies/onchain/0x2/init";
import * as package_e46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5 from "../coco/init";
import {structClassLoaderOnchain as structClassLoader} from "./loader";

let initialized = false; export function initLoaderIfNeeded() { if (initialized) { return } initialized = true; package_1.registerClasses(structClassLoader);
package_2.registerClasses(structClassLoader);
package_e46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5.registerClasses(structClassLoader);
 }
