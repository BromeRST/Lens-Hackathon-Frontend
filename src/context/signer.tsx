import React, {
    createContext, useContext, useEffect, useMemo, useState,
  } from 'react';
  import Onboard from 'bnc-onboard';
  import { ethers } from 'ethers';
  
  interface ISignerContext {
    signer?: ethers.providers.JsonRpcSigner,
    onboard?: any,
    login?: () => Promise<void>,
    provider?: ethers.providers.Web3Provider,
    connected?: boolean,
    signerAddress?: string,
  }
  
  export const SignerContext = createContext<ISignerContext>({});
  
  export function SignerContextProvider({ children }) {
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [onboard, setOnboard] = useState(null);
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
  
    useEffect(() => {
      const initOnboard = Onboard({
        dappId: '682e29b1-cc78-4233-bd76-2dc200dda20c', // [String] The API key created by step one above
        networkId: 80001, // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
          wallet: (wallet) => {
            const initProvider = new ethers.providers.Web3Provider(
              wallet.provider,
              'any',
            );
            setProvider(initProvider);
          },
        },
        walletSelect: {
          wallets: [{ walletName: 'metamask', preferred: true }],
        },
      });
  
      setOnboard(initOnboard);
    }, []);
  
    useEffect(() => {
      if (provider?.getSigner()) {
        provider.getSigner().getAddress().then((signerAddress) => {
          setAddress(signerAddress);
        });
        setSigner(provider.getSigner());
      }
    }, [provider, connected]);
  
    const login = async () => {
      const select = await onboard.walletSelect();
      if (select) {
        const res = await onboard.walletCheck();
        if (res) {
          setConnected(true);
        }
      }
    };
  
    return (
      <SignerContext.Provider
        value={useMemo(
          () => ({
            signer,
            onboard,
            login,
            provider,
            connected,
            signerAddress: address,
          }),
          [signer, onboard, login, provider, connected, address],
        )}
      >
        {children}
      </SignerContext.Provider>
    );
  }
  
  export const useSigner = () => useContext(SignerContext);