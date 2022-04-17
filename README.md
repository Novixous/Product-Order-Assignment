# Product-Order-Assignment

## Getting started with docker installed

```bash
# 1. Clone the repository

# 2. Enter your newly-cloned folder.

# 3. Edit Environment variables file if you like. I will leave default as in docker-compose.yml

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sa123456
DB_DIALECT=postgres
DB_NAME_TEST=product_order_test # this won't be used
DB_NAME_DEVELOPMENT=product_order_dev
DB_NAME_PRODUCTION=product_order_prod # this won't be used
JWTKEY=A46D4FEECBC883522683C5A1A222B # this is some random secret key
TOKEN_EXPIRATION=48h 
BEARER=Bearer
SEED=false # set to true if you want to have some dummy data


# 3. Run command 'docker-compose up'

# 4. Access http://localhost:3000/api/ for swagger
```