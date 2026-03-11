import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { sett } from '../redux/userSlice';
import API from "../utils/host.config"

const useFetchUser = () => {
  const dispatch = useDispatch();

  const stateUser = useSelector((state) => state.user);
  const counter = useSelector((state) => state.counter);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `${API.HOST}/api/v2/myaccount/show/${stateUser.value._id}#${counter.value}`;
        const response = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      });
        const updatedUser = {
          ...stateUser.value,
          img_url: response.data.akun.img_url,
        };

        dispatch(sett(updatedUser));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (stateUser.value._id) {
      fetchUser();
    }
  }, [stateUser.value._id, counter.value]);
};

export default useFetchUser;
