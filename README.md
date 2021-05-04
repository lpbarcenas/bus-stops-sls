# Simple Bus Stop React App Backend

## Build and deploy SLS, API Gateway, and DynamoDB resources

Install serverless 

Follow guide [https://www.serverless.com/framework/docs/providers/aws/guide/installation/](Here)

In the project directory, you can run:

### `npm install`

Install required node modules.

### `serverless deploy`

To finally deploy to your SLS in dev stage.


## Notes

To see initial data, consult initial_data.json
Please note that:
 - SLS filter for nearby bus stops (within 2km radius) 
 - has its center point configured to: {
    lat: 8.4788611,
    lng: 124.6511352
  } (consult db/busstop.js)
 - Bus stops pre defined next arrival schedules: 1PM (Cogon) and 7AM (Carmen)

