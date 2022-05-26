import {
    Alert,
    AppRegistry,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sendIcon from '../images/wallet/send.png';
import { tokenABI } from '../utils/token.abi';
import { ethers } from 'ethers';

const styles = StyleSheet.create({
    containerColor: {
        backgroundColor: '#fff',
    },
    containerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
    },
    safeArea: {
        flex: 1,
    },
    activeButton: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: '#156ca1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    activeButtonText: {
        color: '#edf4f8',
        fontWeight: '600',
    },
    inactiveButton: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: '#efefef',

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    inactiveButtonText: {
        fontWeight: '600',
        color: '#8f8f8f',
    },
    sendTrxn: {
        fontWeight: '700',
        color: '#00b800',
    },
    receivedTrxn: {
        fontWeight: '700',
        color: '#ff7c7c',
    },
});

const SingleWalletAllTransactions = ({ navigation, route }) => {

    const { walletAddress, privateKey } = route.params;
    const [screenLoading, setScreenLoading] = React.useState(true);
    const [transactionHistory, setTransactionHistory] = React.useState([]);


    const addTokenDetails = async (transactionArray) => {

        let wallet = new ethers.Wallet(privateKey);

        const bscProvider = await new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance-testnet', chainId: 97 })

        wallet = wallet.connect(bscProvider);

        for (let x = 0; x < transactionArray.length; x++) {

            let singleObj = transactionArray[x];

            let contract = new ethers.Contract(
                singleObj.token,
                tokenABI,
                wallet,
            );

            let tokenSymbol = await contract.symbol();

            singleObj.tokenSymbol = tokenSymbol
        }

        transactionArray.sort(function(a, b){return b.date - a.date});

        setTransactionHistory(transactionHistory => ([
            ...transactionHistory,
            ...transactionArray
        ]));

        console.log('All Transactions with tokens', transactionArray);

        setScreenLoading(false);
    }



    const getHistory = async () => {
        //await AsyncStorage.removeItem('transactions');

        setScreenLoading(true);

        let transacData = await AsyncStorage.getItem('transactions');
        transacData = JSON.parse(transacData);

        if (transacData !== null) {

            let walletTrxData = transacData[walletAddress];

            let walletTrxValues = Object.values(walletTrxData);

            let finalArr = [];

            for (let x = 0; x < walletTrxValues.length; x++) {

                let singleObj = walletTrxValues[x];

                if (Object.values(singleObj).length > 0) {
                    let a = Object.values(singleObj);
                    finalArr = finalArr.concat(a);
                    //console.log('object @ ', x, Object.values(singleObj));
                } else {
                    finalArr = finalArr.concat(singleObj);
                    //console.log('object @ ', x, singleObj);
                }
            }

            console.log('All Transactions', finalArr);

            addTokenDetails(finalArr)
        }
    }

    React.useEffect(() => {
        getHistory();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            {screenLoading && (
                <View style={styles.containerLoading}>
                    <ActivityIndicator size="small" color="#004c73" />
                </View>
            )}

            {!screenLoading && (
                <View style={styles.container}>


                    <View
                        style={{
                            flexDirection: 'row',
                            height: 50,
                            backgroundColor: '#efefef',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            marginBottom: 20
                        }}
                    >
                        <View
                            style={{
                                width: '50%',
                                alignItems: 'flex-start'
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>Transaction</Text>
                        </View>
                        <View
                            style={{
                                width: '50%',
                                alignItems: 'flex-end',
                                fontSize: 30,
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>Amount</Text>
                        </View>
                    </View>

                    {transactionHistory.length === 0 && (
                        <Text style={{ fontSize: 15 }}>No Transactions yet.</Text>
                    )
                    }

                    {transactionHistory.length !== 0 &&
                        transactionHistory.map((trxn) => (
                            <View
                                key={trxn.trxnHash}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                    paddingBottom: 5,
                                    marginBottom: 25,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'grey',
                                    borderStyle: 'dashed'
                                }}
                            >
                                <View
                                    style={{
                                        width: '60%',
                                        alignItems: 'flex-start',
                                    }}
                                >


                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 5
                                        }}
                                    >
                                        <Image source={sendIcon} style={{ width: 30, height: 30, marginRight: 8 }} />
                                        <Text style={{ fontSize: 20 }}>Send {trxn.tokenSymbol}</Text>

                                    </View>


                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{ marginRight: 15 }}>{new Date(trxn.date).toLocaleDateString()}</Text>
                                        <Text style={{ marginRight: 2, fontWeight: 'bold' }}>To : </Text>
                                        <Text>
                                            {(trxn.to).slice(0, 6)}......
                                            {(trxn.to).slice((trxn.to).length - 6, (trxn.to).length)}
                                        </Text>
                                    </View>

                                </View>
                                <View
                                    style={{
                                        width: '40%',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Text style={{ fontSize: 20, color: '#308dd4' }}>
                                        {trxn.amount} {trxn.tokenSymbol}
                                    </Text>
                                </View>
                            </View>
                        ))
                    }

                </View>
            )}
        </SafeAreaView>
    );
};

export default SingleWalletAllTransactions;
