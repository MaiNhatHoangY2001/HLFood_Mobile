import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { CMS, STATUS_TABLE } from '../../config/config';
import TableComp from '../../component/TableComp';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Card, MD2Colors, useTheme } from 'react-native-paper';
import { formatCurrency } from 'react-native-format-currency';

const List = ({ props, isShowModal = false, filterData, data }) => {
  const selector = useSelector((state) => state.table);
  const [selected, setSelected] = React.useState(-1);
  const theme = useTheme();
  // Render
  const renderItem = ({ item }) => {
    const borderWidth = isShowModal && selected === item._id ? 2 : 0;
    const status = STATUS_TABLE.clean;

    const handleMoveToDesTable = () => {
      props(item);
      setSelected(item._id);
    };

    const getTypeStringFood = (type) => {
      switch (type) {
        case 0:
          return 'Thức ăn';
        case 1:
          return 'Thức uống';
        default:
          return '';
      }
    };

    return (
      <View style={styles.containerItem}>
        <Card
          style={{
            borderWidth: borderWidth,
            borderColor: theme.colors.primary,
            backgroundColor: status.backgroundColor,
            width: '100%',
            height: 120,
          }}
          onPress={handleMoveToDesTable}
        >
          <Card.Content style={styles.content}>
            <View style={styles.boxFlex}>
              <Card.Cover style={{ width: 70, height: 70 }} source={{ uri: item.image }} />
              <View>
                <Text variant="titleLarge">{item.name}</Text>
                <Text variant="titleMedium">{formatCurrency({ amount: item.price, code: 'VND' })[0]}</Text>
                <Text variant="titleMedium">{getTypeStringFood(item.type)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return selector?.isFetching ? (
    <ActivityIndicator size={'large'} animating={true} color={MD2Colors.red800} />
  ) : (
    <FlatList
      data={data}
      renderItem={renderItem}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
};

export default List;

const styles = StyleSheet.create({
  containerItem: {
    flex: 1,
    padding: 4,
  },
  container: {},
  boxFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCard: {
    // borderBottomWidth: 1,
    // paddingBottom: 8,
  },
});
