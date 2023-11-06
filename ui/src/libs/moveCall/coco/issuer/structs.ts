import { String } from "../../_dependencies/onchain/0x1/string/structs";
import { UID } from "../../_dependencies/onchain/0x2/object/structs";
import { VecSet } from "../../_dependencies/onchain/0x2/vec-set/structs";
import { bcsOnchain as bcs } from "../../_framework/bcs";
import { FieldsWithTypes, Type } from "../../_framework/util";
import { Encoding } from "@mysten/bcs";
import { SuiClient, SuiParsedData } from "@mysten/sui.js/client";

/* ============================== EventConfig =============================== */

bcs.registerStructType(
  "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::issuer::EventConfig",
  {
    id: `0x2::object::UID`,
    description: `0x1::string::String`,
    expired_at: `u64`,
    visitors: `0x2::vec_set::VecSet<address>`,
  }
);

export function isEventConfig(type: Type): boolean {
  return (
    type ===
    "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::issuer::EventConfig"
  );
}

export interface EventConfigFields {
  id: string;
  description: string;
  expiredAt: bigint;
  visitors: VecSet<string>;
}

export class EventConfig {
  static readonly $typeName =
    "0x683cd21f4b6814cc59a2a494fc21e5b043c5390181b7b17cc55052530ef06379::issuer::EventConfig";
  static readonly $numTypeParams = 0;

  readonly id: string;
  readonly description: string;
  readonly expiredAt: bigint;
  readonly visitors: VecSet<string>;

  constructor(fields: EventConfigFields) {
    this.id = fields.id;
    this.description = fields.description;
    this.expiredAt = fields.expiredAt;
    this.visitors = fields.visitors;
  }

  static fromFields(fields: Record<string, any>): EventConfig {
    return new EventConfig({
      id: UID.fromFields(fields.id).id,
      description: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.description).bytes))
        .toString(),
      expiredAt: BigInt(fields.expired_at),
      visitors: VecSet.fromFields<string>(`address`, fields.visitors),
    });
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EventConfig {
    if (!isEventConfig(item.type)) {
      throw new Error("not a EventConfig type");
    }
    return new EventConfig({
      id: item.fields.id.id,
      description: item.fields.description,
      expiredAt: BigInt(item.fields.expired_at),
      visitors: VecSet.fromFieldsWithTypes<string>(item.fields.visitors),
    });
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): EventConfig {
    return EventConfig.fromFields(
      bcs.de([EventConfig.$typeName], data, encoding)
    );
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== "moveObject") {
      throw new Error("not an object");
    }
    if (!isEventConfig(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a EventConfig object`
      );
    }
    return EventConfig.fromFieldsWithTypes(content);
  }

  static async fetch(client: SuiClient, id: string): Promise<EventConfig> {
    const res = await client.getObject({ id, options: { showContent: true } });
    if (res.error) {
      throw new Error(
        `error fetching EventConfig object at id ${id}: ${res.error.code}`
      );
    }
    if (
      res.data?.content?.dataType !== "moveObject" ||
      !isEventConfig(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a EventConfig object`);
    }
    return EventConfig.fromFieldsWithTypes(res.data.content);
  }
}
