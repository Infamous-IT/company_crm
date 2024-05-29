import AWS from 'aws-sdk';

const rdsDataService = new AWS.RDSDataService({
  region: process.env.AWS_REGION,
  credentials: new AWS.ECSCredentials({}),
});

const executeStatement = async () => {
  const params = {
    resourceArn: process.env.AWS_RESOURCE_ARN,
    secretArn: process.env.AWS_SECRET_ARN,
    database: process.env.DB_NAME,
    sql: 'SELECT * FROM my-company-crm',
  };

  try {
    const response = await rdsDataService.executeStatement(params).promise();
    console.log(response);
  } catch (err) {
    console.log('Error executing statement: ' + err);
  }
};

executeStatement();