import * as issuer from "./issuer/structs";
import * as nft from "./nft/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(nft.CoCoNFT);
loader.register(nft.NFT);
loader.register(issuer.EventConfig);
 }
