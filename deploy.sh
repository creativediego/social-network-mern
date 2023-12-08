PEM=$1
SERVER=$2
BASE_DIR=$3

echo "Compressing local files..."
tar czf ../app_file.tar.gz --exclude='node_modules' -C ./ .

echo "Uploading app tar file to server..."
scp -i $PEM ../app_file.tar.gz $SERVER:$BASE_DIR

echo "Connecting to server..."
ssh -t -i $PEM $SERVER << EOF

echo "Removing old app folder and creating new one..."
rm -rf $BASE_DIR/app
mkdir app

echo "Uncompressing app tar file into the app folder..."
tar xzf $BASE_DIR/app_file.tar.gz -C $BASE_DIR/app

echo "Removing app tar file..."
rm -rf $BASE_DIR/app_file.tar.gz

echo "Stopping and removing old docker containers..."
docker-compose down
EOF
# echo "Building docker containers..."
# cd $BASE_DIR/app
# make build-client-production DOCKER_USERNAME=creative
# make build-server-production DOCKER_USERNAME=creative

# echo "Running docker containers..."
# make run-production DOCKER_USERNAME=creative ENV_FILE=.env.production





