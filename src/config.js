export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'games-app-uploads'
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://xbv651rdx4.execute-api.us-east-1.amazonaws.com/prod'
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_ooYS89fIm',
    APP_CLIENT_ID: '3b2pk22u9vtoh436crgirj1nkp',
    IDENTITY_POOL_ID: 'us-east-1:ae78aa7e-a66a-40a7-aaf9-9e91aa77ed6a'
  }
};
