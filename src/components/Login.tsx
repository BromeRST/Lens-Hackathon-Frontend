import { useSigner } from '../context/signer';

function Login() {
  const {
    login, connected, signerAddress,
  } = useSigner();

  return (
    !connected || !signerAddress ? (
      <div className="login-btn" onClick={login}>
        Connect Wallet
      </div>
    ) : (
      <div className="login-btn">

        {`${signerAddress?.substring(0, 6)
        }...${
          signerAddress?.substring(36)}`}

      </div>
    )
  );
}

export default Login;