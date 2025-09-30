import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { AirportsModule } from './airports/airports.module';
import { AirlinesModule } from './airlines/airlines.module';
import { AirplaneModelsModule } from './airplane_models/airplane_models.module';
import { SeatClassesModule } from './seat_classes/seat_classes.module';
import { PlanesModule } from './planes/planes.module';
import { SeatsModule } from './seats/seats.module';
import { BaggagePoliciesModule } from './baggage_policies/baggage_policies.module';
import { FareClassesModule } from './fare_classes/fare_classes.module';
import { FlightsModule } from './flights/flights.module';
import { FlightInstancesModule } from './flight_instances/flight_instances.module';
import { UsersModule } from './users/users.module';
import { AdminUsersModule } from './admin_users/admin_users.module';
import { EmailVerificationTokensModule } from './email_verification_tokens/email_verification_tokens.module';
import { PasswordResetTokensModule } from './password_reset_tokens/password_reset_tokens.module';
import { AuthLoginsModule } from './auth_logins/auth_logins.module';
import { ReferralsModule } from './referrals/referrals.module';
import { LoyaltyTiersModule } from './loyalty_tiers/loyalty_tiers.module';
import { LoyaltyAccountsModule } from './loyalty_accounts/loyalty_accounts.module';
import { LoyaltyPointsLedgerModule } from './loyalty_points_ledger/loyalty_points_ledger.module';
import { BookingsModule } from './bookings/bookings.module';
import { PassengersModule } from './passengers/passengers.module';
import { BookingPassengersModule } from './booking_passengers/booking_passengers.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsCouponsModule } from './tickets_coupons/tickets_coupons.module';
import { SeatAssignmentsModule } from './seat_assignments/seat_assignments.module';
import { BaggageItemsModule } from './baggage_items/baggage_items.module';
import { BookingHistoryModule } from './booking_history/booking_history.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NewsModule } from './news/news.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupportTicketsModule } from './support_tickets/support_tickets.module';
import { SupportMessagesModule } from './support_messages/support_messages.module';
import { AdminActivityLogsModule } from './admin_activity_logs/admin_activity_logs.module';
import { UserSearchHistoryModule } from './user_search_history/user_search_history.module';
import { CrewMembersModule } from './crew_members/crew_members.module';
import { FlightCrewsModule } from './flight_crews/flight_crews.module';
import { TranslationsModule } from './translations/translations.module';
import { MealOptionsModule } from './meal_options/meal_options.module';
import { BookingMealsModule } from './booking_meals/booking_meals.module';
import { PromotionsModule } from './promotions/promotions.module';
import { PromotionsRedemptionsModule } from './promotions_redemptions/promotions_redemptions.module';
import { CorporateContractsModule } from './corporate_contracts/corporate_contracts.module';
import { BookingContractsModule } from './booking_contracts/booking_contracts.module';
import { PartnersModule } from './partners/partners.module';
import { PartnerPointTransactionsModule } from './partner_point_transactions/partner_point_transactions.module';
import { InsuranceProvidersModule } from './insurance_providers/insurance_providers.module';
import { InsuranceProductsModule } from './insurance_products/insurance_products.module';
import { BookingInsuranceModule } from './booking_insurance/booking_insurance.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuditInterceptor } from './common/interceptors/admin-audit.interceptor';
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';
import { OptionalJwtGuard } from './auth/guards/optional-jwt.guard';
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule,
        ThrottlerModule.forRoot(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                type: 'postgres',
                host: cfg.get<string>('DB_HOST', 'localhost'),
                port: parseInt(cfg.get<string>('DB_PORT', '5432'), 10),
                username: cfg.get<string>('DB_USER', 'postgres'),
                password: cfg.get<string>('DB_PASS', 'postgres'),
                database: cfg.get<string>('DB_NAME', 'airways'),
                autoLoadEntities: true,
                synchronize: false,
                logging: cfg.get<string>('DB_LOGGING', 'false') === 'true',
            }),
        }),
        CountriesModule,
        CitiesModule,
        AirportsModule,
        AirlinesModule,
        AirplaneModelsModule,
        SeatClassesModule,
        PlanesModule,
        SeatsModule,
        BaggagePoliciesModule,
        FareClassesModule,
        FlightsModule,
        FlightInstancesModule,
        UsersModule,
        AdminUsersModule,
        EmailVerificationTokensModule,
        PasswordResetTokensModule,
        AuthLoginsModule,
        ReferralsModule,
        LoyaltyTiersModule,
        LoyaltyAccountsModule,
        LoyaltyPointsLedgerModule,
        BookingsModule,
        PassengersModule,
        BookingPassengersModule,
        TicketsModule,
        TicketsCouponsModule,
        SeatAssignmentsModule,
        BaggageItemsModule,
        BookingHistoryModule,
        ReviewsModule,
        NewsModule,
        NotificationsModule,
        SupportTicketsModule,
        SupportMessagesModule,
        AdminActivityLogsModule,
        UserSearchHistoryModule,
        CrewMembersModule,
        FlightCrewsModule,
        TranslationsModule,
        MealOptionsModule,
        BookingMealsModule,
        PromotionsModule,
        PromotionsRedemptionsModule,
        CorporateContractsModule,
        BookingContractsModule,
        PartnersModule,
        PartnerPointTransactionsModule,
        InsuranceProvidersModule,
        InsuranceProductsModule,
        BookingInsuranceModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: OptionalJwtGuard },
        { provide: APP_INTERCEPTOR, useClass: AdminAuditInterceptor },
        { provide: APP_INTERCEPTOR, useClass: PaginationInterceptor },
        { provide: APP_FILTER, useClass: TypeOrmExceptionFilter },
    ],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly configService: ConfigService, private readonly dataSource: DataSource) { }
    async onModuleInit() {
        const email = this.configService.get<string>('SUPERADMIN_EMAIL');
        const password = this.configService.get<string>('SUPERADMIN_PASSWORD');
        const fullName = this.configService.get<string>('SUPERADMIN_FULLNAME');
        if (!email || !password || !fullName)
            return;
        const userRepo = this.dataSource.getRepository('User');
        const exists = await userRepo.findOne({ where: { email: email.toLowerCase() } });
        if (!exists) {
            await userRepo.save({
                email: email.toLowerCase(),
                password_hash: 'hashed_' + password,
                full_name: fullName,
                status: 'ACTIVE',
            });
        }
    }
}
