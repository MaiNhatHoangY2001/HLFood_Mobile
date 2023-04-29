import axiosJWT from 'axios-jwt';
import { REACT_APP_HOST_API_SERVER } from "@env"
import { 
  deleteOrderDetailFailed,
  deleteOrderDetailStart,
  deleteOrderDetailSuccess,
  getOrderByIdFailed, 
  getOrderByIdStart, 
  getOrderByIdSuccess, 
  saveOrderDetailsFailed, 
  saveOrderDetailsStart, 
  saveOrderDetailsSuccess, 
  saveOrderFailed, 
  saveOrderStart, 
  saveOrderSuccess, 
  updateOrderDetailFailed, 
  updateOrderDetailStart, 
  updateOrderDetailSuccess 
} from "../slice/orderSlice";

export const saveOrder = async (dispatch, employeeId, bookingTable, time_booking) => {
  dispatch(saveOrderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_HOST_API_SERVER}/api/order`, 
    {
      employee: employeeId,
      bookingTable: bookingTable,
      time_booking: time_booking,
    }, {
      headers: { token: `bear ${accessToken}` },
    });
    dispatch(saveOrderSuccess());
    return await res.data.orderId;
  } catch (error) {
    dispatch(saveOrderFailed());
    console.log(error);
  }
};

/**
 * Api get Order
 * @param {useDispatch} dispatch in react-redux 
 * @param {String} IdOrder Id of Order 
 * @returns Object Order
 */
export const getOrderById = async (dispatch, idOrder, accessToken) => {
  dispatch(getOrderByIdStart())
  try {
    const res = await axiosJWT.get(`${REACT_APP_HOST_API_SERVER}/api/order`, 
    {
      params: {
        id: idOrder
      }
    }, {
      headers: { token: `bear ${accessToken}` },
    })
    dispatch(getOrderByIdSuccess(res?.data));
    return await res?.data;
  } catch (error) {
    console.log(error)
    dispatch(getOrderByIdFailed())
  }
}

export const saveOrderDetails = (dispatch, orderDetails, accessToken) => {
  dispatch(saveOrderDetailsStart());
  try {
    axiosJWT.post(`${REACT_APP_HOST_API_SERVER}/api/booking/food`, {
      orderDetails: orderDetails
    }, {
      headers: { token: `bear ${accessToken}` },
    });
    dispatch(saveOrderDetailsSuccess());
  } catch (error) {
    dispatch(saveOrderDetailsFailed());
    console.log(error);
  }
}

export const updateOrderDetail = async (dispatch, orderDetails, accessToken) => {
  dispatch(updateOrderDetailStart());
  try {
    await axiosJWT.put(`${REACT_APP_HOST_API_SERVER}/api/booking/food`, orderDetails, {
      headers: { token: `bear ${accessToken}` },
    });
    dispatch(updateOrderDetailSuccess());
  } catch (error) {
    dispatch(updateOrderDetailFailed());
    console.log(error);
  }
}

export const deleteOrderDetail = async (dispatch, idOrderDetail, accessToken) => {
  dispatch(deleteOrderDetailStart());
  try {
    await axiosJWT.delete(`${REACT_APP_HOST_API_SERVER}/api/booking/food/` + idOrderDetail, {
      headers: { token: `bear ${accessToken}` },
    });
    dispatch(deleteOrderDetailSuccess());
  } catch (error) {
    dispatch(deleteOrderDetailFailed());
    console.log(error);
  }
}
