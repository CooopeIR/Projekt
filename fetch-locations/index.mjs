import pg from 'pg';
const { Client } = pg;

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

export const handler = async (event) => {
  let client;

  try {
    console.log('Incoming event:', JSON.stringify(event));

    const queryParams = event.queryStringParameters || {};
    const filterTerm = (queryParams.term || '').toLowerCase();

    console.log('Search term:', filterTerm);

    client = new Client(dbConfig);
    await client.connect();

    let query = 'SELECT "id", "cityname", "country" FROM "cities"';
    const params = [];

    if (filterTerm) {
      query += ' WHERE LOWER("cityname") LIKE $1 OR LOWER("country") LIKE $1';
      params.push(`%${filterTerm}%`);
    }

    // Add ORDER BY to sort by country first, then by city name, both in ascending order
    query += ' ORDER BY "cityname" ASC, "country" ASC';

    console.log('Executing query:', query, 'with params:', params);
    const result = await client.query(query, params);

    console.log('Number of results:', result.rows.length);

    // Return the array of cities directly
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify(result.rows) 
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Database error occurred',
        error: error.message 
      })
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};