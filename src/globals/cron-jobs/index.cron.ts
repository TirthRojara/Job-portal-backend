import cron from 'node-cron';
import { companyService } from '~/features/company/company.service';

export async function cronHandler() {
    // cron.schedule('*/2 * * * * *', ()=> {
    //     console.log('cronHandle')
    // })

    cron.schedule('*/5 * * * *', () => {
        companyService.syncViewInDB()
    });
}
