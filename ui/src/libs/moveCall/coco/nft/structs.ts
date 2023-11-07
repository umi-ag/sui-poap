import {String} from "../../_dependencies/onchain/0x1/string/structs";
import {UID} from "../../_dependencies/onchain/0x2/object/structs";
import {bcsOnchain as bcs} from "../../_framework/bcs";
import {FieldsWithTypes, Type} from "../../_framework/util";
import {Encoding} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== CoCoNFT =============================== */

bcs.registerStructType( "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::CoCoNFT", {
id: `0x2::object::UID`,
name: `0x1::string::String`,
description: `0x1::string::String`,
img_url: `0x1::string::String`,
created_by: `address`,
created_at: `u64`,
} )

export function isCoCoNFT(type: Type): boolean { return type === "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::CoCoNFT"; }

export interface CoCoNFTFields { id: string; name: string; description: string; imgUrl: string; createdBy: string; createdAt: bigint }

export class CoCoNFT { static readonly $typeName = "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::CoCoNFT"; static readonly $numTypeParams = 0;

  readonly id: string; readonly name: string; readonly description: string; readonly imgUrl: string; readonly createdBy: string; readonly createdAt: bigint

 constructor( fields: CoCoNFTFields, ) { this.id = fields.id; this.name = fields.name; this.description = fields.description; this.imgUrl = fields.imgUrl; this.createdBy = fields.createdBy; this.createdAt = fields.createdAt; }

 static fromFields( fields: Record<string, any> ): CoCoNFT { return new CoCoNFT( { id: UID.fromFields(fields.id).id, name: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.name).bytes)).toString(), description: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.description).bytes)).toString(), imgUrl: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.img_url).bytes)).toString(), createdBy: `0x${fields.created_by}`, createdAt: BigInt(fields.created_at) } ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): CoCoNFT { if (!isCoCoNFT(item.type)) { throw new Error("not a CoCoNFT type");

 } return new CoCoNFT( { id: item.fields.id.id, name: item.fields.name, description: item.fields.description, imgUrl: item.fields.img_url, createdBy: `0x${item.fields.created_by}`, createdAt: BigInt(item.fields.created_at) } ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): CoCoNFT { return CoCoNFT.fromFields( bcs.de([CoCoNFT.$typeName, ], data, encoding) ) }

 static fromSuiParsedData(content: SuiParsedData) { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCoCoNFT(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CoCoNFT object`); } return CoCoNFT.fromFieldsWithTypes(content); }

 static async fetch(client: SuiClient, id: string ): Promise<CoCoNFT> { const res = await client.getObject({ id, options: { showContent: true, }, }); if (res.error) { throw new Error(`error fetching CoCoNFT object at id ${id}: ${res.error.code}`); } if (res.data?.content?.dataType !== "moveObject" || !isCoCoNFT(res.data.content.type)) { throw new Error(`object at id ${id} is not a CoCoNFT object`); }
 return CoCoNFT.fromFieldsWithTypes(res.data.content); }

 }

/* ============================== NFT =============================== */

bcs.registerStructType( "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::NFT", {
dummy_field: `bool`,
} )

export function isNFT(type: Type): boolean { return type === "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::NFT"; }

export interface NFTFields { dummyField: boolean }

export class NFT { static readonly $typeName = "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::nft::NFT"; static readonly $numTypeParams = 0;

  readonly dummyField: boolean

 constructor( dummyField: boolean, ) { this.dummyField = dummyField; }

 static fromFields( fields: Record<string, any> ): NFT { return new NFT( fields.dummy_field ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): NFT { if (!isNFT(item.type)) { throw new Error("not a NFT type");

 } return new NFT( item.fields.dummy_field ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): NFT { return NFT.fromFields( bcs.de([NFT.$typeName, ], data, encoding) ) }

 }
