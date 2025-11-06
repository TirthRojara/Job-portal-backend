import { BadRequestException } from '../cores/error.cores';

function getMonthlyEndDateforProPlan(todayDate: Date): Date {
  const endDate = new Date(todayDate);
  const startDay = todayDate.getDate();

  // Add 1 month to the date
  endDate.setMonth(endDate.getMonth() + 1);

  // If the day changed, adjust by setting to last day of the previous month
  if (endDate.getDate() !== startDay) {
    endDate.setDate(0); // setting date to 0 sets the date to last day of previous month
  }

  return endDate;
}

function convertRemainingDaysBasicToPro(
  startDate: Date,
  endDate: Date,
  basicPlanPrice: number,
  proPlanPrice: number,
  referenceDate: Date
) {

  // Calculate total days in the plan period
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate remaining days from referenceDate (usually today)
  const remainingTime = endDate.getTime() - referenceDate.getTime();
  const remainingDays = Math.max(Math.ceil(remainingTime / (1000 * 60 * 60 * 24)), 0);

  // Calculate daily price for BASIC plan
  const basicPricePerDay = basicPlanPrice / totalDays;

  // Monetary value of remaining days
  const remainingValue = remainingDays * basicPricePerDay;

  // Get pro plan end date from reference date
  const proPlanEndDate = getMonthlyEndDateforProPlan(referenceDate)

  // Calculate total days in pro plan
  const totalDaysOfPro = Math.ceil((proPlanEndDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate daily price for PRO plan
  const proPricePerDay = proPlanPrice / totalDaysOfPro;

  // Calculate equivalent PRO plan days (rounded up)
  const proDaysToAdd = Math.ceil(remainingValue / proPricePerDay);

  return proDaysToAdd;
}

// 1 = basic plan id
// 2 = pro plan id

export function canBuyPlan(upgradePlan: number, recruiterPackage: RecruiterPackagePayload) {
  const userCurrentPlan = recruiterPackage.packageId;
  const todayDate = new Date();

  if (userCurrentPlan === upgradePlan) {
    return new BadRequestException('You are already subscribed to this plan');
  }

  if (userCurrentPlan === 2) {
    return new BadRequestException('User with PRO plan cannot buy BASIC or PRO plans again.');
  }

  if (userCurrentPlan === 1 && upgradePlan === 2) {
  }
}
