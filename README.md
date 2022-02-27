# SERVERLESS PUPPETEER WITH METAMASK
This serverless lambda will connect to a Browserless instance with Metamask Extension installed, with this you can use Puppeteer with Metamask support to automate Web3 tasks such as sending transactions, scraping data from Dapps, sign transactions etc..

Beware of the use of Metamask with your seed phrases, private keys, you should consider your own secure setup.

### **Install the dependencies**

```
yarn install
```

### **Start the offline mode**
```
yarn serverless
```

### Modify the `profile` in Serverless.yml to use your AWS profile, then you can deploy to AWS
```
#yarn sls deploy

```


### **CI/CD DEPLOYMENT**
Alternatively I use SEED.run for all my Lambda deployments, there you can configure your CI/CD pipeline and use the Secret Manager for your seed phrases.
```
Commit to the master branch and SEED will handle the CI/CD Deploy
.Env Variables are stored in SEED for production in the AWS Secret Manager
```

### **DEPENDENCIES**
* Serverless
* Webpack 4
* Typescript
* Browserless Docker Version
* Some functions have been foked from the [Chain Link Dappteer Repo](https://github.com/ChainSafe/dappeteer)

### **BROWSERLESS LOCAL SETUP**

```
docker run \
  -e "TOKEN=2cbc5771-38f2-4dcf-8774-50ad5123-Puppeteer-metamask" \
  -e "CONNECTION_TIMEOUT=520000" \
  -e "MAX_CONCURRENT_SESSIONS=50" \
  -e "METRICS_JSON_PATH=/home/browserless/metrics.json" \      
  -e "WORKSPACE_DIR=/home/browserless" \
  -v ./home/browserless:/home/browserless  -p 3000:3000  --restart always  \
  -d \
  --name browserless browserless/chrome
```

___
For more information about the complete setup check the following [Medium Post](https://medium.com)