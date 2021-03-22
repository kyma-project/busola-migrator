# Run locally

Prepare environment variables. You can get the values from Kyma Runtime secret (and decode from bas64):
```
kubectl get secret -n kyma-system uaa-issuer-secret -oyaml
```

You need to set:
```
export UAA_URL="https://123a7d123trial.authentication.eu10.hana.ondemand.com"
export UAA_CLIENT_ID=sb-c-123abc12_kyma_shoot_live_k8s-hana_ondemand_com_uddil!t12345
export UAA_CLIENT_SECRET=very_secret
export DOMAIN=c-123abc12.kyma.shoot.live.k8s-hana.ondemand.com
```

And start the application:
```
npm install
node index.js
```

You need to catch redirect URL in your local host. Add this line to yor `/etc/hosts` (replace domain with the right value ):

```
127.0.0.1 dex.c-123abc12.kyma.shoot.live.k8s-hana.ondemand.com
```

In your browser enter:

[http://localhost:8080](http://localhost:8080)


You will be redirected to something like this:
```
https://dex.c-123abc12.kyma.shoot.live.k8s-hana.ondemand.com/callback?code=xSkRSxvrtN&state=blabla
```

Now replace domain with localhost:8080 in your browser:
```
http://localhost:8080/callback?code=xSkRSxvrtN&state=blabla
```

In the result you should see something like this:
```
{
  access_token: "eyJhbGc....u95WDIdq7mxFnd05AUoQ",
  token_type: "bearer",
  id_token: "eyJhbGciOiJSUzI1NiIsImprd....tU6WlpfH15lZvtr6CcUfF9Ft38yA",
  refresh_token: "ed8639...a0f1d471-r",
  expires_in: 43199,
  scope: "openid c-123abc12_kyma_shoot_live_k8s-hana_ondemand_com_uddil!t12345.runtimeNamespaceAdmin",
  jti: "35007368165844e09dd8ea8a22cecc59"
  ...
}
```

# Next steps

To be implemented:

1. Validate the token and check the scopes
2. Add proper cluster role (admin/developer) in the runtime (remember to label the rolebinding to know if cluster is migrated)
3. Build url for busola and redirect user there
4. Provide nice screen for the user with (see TODO in the code)
5. Create k8s deployment for the application (mount uaa-issuer-secret)
