interface PasswordCredentialData {
  id: string;
  name?: string;
  iconURL?: string;
  password: string;
}

interface PasswordCredential extends Credential {
  readonly password: string;
  readonly name: string;
  readonly iconURL: string;
}

declare var PasswordCredential: {
  prototype: PasswordCredential;
  new (data: PasswordCredentialData): PasswordCredential;
  new (form: HTMLFormElement): PasswordCredential;
};

interface Window {
  PasswordCredential?: typeof PasswordCredential;
}
