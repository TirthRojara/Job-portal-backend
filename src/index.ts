import Server from "./server";

class JobAppplication {
  public run(): void {
    const server = new Server();

    server.start();
  }
}

const jobApplication: JobAppplication = new JobAppplication();
jobApplication.run();


