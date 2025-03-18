import { Module } from '@nestjs/common';
import { NodesModule } from './nodes/nodes.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NodesModule,
    PropertiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
