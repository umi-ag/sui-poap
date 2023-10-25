import {String} from "../../_dependencies/onchain/0x1/string/structs";
import {UID} from "../../_dependencies/onchain/0x2/object/structs";
import {bcsOnchain as bcs} from "../../_framework/bcs";
import {FieldsWithTypes, Type} from "../../_framework/util";
import {Encoding} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== CoCoNFT =============================== */

bcs.registerStructType( "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::CoCoNFT", {
id: `0x2::object::UID`,
name: `0x1::string::String`,
description: `0x1::string::String`,
img_url: `0x1::string::String`,
count: `u64`,
} )

export function isCoCoNFT(type: Type): boolean { return type === "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::CoCoNFT"; }

export interface CoCoNFTFields { id: string; name: string; description: string; imgUrl: string; count: bigint }

export class CoCoNFT { static readonly $typeName = "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::CoCoNFT"; static readonly $numTypeParams = 0;

  readonly id: string; readonly name: string; readonly description: string; readonly imgUrl: string; readonly count: bigint

 constructor( fields: CoCoNFTFields, ) { this.id = fields.id; this.name = fields.name; this.description = fields.description; this.imgUrl = fields.imgUrl; this.count = fields.count; }

 static fromFields( fields: Record<string, any> ): CoCoNFT { return new CoCoNFT( { id: UID.fromFields(fields.id).id, name: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.name).bytes)).toString(), description: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.description).bytes)).toString(), imgUrl: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.img_url).bytes)).toString(), count: BigInt(fields.count) } ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): CoCoNFT { if (!isCoCoNFT(item.type)) { throw new Error("not a CoCoNFT type");

 } return new CoCoNFT( { id: item.fields.id.id, name: item.fields.name, description: item.fields.description, imgUrl: item.fields.img_url, count: BigInt(item.fields.count) } ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): CoCoNFT { return CoCoNFT.fromFields( bcs.de([CoCoNFT.$typeName, ], data, encoding) ) }

 static fromSuiParsedData(content: SuiParsedData) { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCoCoNFT(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CoCoNFT object`); } return CoCoNFT.fromFieldsWithTypes(content); }

 static async fetch(client: SuiClient, id: string ): Promise<CoCoNFT> { const res = await client.getObject({ id, options: { showContent: true, }, }); if (res.error) { throw new Error(`error fetching CoCoNFT object at id ${id}: ${res.error.code}`); } if (res.data?.content?.dataType !== "moveObject" || !isCoCoNFT(res.data.content.type)) { throw new Error(`object at id ${id} is not a CoCoNFT object`); }
 return CoCoNFT.fromFieldsWithTypes(res.data.content); }

 }

/* ============================== MY_NFT =============================== */

bcs.registerStructType( "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::MY_NFT", {
dummy_field: `bool`,
} )

export function isMY_NFT(type: Type): boolean { return type === "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::MY_NFT"; }

export interface MY_NFTFields { dummyField: boolean }

export class MY_NFT { static readonly $typeName = "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::my_nft::MY_NFT"; static readonly $numTypeParams = 0;

  readonly dummyField: boolean

 constructor( dummyField: boolean, ) { this.dummyField = dummyField; }

 static fromFields( fields: Record<string, any> ): MY_NFT { return new MY_NFT( fields.dummy_field ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): MY_NFT { if (!isMY_NFT(item.type)) { throw new Error("not a MY_NFT type");

 } return new MY_NFT( item.fields.dummy_field ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): MY_NFT { return MY_NFT.fromFields( bcs.de([MY_NFT.$typeName, ], data, encoding) ) }

 }
