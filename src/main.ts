import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const queue_input = configService.get<string>('SECURITY_QUEUE_INPUT');
  const host = configService.get<string>('SECURITY_HOST');
  const port = parseInt(configService.get<string>('SECURITY_PORT'));

  // docker run -d --hostname zone-rabbit -p 5673:5672 -p 15673:15672 --name zone-rabbit rabbitmq:3-management
  // Rabit UI:  http://localhost:15673
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      //urls: [`amqp://${user}:${password}@${host}:${port}`],
      urls: [`amqp://${host}:${port}`],
      queue: `${queue_input}`,
      queueOptions: {
        durable: true, //persistent
      },
    },
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      microserviceOptions,
  );

  await app.listen();

}
bootstrap();
