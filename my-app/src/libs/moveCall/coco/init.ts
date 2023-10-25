import * as item from "./item/structs";
import * as myNft from "./my-nft/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(item.CoCoItem);
loader.register(item.ITEM);
loader.register(myNft.CoCoNFT);
loader.register(myNft.MY_NFT);
 }
