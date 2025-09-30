import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Smoke E2E', () => {
  let app: INestApplication;
  let adminAccessToken = '';

  beforeAll(async () => {
    // Ensure SUPERADMIN env vars are present for seeding/login
    process.env.SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
    process.env.SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'ChangeMe123!';
    process.env.SUPERADMIN_FULLNAME = process.env.SUPERADMIN_FULLNAME || 'Super Admin';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin login returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
      })
      .expect(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
    adminAccessToken = res.body.access_token;
  });

  it('Public airports list should be accessible without token', async () => {
    await request(app.getHttpServer())
      .get('/api/airports?limit=1&page=1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });

  it('Protected create airport should deny without token and allow with ADMIN', async () => {
    // Deny without token
    await request(app.getHttpServer())
      .post('/api/airports')
      .send({})
      .expect(401);

    // Prepare related country and city with ADMIN token
    const isoSuffix = Date.now().toString().slice(-2);
    const countryRes = await request(app.getHttpServer())
      .post('/api/countries')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ iso2: `U${isoSuffix}`, iso3: `UZ${isoSuffix}`, name: `Testland ${isoSuffix}` })
      .expect(201);
    const countryId = countryRes.body.id;

    const cityRes = await request(app.getHttpServer())
      .post('/api/cities')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ country_id: countryId, name: `Metro ${isoSuffix}` })
      .expect(201);
    const cityId = cityRes.body.id;

    // Allow with ADMIN token
    const airportRes = await request(app.getHttpServer())
      .post('/api/airports')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ city_id: cityId, name: `Airport ${isoSuffix}`, iata_code: `T${isoSuffix}`, icao_code: `T${isoSuffix}1` })
      .expect(201);
    const airportId = airportRes.body.id;

    // Cleanup (delete in reverse dependency order)
    await request(app.getHttpServer())
      .delete(`/api/airports/${airportId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/api/cities/${cityId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/api/countries/${countryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
  });
});

