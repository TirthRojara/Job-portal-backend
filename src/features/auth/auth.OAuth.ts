// import { Google } from "arctic";


// export const google = new Google(
//     process.env.GOOGLE_CLIENT_ID!,
//     process.env.GOOGLE_CLIENT_SECRET!,
//     'http://localhost:3000/google/callback'   //this is same as in console.google.cloud
// )


let google: any;

async function loadGoogle() {
  const { Google } = await import("arctic");

  google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    // 'http://localhost:5000/api/v1/auth/google/callback'
    'https://job-portal-api.tirthrojara.in/api/v1/auth/google/callback'
  );
}

(async () => {
  await loadGoogle();
})();

export { google };

