import { Resend } from 'resend';
import { BadRequestException } from '~/globals/cores/error.cores';
// import { sendMail } from '~/globals/helpers/sendMail.helper';

class TestService {
  public async test() {
    console.log('This is a test service method');

    // try {
    //   const result = await sendMail('work.tirthrojara@gmail.com', 'Test Subject', 'This is a test message');
    //   console.log('Test email sent');

    //   return result;
    // } catch (err) {
    //     console.error('Error sending test email:', err);
    //     // throw new BadRequestException(`Can't send the email \n ${err}`);
    // }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response =await  resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tirth744clg@gmail.com',
      subject: 'Hello World',
      html: '<p><strong>first email</strong>!</p> this is send from backend'
    });

    console.log(response)

    return 'Test email sent via Resend';
  }
}

export const testService: TestService = new TestService();
