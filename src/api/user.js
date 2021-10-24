import axios from 'axios';

const registerUserUrl = 'http://admin.omioaxaca.org/auth/local/register';

export const registerUser = async (user) => {
    const newUser = {
        ...user,
        username: user.email
    };

    const response = await axios.post(registerUserUrl, newUser);
    return response;
};

export default registerUser;
