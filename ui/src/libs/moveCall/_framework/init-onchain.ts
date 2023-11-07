import * as package_1 from "../_dependencies/onchain/0x1/init";
import * as package_2 from "../_dependencies/onchain/0x2/init";
import * as package_683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379 from "../coco/init";
import {structClassLoaderOnchain as structClassLoader} from "./loader";

let initialized = false; export function initLoaderIfNeeded() { if (initialized) { return } initialized = true; package_1.registerClasses(structClassLoader);
package_2.registerClasses(structClassLoader);
package_683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379.registerClasses(structClassLoader);
 }
