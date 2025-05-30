import axios from "axios";
import { showAlert } from "./alert";

// type will be either 'password' or 'data'.
export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ?
            '/api/v1/users/updatePassword' :
            '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
        console.log(error.response.data);
    }
}