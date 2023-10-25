import {bcsSource as bcs} from "../../_framework/bcs";
import {FieldsWithTypes, Type} from "../../_framework/util";
import {Encoding} from "@mysten/bcs";

/* ============================== SUI =============================== */

bcs.registerStructType( "0x2::sui::SUI", {
dummy_field: `bool`,
} )

export function isSUI(type: Type): boolean { return type === "0x2::sui::SUI"; }

export interface SUIFields { dummyField: boolean }

export class SUI { static readonly $typeName = "0x2::sui::SUI"; static readonly $numTypeParams = 0;

  readonly dummyField: boolean

 constructor( dummyField: boolean, ) { this.dummyField = dummyField; }

 static fromFields( fields: Record<string, any> ): SUI { return new SUI( fields.dummy_field ) }

 static fromFieldsWithTypes(item: FieldsWithTypes): SUI { if (!isSUI(item.type)) { throw new Error("not a SUI type");

 } return new SUI( item.fields.dummy_field ) }

 static fromBcs( data: Uint8Array | string, encoding?: Encoding ): SUI { return SUI.fromFields( bcs.de([SUI.$typeName, ], data, encoding) ) }

 }
