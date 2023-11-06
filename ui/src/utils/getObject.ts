import { suiClient } from "src/config/sui";

export async function getOwnedCocoObjectId(
  address: string,
  objectType: string
) {
  const data = await suiClient.getOwnedObjects({
    owner: address,
    filter: {
      MatchAll: [
        {
          StructType: `${objectType}`,
        },
        {
          AddressOwner: address,
        },
      ],
    },
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: false,
      showContent: false,
      showBcs: false,
      showStorageRebate: false,
    },
  });
  console.log({ data });
  if (data && data.data && data.data[0] && data.data[0].data) {
    return data.data[0].data.objectId;
  }
  return "";
}
