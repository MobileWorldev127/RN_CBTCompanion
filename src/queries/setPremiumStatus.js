export const setPremiumStatusQuery = `mutation setPremiumStatus($app: SwasthApp!, $status: Boolean!) {
    setPremiumStatus(app: $app, status: $status) {
      msg
    }
  }`;
