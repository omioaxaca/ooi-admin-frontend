import axios from 'axios';

const registerUserUrl = 'https://admin.omioaxaca.org/api/auth/local/register';

export const registerUser = async (user) => {
    const newUser = {
        ...user,
        username: user.email
    };

    const response = await axios.post(registerUserUrl, newUser);
    return response;
};

export default registerUser;
