PEM=$1
SERVER=$2
BASE_DIR=$3

echo "Compressing local files..."
tar czf ../app_file.tar.gz --exclude='node_modules' -C ./ .

echo "Uploading app tar file to server..."
scp -i $PEM ../app_file.tar.gz $SERVER:$BASE_DIR

echo "Connecting to server..."
ssh -t -i $PEM $SERVER << EOF

echo "Uncompressing app tar file into the app folder..."
tar xzf app_file.tar.gz -C ~/app

echo "Removing app tar file..."
rm -rf app_file.tar.gz

echo "Building docker containers..."
cd ~/app
make build-production DOCKER_USERNAME="creative"

echo "Running docker containers..."
make run-production DOCKER_USERNAME="creative" ENV_FILE=.env.production
EOF





