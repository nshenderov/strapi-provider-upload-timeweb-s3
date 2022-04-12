

### Example

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: '@_sh/strapi-provider-upload-timeweb-s3',
        providerOptions: {
            key: env('TWS3_ACCESS_KEY'),
            secret: env('TWS3_SECRET_KEY'),
            endpoint: env('TWS3_ENDPOINT'),
            region: env('TWS3_REGION'),
            bucket: env('TWS3_BUCKET'),
            directory: env('TWS3_DIRECTORY'),
            domain: env('TWS3_DOMAIN')
        }
      },
    }
});
```
`./config/middlewares.js`

```js
{
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'strapi.io', 'dl.airtable.com', 's3.timeweb.com'],
          'media-src': ["'self'", 'data:', 'blob:','strapi.io', 'dl.airtable.com', 's3.timeweb.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  }
```

`.env` : <br>
TWS3_ACCESS_KEY=<br>
TWS3_SECRET_KEY=<br>
TWS3_REGION=<br>
TWS3_BUCKET=<br>
TWS3_DOMAIN=<br>
*opt TWS3_ENDPOINT=<br>
*opt TWS3_DIRECTORY=