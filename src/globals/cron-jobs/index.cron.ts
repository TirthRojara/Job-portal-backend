import cron from 'node-cron';
import { authService } from '~/features/auth/auth.service';
import { companyService } from '~/features/company/company.service';
import { jobService } from '~/features/job/job.service';

export async function cronHandler() {
    // cron.schedule('*/2 * * * * *', ()=> {
    //     console.log('cronHandle')
    // })

    cron.schedule('0 */12 * * *', async () => {
        try {
            await companyService.syncViewInDB();
        } catch (error) {
            console.error('[cron] company syncViewInDB failed', error);
        }
    });

    cron.schedule('0 */12 * * *', async () => {
        try {
            await jobService.syncViewInDB();
        } catch (error) {
            console.error('[cron] job syncViewInDB failed', error);
        }
    });

    cron.schedule('0 10 * * *', async () => {
        try {
            await authService.removeExpireToken()
        } catch (error) {
           console.error('[cron] refresh token cleanup failed', error);
        }
    });
}
