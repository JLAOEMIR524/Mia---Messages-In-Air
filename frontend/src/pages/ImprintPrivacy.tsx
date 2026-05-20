import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ImprintPrivacy() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Mia | Imprint & Privavy";
  }, []);

  return (
    <main className="left">
      <Link
        to="#"
        onClick={handleBack}
        className="StepBack"
        aria-label="go back"
      >
        <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
      </Link>

      <div className="imprint-privacy-container">
        <Link
          to="#"
          onClick={handleBack}
          className="ImprintStepBack"
          aria-label="go back"
        >
          <img src="./icons/arrow-back.svg" alt="" aria-hidden="true" />
        </Link>
        <h1 className="text-l">Imprint & Privacy 📜</h1>

        <section className="imprint">
          <p>
            This website is a project of the MMT degree program at Salzburg
            University of Applied Sciences.
          </p>

          <div className="contact-info">
            <strong>The persons responsible for the content are:</strong>
            <br />
            Julian Obermeier
            <br />
            Sonja Schorn
          </div>

          <div className="contact-info">
            <strong>Address:</strong>
            <br />
            Salzburg University of Applied Sciences
            <br />
            Urstein Süd 1<br />
            5412 Puch bei Hallein
          </div>
        </section>

        <section className="privacy-policy">
          <h2 className="text-m">Privacy Policy</h2>

          <div className="note">
            <p>
              <strong>Note:</strong> This website was created as part of a
              project at Salzburg University of Applied Sciences and is intended
              exclusively for academic purposes.
            </p>
          </div>

          <h3 className="text-s">Personal Data</h3>
          <p>
            We collect, process, and use your personal data only with your
            consent or authorization, or in order to fulfill agreed purposes, or
            where another legal basis in accordance with the GDPR applies. This
            is done in compliance with data protection and civil law
            regulations. Only personal data that is necessary for the
            performance and processing of our services, or that you voluntarily
            provide to us, is collected. Personal data includes all data
            relating to an identified or identifiable person, such as name,
            address, email address, telephone number, date of birth, age,
            gender, social security number, video recordings, photos, voice
            recordings, and biometric data such as fingerprints.
          </p>

          <h3 className="text-s">Access and Deletion</h3>
          <p>
            As a customer or data subject, you have the right at any time to
            obtain information about your stored personal data, its origin and
            recipients, and the purpose of data processing. You also have the
            right to rectification, data portability, objection, restriction of
            processing, as well as blocking or deletion of incorrect or
            unlawfully processed data.
          </p>
          <p>
            If your personal data changes, we kindly ask you to inform us
            accordingly. You may revoke your consent to the use of your personal
            data at any time. Requests for information, deletion, correction,
            objection, and/or data portability (provided this does not involve
            disproportionate effort) can be addressed to the contact details
            listed below. If you believe that the processing of your personal
            data violates applicable data protection law or that your data
            protection rights have been infringed in any other way, you may
            lodge a complaint with the competent supervisory authority. In
            Austria, this is the Data Protection Authority.
          </p>

          <h3 className="text-s">Data Security</h3>
          <p>
            The protection of your personal data is ensured through appropriate
            organizational and technical measures. These measures are intended
            in particular to protect against unauthorized, unlawful, or
            accidental access, processing, loss, use, and manipulation. Despite
            our efforts to maintain a high standard of care, it cannot be ruled
            out that information transmitted over the internet may be accessed
            or used by third parties. Therefore, we accept no liability for the
            disclosure of information caused by errors in data transmission not
            attributable to us and/or unauthorized access by third parties (e.g.
            hacking of email accounts or telephones, interception of faxes).
          </p>

          <h3 className="text-s">Use of Data</h3>
          <p>
            We will not process the data provided to us for purposes other than
            those covered by your request, your consent, or other provisions in
            accordance with the GDPR. An exception applies to use for
            statistical purposes, provided the data has been anonymized.
          </p>

          <h3 className="text-s">Transfer of Data to Third Parties</h3>
          <p>
            To fulfill your request, it may be necessary to . forward your data
            to third parties. Specifically, uploaded images are processed via
            the Sightengine API (Sightengine SAS, France) solely for the purpose
            of content moderation and automated safety checks. Data is
            transferred exclusively on the basis of the GDPR..., in particular
            for contract fulfillment or with your prior consent. Some recipients
            of your personal data may be located outside your country or process
            your data there. The level of data protection in other countries may
            not be equivalent to that of Austria. However, we only transfer
            personal data to countries for which the EU Commission has
            determined an adequate level of data protection.
          </p>

          <h3 className="text-s"> OpenStreetMap & Leaflet</h3>
          <p>
            This website uses the open-source mapping tool Leaflet to display
            interactive maps. To render the map layout and details, visual data
            ("map tiles") are loaded directly from the servers of OpenStreetMap
            (OpenStreetMap Foundation, St John’s Innovation Centre, Cowley Road,
            Cambridge, CB4 0WS, United Kingdom).
          </p>
          <p>
            When you visit a page with an embedded map, your browser establishes
            a direct connection to OpenStreetMap's servers. During this process,
            your IP address and device information are transmitted to
            OpenStreetMap. The use of this service is based on our legitimate
            interest in providing a user-friendly and informative website in
            accordance with Art. 6 (1) (f) GDPR. For more information on how
            your data is handled, please refer to the privacy policy of
            OpenStreetMap:{" "}
            <a
              href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://wiki.osmfoundation.org/wiki/Privacy_Policy
            </a>
          </p>
          <h3 className="text-s">Notification of Data Breaches</h3>
          <p>
            We strive to ensure that data breaches are identified early and,
            where necessary, promptly reported to you and/or the competent
            supervisory authority, including the relevant categories of affected
            data.
          </p>

          <h3 className="text-s">Data Retention</h3>
          <p>
            We do not retain data longer than necessary to fulfill our
            contractual or legal obligations or to defend against potential
            liability claims.
          </p>

          <h3 className="text-s">Cookies</h3>
          <p>This website does not use any cookies.</p>

          <h3 className="text-s">Contact Details</h3>
          <p>
            The protection of your data is very important to us. You can contact
            us at any time using the details below for questions or to withdraw
            your consent.
          </p>
          <p>
            <strong>Julian Obermeier and Sonja Schorn</strong>
            <br />
            Urstein S 1, 5412 Salzburg, Austria
            <br />
            <a href="mailto:sschorn.mmt-b2024@fh-salzburg.ac.at">
              sschorn.mmt-b2024@fh-salzburg.ac.at
            </a>
            <br />
            <a href="mailto:jobermeier.mmt-b2024@fh-salzburg.ac.at">
              jobermeier.mmt-b2024@fh-salzburg.ac.at
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
