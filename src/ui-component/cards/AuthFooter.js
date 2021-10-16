import React from 'react';

// material-ui
import { Link, Typography, Stack } from '@material-ui/core';

// ===========================|| FOOTER - AUTHENTICATION 2 & 3 ||=========================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography color="#FFFFFF" variant="subtitle2" component={Link} href="https://omioaxaca.org" target="_blank" underline="hover">
            www.omioaxaca.org
        </Typography>
        <Typography color="#FFFFFF" variant="subtitle2" component={Link} href="https://omioaxaca.org" target="_blank" underline="hover">
            &copy; comité ooi
        </Typography>
    </Stack>
);

export default AuthFooter;
