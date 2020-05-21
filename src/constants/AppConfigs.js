export default APP_CONFIG = {
  CBT: {
    id: "2",
    swasthApp: "CC",
    appName: "CBT Companion",
    graphql: {
      dev:
        "https://4erhkjoajvfynofmdtkb7w7ip4.appsync-api.us-east-1.amazonaws.com/graphql",
      prod:
        "https://ysw33fjy7bfozevmx3xwzdtb3q.appsync-api.us-east-1.amazonaws.com/graphql"
    },
    iap: {
      ios: [
        "cbtcompanion.monthly",
        "cbtcompanion.six.monthly",
        "cbtcompanion.annual"
      ],
      android: [
        "cbtcompanion.monthly",
        "cbtcompanion.six.monthly",
        "cbtcompanion.annual"
      ]
    },
    iapSharedSecret: "5dba942aed9841a48f901ba0ed4ecbc9",
    privacyPolicy: "https://www.swasth.co/privacy",
    tnc: "https://www.swasth.co/terms",
    support:
      "mailto:apps-help@swasth.co?subject=Question regarding CBT Companion App",
    review: "mailto:apps-help@swasth.co?subject=CBT Companion App Review",
    appStoreLink: "itms-apps://itunes.apple.com/app/cbt-companion/id1445499245",
    playStoreLink: "market://details?id=co.swasth.cbtcompanion",
    therapy: "CBT",
    usersGroupName: "cbt-companion-users",
    s3BucketPrefix: "cbt-companion/",
    aboutContent:"<h3>What is CBT?</h3> <p>Cognitive behavioral therapy (CBT) is a form of psychological treatment that has been demonstrated to be effective for a range of problems including depression, anxiety disorders, alcohol and drug use problems, marital problems, eating disorders and severe mental illness. Numerous research studies suggest that CBT leads to significant improvement in functioning and quality of life. In many studies, CBT has been demonstrated to be as effective as, or more effective than, other forms of psychological therapy or psychiatric medications. </p> <p>It is important to emphasize that advances in CBT have been made on the basis of both research and clinical practice. Indeed, CBT is an approach for which there is ample scientific evidence that the methods that have been developed actually produce change. In this manner, CBT differs from many other forms of psychological treatment.</p>",
    youtubeAPIKey: "AIzaSyAhsyzyamCHUkWFBo0C497B5NOlnpSWy20",
    faqContent: "<h3>What is CBT Companion?</h3><p>CBT Companion is an evidence-based mobile application created in collaboration with clinical experts in CBT that allows you to access on-demand help for a wide variety of conditions: Phobias, Addictions, Anxiety, Depression, Eating disorders, Personality disorders, Sleep disorders, Bipolar disorder, Problems with stress, Panic attacks, Anger issues. Swasth uses clinically validated techniques in cognitive behavioral therapy (CBT) that are designed to work together to help you learn how to feel happier. Our mission is to help people build the life skills they need - anytime, anywhere, and in any way they choose.</p><h3>I just purchased a subscription, but my account did not activate!</h3><p>If you purchased a premium subscription to CBT Companion and do not have access, click on 'Restore Purchase' from the left navigation bar. If that doesn't work, just log out and log back in again to your account. That should refresh your account and allow you to move forward with your CBT Journey. If you are still having trouble after trying the steps above, reach out to us at <strong>apps-help@swasth.co</strong></p><h3>How do I cancel my subscription?</h3><p>If you use a<strong> Apple Device (iOS)</strong>:</p><ol><li>Open the Settings app</li><li>Scroll down to 'iTunes and App Store'</li><li>Tap Your AppleID Email&nbsp;</li><li>Select 'View AppleID' (You may be asked to log in)</li><li>Tap 'Subscriptions'</li><li>Select the CBT Companion subscription</li><li>Tap 'Cancel Subscription' to disable it from auto-renewing at the end of the current billing cycle</li></ol><p>If you use a <strong> Android Device</strong>:</p><ol><li>Open the Google Play Store</li><li>Tap Menu (3 small horizontal lines) next to 'Google Play'</li><li>Tap Subscriptions</li><li>Find the subscription you want to cancel</li><li>Tap Cancel&nbsp; &nbsp;</li></ol><p>&nbsp;</p>",
  }
};