plugins {
    id("com.android.application")
}

android {
    namespace = "com.k222game.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.k222game.app"
        minSdk = 21
        targetSdk = 35
        versionCode = 2
        versionName = "1.0.1"
    }

    signingConfigs {
        getByName("debug") {
            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            enableV4Signing = false
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
        release {
            isMinifyEnabled = false
        }
    }
}
