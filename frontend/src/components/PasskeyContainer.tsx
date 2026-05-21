import { authClient } from "../api/auth-client";

export function PasskeyContainer() {
  const genPasskey = async () => {
    const { error } = await authClient.passkey.addPasskey({
      name: "example-passkey-name",
    });
    if (error) {
      console.log("Passkey creation failed.");
    }
  };

  return (
    <section className="passkeyContainer">
      <div className="passkeyInfo">
        <img src="/icons/passkey.svg" alt="" aria-hidden="true" />
        <h2>Use Passkeys</h2>
      </div>
      <div className="seperationLine"></div>
      <button className="button button--primary" onClick={genPasskey}>
        Generate Passkey
      </button>
    </section>
  );
}
