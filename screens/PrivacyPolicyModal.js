import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import QRCode from 'react-native-qrcode-svg';
import React from 'react';

const styles = StyleSheet.create({
  containerColor: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  safeArea: {
    flex: 1,
  },
  infoDiv: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dadfe3',
    borderRadius: 5,
  },
  headerGroup: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText2: {
    fontWeight: '600',
  },
});

const PrivacyPolicyModal = () => {
  const handleFesspayHelpLink = async () => {
    try {
      Linking.openURL('help@Yug Networkwallet.com');
    } catch (err) {
      console.log('handleYug NetworkHelpLink: err: ', err);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.container, styles.containerColor]}>
          <View style={styles.infoDiv}>
            <View style={styles.headerGroup}>
              <Text style={styles.headerText}>PRIVACY POLICY</Text>
            </View>
            <Text>
              Thank you for choosing to be part of our community , doing business as Yug Network ("Yug Network ", "we", "us", "our"). We are committed
              to protecting your personal information and your right to privacy.
              When you use our mobile
              application, as the case may be (the "App") and more generally,
              use any of our services (the "Services", which include the App),
              we appreciate that you are trusting us with your personal
              information. We take your privacy very seriously. In this privacy
              policy, we seek to explain to you in the clearest way possible
              what information we collect, how we use it and what rights you
              have in relation to it. We hope you take some time to read through
              it carefully, as it is important. If there are any terms in this
              privacy policy that you do not agree with, please discontinue use
              of our Services immediately.This privacy policy applies to all
              information collected through our Services (which, as described
              above, includes our App), as well as, any related services, sales,
              marketing or events. Please read this privacy policy carefully as
              it will help you understand what we do with the information that
              we collect.
            </Text>
            <Text />
            <Text>TABLE OF CONTENTS</Text>
            <Text>1. WHAT INFORMATION DO WE COLLECT?</Text>
            <Text>2. HOW DO WE USE YOUR INFORMATION?</Text>
            <Text>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</Text>
            <Text>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</Text>
            <Text>5. DO WE USE GOOGLE MAPS PLATFORM APIS?</Text>
            <Text>6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</Text>
            <Text>7. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>
            <Text>8. HOW DO WE KEEP YOUR INFORMATION SAFE? </Text>
            <Text>9. DO WE COLLECT INFORMATION FROM MINORS?</Text>
            <Text>10. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
            <Text>11. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
            <Text>
              12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </Text>
            <Text>13. DO WE MAKE UPDATES TO THIS NOTICE?</Text>
            <Text>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
            <Text>
              15. HOW CAN YOU REVIEW, UPDATE OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              1. WHAT INFORMATION DO WE COLLECT?
            </Text>

            <Text>Personal information you disclose to us.</Text>
            <Text>
              In Short: We collect personal information that you provide to us.
              We collect personal information that you voluntarily provide to us
              when you register on the App, express an interest in obtaining
              information about us or our products and Services, when you
              participate in activities on the App or otherwise when you contact
              us.The personal information that we collect depends on the context
              of your interactions with us and the App, the choices you make and
              the products and features you use.
            </Text>
            <Text>
              The personal information we collect may include the following:
            </Text>
            <Text>
              Personal Information Provided by You: We collect names; phone
              numbers; email addresses; usernames; passwords; and other similar
              information.
            </Text>
            <Text>
              All personal information that you provide to us must be true,
              complete and accurate, and you must notify us of any changes to
              such personal information.
            </Text>
            <Text>Information automatically collected:</Text>
            <Text>
              In Short: Some information — such as your Internet Protocol (IP)
              address and/or browser and device characteristics — is collected
              automatically when you visit our App. We automatically collect
              certain information when you visit, use or navigate the App. This
              information does not reveal your specific identity (like your name
              or contact information) but may include device and usage
              information, such as your IP address, browser and device
              characteristics, operating system, language preferences, referring
              URLs, device name, country, location, information about how and
              when you use our App and other technical information. This
              information is primarily needed to maintain the security and
              operation of our App, and for our internal analytics and reporting
              purposes.
            </Text>
            <Text>
              Like many businesses, we also collect information through cookies
              and similar technologies. The information we collect includes:
            </Text>
            <Text>
              Log and Usage Data: Log and usage data is service-related,
              diagnostic, usage and performance information our servers
              automatically collect when you access or use our App and which we
              record in log files. Depending on how you interact with us, this
              log data may include your IP address, device information, browser
              type and settings and information about your activity in the App
              (such as the date/time stamps associated with your usage, pages
              and files viewed, searches and other actions you take such as
              which features you use), device event information (such as system
              activity, error reports (sometimes called 'crash dumps') and
              (hardware settings).
            </Text>
            <Text>
              Device Data: We collect device data such as information about your
              computer, phone, tablet or other device you use to access the App.
              Depending on the device used, this device data may include
              information such as your IP address (or proxy server), device and
              application identification numbers, location, browser type,
              hardware model Internet service provider and/or mobile carrier,
              operating system and system configuration information.
            </Text>
            <Text>
              {' '}
              Location Data: We collect location data such as information about
              your device's location, which can be either precise or imprecise.
              How much information we collect depends on the type and settings
              of the device you use to access the App. For example, we may use
              GPS and other technologies to collect geolocation data that tells
              us your current location (based on your IP address). You can opt
              out of allowing us to collect this information either by refusing
              access to the information or by disabling your Location setting on
              your device. Note however, if you choose to opt out, you may not
              be able to use certain aspects of the Services.{' '}
            </Text>
            <Text>Information collected through our App</Text>
            <Text>
              {' '}
              In Short: We collect information regarding your geo-location,
              mobile device, push notifications, when you use our App. If you
              use our App, we also collect the following information:
            </Text>
            <Text>
              Geo-Location Information: We may request access or permission to
              and track location-based information from your mobile device,
              either continuously or while you are using our App, to provide
              certain location-based services. If you wish to change our access
              or permissions, you may do so in your device's settings.
            </Text>
            <Text>
              Mobile Device Data: We automatically collect device information
              (such as your mobile device ID, model and manufacturer), operating
              system, version information and system configuration information,
              device and application identification numbers, browser type and
              version, hardware model Internet service provider and/or mobile
              carrier, and Internet Protocol (IP) address (or proxy server). If
              you are using our App, we may also collect information about the
              phone network associated with your mobile device, your mobile
              device’s operating system or platform, the type of mobile device
              you use, your mobile device’s unique device ID and information
              about the features of our App you accessed.
            </Text>
            <Text>
              Push Notifications: We may request to send you push notifications
              regarding your account or certain features of the App. If you wish
              to opt-out from receiving these types of communications, you may
              turn them off in your device's settings.This information is
              primarily needed to maintain the security and operation of our
              App, for troubleshooting and for our internal analytics and
              reporting purposes.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              2. HOW DO WE USE YOUR INFORMATION?
            </Text>
            <Text>
              In Short: We process your information for purposes based on
              legitimate business interests, the fulfillment of our contract
              with you, compliance with our legal obligations, and/or your
              consent. We use personal information collected via our App for a
              variety of business purposes described below. We process your
              personal information for these purposes in reliance on our
              legitimate business interests, in order to enter into or perform a
              contract with you, with your consent, and/or for compliance with
              our legal obligations. We indicate the specific processing grounds
              we rely on next to each purpose listed below. We use the
              information we collect or receive: To facilitate account creation
              and log on process. If you choose to link your account with us to
              a third-party account (such as your Google or Facebook account),
              we use the information you allowed us to collect from those third
              parties to facilitate account creation and logon process for the
              performance of the contract.
            </Text>
            <Text>
              {' '}
              To post testimonials: We post testimonials on our App that may
              contain personal information. Prior to posting a testimonial, we
              will obtain your consent to use your name and the content of the
              testimonial. 
            </Text>
            <Text>
              Request feedback: We may use your information to request feedback
              and to contact you about your use of our App.To enable
              user-to-user communications. We may use your information in order
              to enable user-to-user communications with each user's consent. To
              manage user accounts: We may use your information for the purposes
              of managing our account and keeping it in working order. To send
              administrative information to you: We may use your personal
              information to send you product, service and new feature
              information and/or information about changes to our terms,
              conditions, and policies.
            </Text>
            <Text>
              To protect our Services: We may use your information as part of
              our efforts to keep our App safe and secure (for example, for
              fraud monitoring and prevention).To enforce our terms, conditions
              and policies for business purposes, to comply with legal and
              regulatory requirements or in connection with our contract.
            </Text>
            <Text>
              To respond to legal requests and prevent harm: If we receive a
              subpoena or other legal request, we may need to inspect the data
              we hold to determine how to respond. To send you marketing and
              promotional communications: We and/or our third-party marketing
              partners may use the personal information you send to us for our
              marketing purposes, if this is in accordance with your marketing
              preferences. For example, when expressing an interest in obtaining
              information about us or our App, subscribing to marketing or
              otherwise contacting us, we will collect personal information from
              you. You can opt-out of our marketing emails at any time (see the
              "WHAT ARE YOUR PRIVACY RIGHTS" below).
            </Text>
            <Text>
              Deliver targeted advertising to you: We may use your information
              to develop and display personalized content and advertising (and
              work with third parties who do so) tailored to your interests
              and/or location and to measure its effectiveness.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
            </Text>
            <Text>
              In Short: We only share information with your consent, to comply
              with laws, to provide you with services, to protect your rights,
              or to fulfill business obligations.
            </Text>
            <Text>
              {' '}
              We may process or share your data that we hold based on the
              following legal basis:
            </Text>
            <Text>
              Consent: We may process your data if you have given us specific
              consent to use your personal information for a specific purpose.
              Legitimate Interests: We may process your data when it is
              reasonably necessary to achieve our legitimate business interests.
            </Text>
            <Text>
              Performance of a Contract: Where we have entered into a contract
              with you, we may process your personal information to fulfill the
              terms of our contract.
            </Text>
            <Text>
              Legal Obligations: We may disclose your information where we are
              legally required to do so in order to comply with applicable law,
              governmental requests, a judicial proceeding, court order, or
              legal process, such as in response to a court order or a subpoena
              (including in response to public authorities to meet national
              security or law enforcement requirements).
            </Text>
            <Text>
              Vital Interests: We may disclose your information where we believe
              it is necessary to investigate, prevent, or take action regarding
              potential violations of our policies, suspected fraud, situations
              involving potential threats to the safety of any person and
              illegal activities, or as evidence in litigation in which we are
              involved. More specifically, we may need to process your data or
              share your personal information in the following situations:
            </Text>
            <Text>
              Business Transfers: We may share or transfer your information in
              connection with, or during negotiations of, any merger, sale of
              company assets, financing, or acquisition of all or a portion of
              our business to another company.
            </Text>
            <Text>
              Affiliates: We may share your information with our affiliates, in
              which case we will require those affiliates to honor this privacy
              policy. Affiliates include our parent company and any
              subsidiaries, joint venture partners or other companies that we
              control or that are under common control with us.
            </Text>
            <Text>
              Offer Wall: Our App may display a third-party hosted "offer wall."
              Such an offer wall allows third-party advertisers to offer virtual
              currency, gifts, or other items to users in return for the
              acceptance and completion of an advertisement offer. Such an offer
              wall may appear in our App and be displayed to you based on
              certain data, such as your geographic area or demographic
              information. When you click on an offer wall, you will be brought
              to an external website belonging to other persons and will leave
              our App. A unique identifier, such as your user ID, will be shared
              with the offer wall provider in order to prevent fraud and
              properly credit your account with the relevant reward. Please note
              that we do not control third-party websites and have no
              responsibility in relation to the content of such websites. The
              inclusion of a link towards a third-party website does not imply
              an endorsement by us of such website. Accordingly, we do not make
              any warranty regarding such third-party websites and we will not
              be liable for any loss or damage caused by the use of such
              websites. In addition, when you access any third-party website,
              please understand that your rights while accessing and using those
              websites will be governed by the privacy policy and terms of
              service relating to the use of those websites.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </Text>
            <Text>
              In Short: We may use cookies and other tracking technologies to
              collect and store your information. We may use cookies and similar
              tracking technologies (like web beacons and pixels) to access or
              store information. Specific information about how we use such
              technologies and how you can refuse certain cookies is set out in
              our Cookie policy.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              5. DO WE USE GOOGLE MAPS PLATFORM APIs?
            </Text>
            <Text>
              In Short: Yes, we use Google Maps Platform APIs for the purpose of
              providing better service.This App uses Google Maps Platform APIs
              which are subject to Google’s Terms of Service. You may find the
              Google Maps Platform Terms of Service here. To find out more about
              Google’s Privacy Policy, please refer to this link. We obtain and
              store on your device ('cache') your location. You may revoke your
              consent anytime by contacting us at the contact details provided
              at the end of this document.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
            </Text>
            <Text>
              In Short: We may transfer, store, and process your information in
              countries other than your own, our servers are located in. If you
              are accessing our App from outside, please be aware that your
              information may be transferred to, stored, and processed by us in
              our facilities and by those third parties with whom we may share
              your personal information (see "WILL YOUR INFORMATION BE SHARED
              WITH ANYONE?" above), in and other countries. If you are a
              resident in the European Economic Area, then these countries may
              not necessarily have data protection laws or other similar laws as
              comprehensive as those in your country. We will however take all
              necessary measures to protect your personal information in
              accordance with this privacy policy and applicable law.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              {' '}
              7. HOW LONG DO WE KEEP YOUR INFORMATION?
            </Text>
            <Text>
              In Short: We keep your information for as long as necessary to
              fulfill the purposes outlined in this privacy policy unless
              otherwise required by law. We will only keep your personal
              information for as long as it is necessary for the purposes set
              out in this privacy policy, unless a longer retention period is
              required or permitted by law (such as tax, accounting or other
              legal requirements). No purpose in this policy will require us
              keeping your personal information for longer than the period of
              time in which users have an account with us. When we have no
              ongoing legitimate business need to process your personal
              information, we will either delete or anonymize such information,
              or, if this is not possible (for example, because your personal
              information has been stored in backup archives), then we will
              securely store your personal information and isolate it from any
              further processing until deletion is possible.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              8. HOW DO WE KEEP YOUR INFORMATION SAFE?
            </Text>
            <Text>
              In Short: We aim to protect your personal information through a
              system of organizational and technical security measures. We have
              implemented appropriate technical and organizational security
              measures designed to protect the security of any personal
              information we process. However, despite our safeguards and
              efforts to secure your information, no electronic transmission
              over the Internet or information storage technology can be
              guaranteed to be 100% secure, so we cannot promise or guarantee
              that hackers, cybercriminals, or other unauthorized third parties
              will not be able to defeat our security, and improperly collect,
              access, steal, or modify your information. Although we will do our
              best to protect your personal information, transmission of
              personal information to and from our App is at your own risk. You
              should only access the App within a secure environment.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              {' '}
              9. DO WE COLLECT INFORMATION FROM MINORS?
            </Text>
            <Text>
              In Short: We do not knowingly collect data from or market to
              children under 18 years of age. We do not knowingly solicit data
              from or market to children under 18 years of age. By using the
              App, you represent that you are at least 18 or that you are the
              parent or guardian of such a minor and consent to such minor
              dependent’s use of the App. If we learn that personal information
              from users less than 18 years of age has been collected, we will
              deactivate the account and take reasonable measures to promptly
              delete such data from our records.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              10. WHAT ARE YOUR PRIVACY RIGHTS?
            </Text>
            <Text>
              In Short: You may review, change, or terminate your account at any
              time. If you are a resident in the European Economic Area and you
              believe we are unlawfully processing your personal information,
              you also have the right to complain to your local data protection
              supervisory authority. You can find their contact details here:
              http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.
              If you are a resident in Switzerland, the contact details for the
              data protection authorities are available here:
              https://www.edoeb.admin.ch/edoeb/en/home.html. 
            </Text>
            <Text>
              Account Information: If you would like to review or change the
              information at any time in your account or terminate your account,
              you can Log in to your account settings and update your user
              account. Contact us using the contact information provided. Upon
              your request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, we may retain some information in our files to prevent
              fraud, troubleshoot problems, assist with any investigations,
              enforce our Terms of Use and/or comply with applicable legal
              requirements.
            </Text>
            <Text>
              {' '}
              Cookies and similar technologies: Most Web browsers are set to
              accept cookies by default. If you prefer, you can usually choose
              to set your browser to remove cookies and to reject cookies. If
              you choose to remove cookies or reject cookies, this could affect
              certain features or services of our App.
            </Text>
            <Text>
              Opting out of email marketing: You can unsubscribe from our
              marketing email list at any time by clicking on the unsubscribe
              link in the emails that we send or by contacting us using the
              details provided below. You will then be removed from the
              marketing email list — however, we may still communicate with you,
              for example to send you service-related emails that are necessary
              for the administration and use of your account, to respond to
              service requests, or for other non-marketing purposes. To
              otherwise opt-out, you may: Access your account settings and
              update your preferences. Contact us using the contact information
              provided.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              11. CONTROLS FOR DO-NOT-TRACK FEATURES
            </Text>
            <Text>
              Most web browsers and some mobile operating systems and mobile
              applications include a Do-Not-Track ("DNT") feature or setting you
              can activate to signal your privacy preference not to have data
              about your online browsing activities monitored and collected. At
              this stage no uniform technology standard for recognizing and
              implementing DNT signals has been finalized. As such, we do not
              currently respond to DNT browser signals or any other mechanism
              that automatically communicates your choice not to be tracked
              online. If a standard for online tracking is adopted that we must
              follow in the future, we will inform you about that practice in a
              revised version of this privacy policy.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </Text>
            <Text>
              In Short: Yes, if you are a resident of California, you are
              granted specific rights regarding access to your personal
              information. California Civil Code Section 1798.83, also known as
              the "Shine The Light" law, permits our users who are California
              residents to request and obtain from us, once a year and free of
              charge, information about categories of personal information (if
              any) we disclosed to third parties for direct marketing purposes
              and the names and addresses of all third parties with which we
              shared personal information in the immediately preceding calendar
              year. If you are a California resident and would like to make such
              a request, please submit your request in writing to us using the
              contact information provided below. If you are under 18 years of
              age, reside in California, and have a registered account with the
              App, you have the right to request removal of unwanted data that
              you publicly post on the App. To request removal of such data,
              please contact us using the contact information provided below,
              and include the email address associated with your account and a
              statement that you reside in California. We will make sure the
              data is not publicly displayed on the App, but please be aware
              that the data may not be completely or comprehensively removed
              from all our systems (e.g. backups, etc.).
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              13. DO WE MAKE UPDATES TO THIS POLICY?
            </Text>
            <Text>
              In Short: Yes, we will update this policy as necessary to stay
              compliant with relevant laws. We may update this privacy notice
              from time to time. The updated version will be indicated by an
              updated "Revised" date and the updated version will be effective
              as soon as it is accessible. If we make material changes to this
              privacy policy, we may notify you either by prominently posting a
              notice of such changes or by directly sending you a notification.
              We encourage you to review this privacy policy frequently to be
              informed of how we are protecting your information.
            </Text>
            <Text />
            <Text style={styles.headerText2}>
              14. HOW CAN YOU CONTACT US ABOUT THIS POLICY?
            </Text>

            <Text />
            <Text style={styles.headerText2}>
              15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </Text>
            <Text>
              Based on the applicable laws of your country, you may have the
              right to request access to the personal information we collect
              from you, change that information, or delete it in some
              circumstances. 
              </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyModal;
