import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';

import CoinItem from './components/CoinItem';

export interface ICoinItem {
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const App = () => {
  const [coins, setCoins] = useState<ICoinItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
    );
    const data = await res.json();
    setCoins(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#141414" />

      <View style={styles.header}>
        <Text style={styles.title}>CryptoPablo</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Cripto"
          placeholderTextColor="#858585"
          onChangeText={text => text && setSearch(text)}
        />
      </View>

      <FlatList
        style={styles.list}
        renderItem={({item}) => <CoinItem coin={item} />}
        data={coins.filter(
          coin =>
            coin.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            coin.symbol
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()),
        )}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
  list: {
    width: '90%',
  },
  searchInput: {
    color: '#fff',
    borderBottomColor: '#4657CE',
    borderBottomWidth: 1,
    width: '40%',
    textAlign: 'center',
  },
});
