import { Prisma } from '@prisma/client';
import prisma from '~/prisma';
import { NotFountException } from '../cores/error.cores';

export async function getPaginationAndFilter({
    page,
    limit,
    filter,
    filterFields,
    entity,
    additionCondition,
    orderCondition = {},
    include = {},
    select = {},
    omit = {}
}: any) {
    let skip: number = (page - 1) * limit;

    // console.log('filter in helper: ', filter);

    const condition = filterFields.map((field: string) => {
        return { [field]: { contains: filter, mode: 'insensitive' } };
    });
    // [
    //   { name: { contains: filter, mode: 'insensitive' } },
    //   { description: { contains: filter, mode: 'insensitive' } }
    // ]
    // console.log('condition:', condition);

    const where = filter
        ? {
              ...additionCondition,
              OR: condition
          }
        : {};

    // console.log('where in helper: ', where, ' additionCondition: ', additionCondition);

    const queryOptions: any = {
        where: { ...additionCondition, ...where },
        orderBy: { ...orderCondition },
        skip,
        take: limit
    };

    // if (Object.keys(select).length > 0) {
    //   queryOptions.select = select;
    // } else if (Object.keys(include).length > 0) {
    //   queryOptions.include = include;
    // }

    if (Object.keys(select).length > 0) {
        queryOptions.select = select;
    } else {
        if (Object.keys(include).length > 0) {
            queryOptions.include = include;
        }
        if (Object.keys(omit).length > 0) {
            queryOptions.omit = omit;
        }
    }

    // console.log(queryOptions);

    const [data, totalCount] = await Promise.all([
        (prisma[entity] as any).findMany({
            // where: { ...additionCondition, ...where },
            // orderBy: { ...orderCondition },
            // select,
            // include,
            // skip,
            // take: limit

            ...queryOptions
        }),
        (prisma[entity] as any).count({
            where: { ...additionCondition, ...where }
        })
    ]);

    // if (!companies || companies.length === 0)
    if (totalCount === 0) throw new NotFountException(`No ${entity} records found for filter: ${filter}`);

    const maxPage = Math.ceil(totalCount / limit);
    if (page > maxPage) throw new NotFountException(`Page ${page} exceeds the maximum page number of ${maxPage}`);

    return { data, totalCount, totalPages: maxPage };
}
