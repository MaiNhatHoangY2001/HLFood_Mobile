import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CMS } from '../../config/config'
import { useDispatch, useSelector } from "react-redux";
import { TableContext } from "../../context/TableContext";
import { Divider } from 'react-native-paper';
import Header from "../../common/Header";
import List from "./List";
import { getAllTable } from "../../redux/api/tableApi";
import ModalComp from "./ModalComp";
import { getAllFood } from "../../redux/api/foodApi";
import { FoodContext } from '../../context/FoodContext';
import { getOrderById } from "../../redux/api/orderApi";
import { createAxios } from "../../redux/createInstance";
import { loginSuccess } from "../../redux/slice/authSlice";
import React from "react";
import Filter from "./Filter";

const Table = ({ navigation }) => {
  const numTable = useRef();
  const userSelector = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const axiosJWT = createAxios(userSelector?.data, dispatch, loginSuccess);
  const { setTable, getData } = useContext(TableContext);
  const { setFoodWaitContext } = useContext(FoodContext);
  const [modalVisible, setModalVisible] = useState(-1);
  const [orderId, setOrderId] = useState("");

  const handleShowModal = (item = {}) => {
    item.status > 1 ? setOrderId(item.order) : setOrderId("");
    setModalVisible(item.status);
    setTable(item);
    numTable.current = item.table_num;
  }

  const handleCloseModal = () => {
    setModalVisible(-1);
  }

  const handleMovePage = async (id) => {
    switch (id) {
      case 0:
        setFoodWaitContext([]);
        getAllFood(dispatch, userSelector?.data?.accessToken, axiosJWT);
        navigation.navigate('ListFood', { numTable: numTable.current, idOrdered: orderId });
        break;
      case 1:
        getOrderById(dispatch, orderId, userSelector?.data?.accessToken, axiosJWT);
        navigation.navigate('TableMerge', { idOrder: orderId });
        break;
      case 2:
        getOrderById(dispatch, orderId, userSelector?.data?.accessToken, axiosJWT);
        navigation.navigate('ListFoodOrdered', { numTable: numTable.current, idOrdered: orderId });
        break;
      case 3:
        getOrderById(dispatch, orderId, userSelector?.data?.accessToken, axiosJWT);
        console.log('token', userSelector?.data?.accessToken);
        navigation.navigate('DetailListFood');
        break;
      default:
        break;
    }
    handleCloseModal();
  }

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }


  // Fetch Data
  const fetchData = async () => {
    const param = {};
    if (userSelector?.data?.job_title === 3) {
      param.employee = userSelector?.data._id;
    }
    await getAllTable(dispatch, param, userSelector?.data?.accessToken, axiosJWT);
  }
  useEffect(() => {
    fetchData();
  }, [getData]);


  return (
    <View style={styles.container}>
      <Header isShowDrawer={true} title={CMS.logo} mode="center-aligned" openDrawer={handleOpenDrawer} />

      <Filter />

      <Divider />

      <List
        props={handleShowModal}
        isShowModal={modalVisible > -1}
      />

      <ModalComp
        isShow={modalVisible > -1}
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
        navigation={navigation}
        props={handleMovePage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  tableList: {
    flex: 1,
  },
  listBooked: {
    backgroundColor: "white",
  },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Table;