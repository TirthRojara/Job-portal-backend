// import client from "./globals/cores/redis/redis.client";
import Server from "./server";

class JobAppplication {
  public run(): void {
    const server = new Server();

    server.start();
  }
}

// client;

const jobApplication: JobAppplication = new JobAppplication();
jobApplication.run();


