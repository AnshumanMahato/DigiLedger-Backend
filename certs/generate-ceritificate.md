# How to generate TLS certificates for localhost

For this, we will use [mkcert](https://github.com/FiloSottile/mkcert)

## Steps
### Install mkcert (only once).
  Follow the [instructions](https://github.com/FiloSottile/mkcert#installation) for installing mkcert on your operating system. For example, on macOS:
  ```sh
  brew install mkcert
  brew install nss # if you use Firefox
  ```
### Add mkcert to your local root CAs
 In your terminal, run the following command:
  `sh
  mkcert -install
  `
  This generates a local certificate authority (CA). Your mkcert generated local CA is only trusted locally, on your device.

### Generate a certificate for your site, signed by mkcert.

  In your terminal, navigate to this directory (/cert)
  Then, run:
  `sh
  mkcert localhost
  `

  The command above does two things:
  - Generates a certificate for the hostname you've specified
  - Lets mkcert (that you've added as a local CA in Step 2) sign this certificate.
    
  Now, your certificate is ready and signed by a certificate authority your browser trusts locally.

## Caution

Never export or share the file rootCA-key.pem mkcert creates automatically when you run mkcert -install. An attacker getting hold of this file can create on-path
attacks for any site you may be visiting. They could intercept secure requests from your machine to any site—your bank, healthcare provider, or social networks.
If you need to know where rootCA-key.pem is located to ensure it's safe, run mkcert -CAROOT.

Only use mkcert for development purposes—and by extension, never ask end-users to run mkcert commands. 

Development teams: All members of your team should install and run mkcert separately (not store and share the CA and certificate).
