echo ""
echo "#############################################################################################"
echo "Ensure your tweeter-web-starter/tweeter-shared/src/index.ts exports any new types you created"
echo "#############################################################################################"

# First build the shared library for the server node modules
cd ~/jacob/byu/340/tweeter-web-starter/tweeter-shared/ && npm run build

# Install the freshly built shared package into the server, build the server, then copy node_modules into the layer
cd ~/jacob/byu/340/tweeter-web-starter/tweeter-server/ && npm install ../tweeter-shared && npm run build && rm -rf layer/nodejs && mkdir -p layer/nodejs && cp -aL node_modules layer/nodejs && sam build && sam deploy

# Build the web client and start it
cd ~/jacob/byu/340/tweeter-web-starter/tweeter-web/ && npm run build && npm start
