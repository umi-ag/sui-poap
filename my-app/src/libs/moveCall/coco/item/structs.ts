import {String} from "../../_dependencies/onchain/0x1/string/structs";
import {UID} from "../../_dependencies/onchain/0x2/object/structs";
import {bcsOnchain as bcs} from "../../_framework/bcs";
import {FieldsWithTypes, Type} from "../../_framework/util";
import {Encoding} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== CoCoItem =============================== */

bcs.registerStructType( "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::CoCoItem", {
id: `0x2::object::UID`,
name: `0x1::string::String`,
description: `0x1::string::String`,
img_url: `0x1::string::String`,
date: `0x1::string::String`,
} )

export function isCoCoItem(type: Type): boolean { return type === "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::CoCoItem"; }

export interface CoCoItemFields { id: string; name: string; description: string; imgUrl: string; date: string }

export class CoCoItem { static readonly $typeName = "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::CoCoItem"; static readonly $numTypeParams = 0;

  readonly id: string; readonly name: string; readonly description: string; readonly imgUrl: string; readonly date: string

 constructor( fields: CoCoItemFields, ) { this.id = fields.id; this.name = fields.name; this.description = fields.description; this.imgUrl = fields.imgUrl; this.date = fields.date; }

 static fromFields( fields: Record<string, any> ): CoCoItem { return new CoCoItem( { id: UID.fromFields(fields.id).id, name: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.name).bytes)).toString(), description: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.description).bytes)).toString(), imgUrl: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.img_url).bytes)).toString(), date: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.date).bytes)).toString() } ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): CoCoItem { if (!isCoCoItem(item.type)) { throw new Error("not a CoCoItem type");

 } return new CoCoItem( { id: item.fields.id.id, name: item.fields.name, description: item.fields.description, imgUrl: item.fields.img_url, date: item.fields.date } ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): CoCoItem { return CoCoItem.fromFields( bcs.de([CoCoItem.$typeName, ], data, encoding) ) }

 static fromSuiParsedData(content: SuiParsedData) { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isCoCoItem(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a CoCoItem object`); } return CoCoItem.fromFieldsWithTypes(content); }

 static async fetch(client: SuiClient, id: string ): Promise<CoCoItem> { const res = await client.getObject({ id, options: { showContent: true, }, }); if (res.error) { throw new Error(`error fetching CoCoItem object at id ${id}: ${res.error.code}`); } if (res.data?.content?.dataType !== "moveObject" || !isCoCoItem(res.data.content.type)) { throw new Error(`object at id ${id} is not a CoCoItem object`); }
 return CoCoItem.fromFieldsWithTypes(res.data.content); }

 }

/* ============================== ITEM =============================== */

bcs.registerStructType( "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::ITEM", {
dummy_field: `bool`,
} )

export function isITEM(type: Type): boolean { return type === "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::ITEM"; }

export interface ITEMFields { dummyField: boolean }

export class ITEM { static readonly $typeName = "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72::item::ITEM"; static readonly $numTypeParams = 0;

  readonly dummyField: boolean

 constructor( dummyField: boolean, ) { this.dummyField = dummyField; }

 static fromFields( fields: Record<string, any> ): ITEM { return new ITEM( fields.dummy_field ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): ITEM { if (!isITEM(item.type)) { throw new Error("not a ITEM type");

 } return new ITEM( item.fields.dummy_field ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): ITEM { return ITEM.fromFields( bcs.de([ITEM.$typeName, ], data, encoding) ) }

 }
