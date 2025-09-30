import { TeamSizeRange } from "@prisma/client";

export function getTeamSizeLabel(totalEmployees: number): TeamSizeRange {
  if (totalEmployees <= 1) return "ZERO_TO_ONE";
  if (totalEmployees <= 10) return "TWO_TO_TEN";
  if (totalEmployees <= 50) return "ELEVEN_TO_FIFTY";
  if (totalEmployees <= 200) return "FIFTY_ONE_TO_TWO_HUNDRED";
  if (totalEmployees <= 500) return "TWO_HUNDRED_ONE_TO_FIVE_HUNDRED";
  if (totalEmployees <= 1000) return "FIVE_HUNDRED_ONE_TO_ONE_THOUSAND";
  return "OVER_ONE_THOUSAND";
}
