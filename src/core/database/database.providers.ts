import { Sequelize } from 'sequelize-typescript';
import { Order } from 'src/modules/orders/order.entity';
import { Post } from '../../modules/posts/post.entity';
import { Product } from '../../modules/products/product.entity';
import { User } from '../../modules/users/user.entity';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.development;
           break;
        case TEST:
           config = databaseConfig.test;
           break;
        case PRODUCTION:
           config = databaseConfig.production;
           break;
        default:
           config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        //models go here
        sequelize.addModels([User, Post, Product, Order]);
        await sequelize.sync();
        return sequelize;
    },
}];