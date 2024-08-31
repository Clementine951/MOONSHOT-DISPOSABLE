#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";

  self.initialProps = @{};
  
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links Handling for App Clip
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  // Check if the activity contains a URL
  if (userActivity.webpageURL) {
    // Log the URL
    NSLog(@"App Clip Invocation URL Received: %@", userActivity.webpageURL.absoluteString);

    // Store the URL in UserDefaults
    [[NSUserDefaults standardUserDefaults] setObject:userActivity.webpageURL.absoluteString forKey:@"appClipInvocationURL"];
    [[NSUserDefaults standardUserDefaults] synchronize]; // Ensure the URL is saved immediately

    // Debug: Immediately retrieve and log the stored URL
    NSString *storedURL = [[NSUserDefaults standardUserDefaults] stringForKey:@"appClipInvocationURL"];
    NSLog(@"Stored App Clip Invocation URL: %@", storedURL);
  }
  
  // Continue React Native handling
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}

@end
