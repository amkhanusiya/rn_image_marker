mkdir -p builds

default_file_name=${PWD##*/}
time=$(date "+%Y_%m_%d-%H.%M.%S")

# Cleanup build
echo 'Started clean'
flutter clean
rm -rf builds/"$default_file_name"-*.apk
rm -rf builds/"$default_file_name"-*.ipa
rm -rf ios/Pods Podfile.lock
echo 'Clean complete'

# Android build script
echo 'Start build apk'
cd android/
./gradlew clean assembleRelease
new_fileName=$default_file_name-$time".apk"
# shellcheck disable=SC2103
cd ..
mv android/app/build/outputs/apk/release/app-release.apk builds/$new_fileName
echo 'apk generated to builds/'$new_fileName
