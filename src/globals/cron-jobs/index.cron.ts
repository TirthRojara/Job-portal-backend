import cron from 'node-cron';
import { companyService } from '~/features/company/company.service';
import { jobService } from '~/features/job/job.service';

export async function cronHandler() {
    // cron.schedule('*/2 * * * * *', ()=> {
    //     console.log('cronHandle')
    // })

    cron.schedule('*/5 * * * *', async () => {
        try {
            await companyService.syncViewInDB();
        } catch (error) {
            console.error('[cron] company syncViewInDB failed', error);
        }
    });

    cron.schedule('*/1 * * * *', async () => {
        try {
            await jobService.syncViewInDB();
        } catch (error) {
            console.error('[cron] job syncViewInDB failed', error);
        }
    });
}
