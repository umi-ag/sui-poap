import {String} from "../../_dependencies/onchain/0x1/string/structs";
import {UID} from "../../_dependencies/onchain/0x2/object/structs";
import {VecSet} from "../../_dependencies/onchain/0x2/vec-set/structs";
import {bcsOnchain as bcs} from "../../_framework/bcs";
import {FieldsWithTypes, Type} from "../../_framework/util";
import {Encoding} from "@mysten/bcs";
import {SuiClient, SuiParsedData} from "@mysten/sui.js/client";

/* ============================== VisitorList =============================== */

bcs.registerStructType( "0xe46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5::issuer::VisitorList", {
id: `0x2::object::UID`,
date: `0x1::string::String`,
expired_at: `u64`,
visitors: `0x2::vec_set::VecSet<address>`,
} )

export function isVisitorList(type: Type): boolean { return type === "0xe46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5::issuer::VisitorList"; }

export interface VisitorListFields { id: string; date: string; expiredAt: bigint; visitors: VecSet<string> }

export class VisitorList { static readonly $typeName = "0xe46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5::issuer::VisitorList"; static readonly $numTypeParams = 0;

  readonly id: string; readonly date: string; readonly expiredAt: bigint; readonly visitors: VecSet<string>

 constructor( fields: VisitorListFields, ) { this.id = fields.id; this.date = fields.date; this.expiredAt = fields.expiredAt; this.visitors = fields.visitors; }

 static fromFields( fields: Record<string, any> ): VisitorList { return new VisitorList( { id: UID.fromFields(fields.id).id, date: (new TextDecoder()).decode(Uint8Array.from(String.fromFields(fields.date).bytes)).toString(), expiredAt: BigInt(fields.expired_at), visitors: VecSet.fromFields<string>(`address`, fields.visitors) } ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): VisitorList { if (!isVisitorList(item.type)) { throw new Error("not a VisitorList type");

 } return new VisitorList( { id: item.fields.id.id, date: item.fields.date, expiredAt: BigInt(item.fields.expired_at), visitors: VecSet.fromFieldsWithTypes<string>(item.fields.visitors) } ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): VisitorList { return VisitorList.fromFields( bcs.de([VisitorList.$typeName, ], data, encoding) ) }

 static fromSuiParsedData(content: SuiParsedData) { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isVisitorList(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a VisitorList object`); } return VisitorList.fromFieldsWithTypes(content); }

 static async fetch(client: SuiClient, id: string ): Promise<VisitorList> { const res = await client.getObject({ id, options: { showContent: true, }, }); if (res.error) { throw new Error(`error fetching VisitorList object at id ${id}: ${res.error.code}`); } if (res.data?.content?.dataType !== "moveObject" || !isVisitorList(res.data.content.type)) { throw new Error(`object at id ${id} is not a VisitorList object`); }
 return VisitorList.fromFieldsWithTypes(res.data.content); }

 }
