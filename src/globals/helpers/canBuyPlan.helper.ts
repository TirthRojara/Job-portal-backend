import { packageService } from '~/features/package/package.service';
import { BadRequestException, CustomError, CustomErrorException } from '../cores/error.cores';

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
  const proPlanEndDate = getMonthlyEndDateforProPlan(referenceDate);

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
// 4 = free plan id

export async function canBuyPlan(upgradePlan: number, recruiterPackage: RecruiterPackagePayload) {
  const userCurrentPlan = recruiterPackage.packageId;
  const todayDate = new Date();


  // console.log('canBuyPlan - recruiterPackage:', recruiterPackage);
  // console.log('canBuyPlan - userCurrentPlan:', userCurrentPlan);
  // console.log('canBuyPlan - upgradePlan:', upgradePlan);

  const pkg = await packageService.readOneForRecruiter(upgradePlan);

  if (userCurrentPlan === upgradePlan) {
    // throw new BadRequestException('You are already subscribed to this plan');
    throw new CustomErrorException('You are already subscribed to this plan', 409);
  }

  if (userCurrentPlan === 2) {
    // throw new BadRequestException('User with PRO plan cannot buy BASIC or PRO plans again.');
    throw new CustomErrorException('User with PRO plan cannot buy BASIC or PRO plans again.', 409);
  }

  if (userCurrentPlan === 4) {
    let option = {
      // plan_id: pkg.planId,
      plan_id: pkg.label,
      customer_notify: true,
      total_count: 12, // For example, for 12 months
      notes: {
        packageId: upgradePlan,
        userId: recruiterPackage.userId
      }
    };

    return option;
  }

  if (userCurrentPlan === 1 && upgradePlan === 2) {
    const extraDays = convertRemainingDaysBasicToPro(
      recruiterPackage.startDate,
      recruiterPackage.endDate!,
      399,
      699,
      todayDate
    );

    const startDatePlusExtraDays = new Date(todayDate.getTime() + extraDays * 24 * 60 * 60 * 1000);
    const startAtTimestamp = Math.floor(startDatePlusExtraDays.getTime() / 1000);
    const start_at_for_pro_plan = startAtTimestamp;

    let option = {
      // plan_id: 'plan_RbXdzxslWEISVU',
      plan_id: 'plan_SFzGPoz26mfv0h',
      customer_notify: true,
      total_count: 12, // For example, for 12 months
      start_at: start_at_for_pro_plan,
      notes: {
        packageId: upgradePlan,
        userId: recruiterPackage.userId
      }
    };

    return option;
  }

  return new BadRequestException('Invalid plan upgrade request');
}
