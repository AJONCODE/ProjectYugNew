import React from 'react';

const WalletContext = React.createContext();

export default WalletContext;
export const WalletConsumer = WalletContext.Consumer;
export const WalletProvider = WalletContext.Provider;
