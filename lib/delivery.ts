
export const DELIVERY_RULES = [
  {
    pincodes: ["110001", "110002", "110003"],
    charge: 40,
  },
  {
    pincodes: ["122001", "122002", "122003"],
    charge: 60,
  },
  {
    pincodes: ["124001", "124002"],
    charge: 0,
  },
];

export function getDeliveryCharge(pincode: string): number | null {
  const normalizedPincode = pincode.trim();

  if (!/^\d{6}$/.test(normalizedPincode)) {
    return null;
  }

  const rule = DELIVERY_RULES.find((group) =>
    group.pincodes.includes(normalizedPincode)
  );

  return rule ? rule.charge : null;
}