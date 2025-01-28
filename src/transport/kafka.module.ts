import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get<string>('KAFKA_SERVER')],
              clientId: 'products-service',
            },
            consumer: {
              groupId: 'products-consumer-group',
              allowAutoTopicCreation: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
