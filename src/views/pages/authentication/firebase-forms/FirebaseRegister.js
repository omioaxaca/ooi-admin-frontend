import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Select,
    MenuItem
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// style constant
const useStyles = makeStyles((theme) => ({
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[700],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: `${theme.palette.grey[100]} !important`,
        color: `${theme.palette.grey[900]}!important`,
        fontWeight: 500
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    loginInput: {
        ...theme.typography.customInput
    },
    selectInput: {
        ...theme.typography.customInputSelect
    }
}));

//= ==========================|| FIREBASE - REGISTER ||===========================//

const FirebaseRegister = ({ ...others }) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [birthdayValue, setBirthdayValue] = React.useState(null);
    const [schoolLevel, setSchoolLevel] = React.useState('');
    const [schoolGrade, setSchoolGrade] = React.useState('');
    const [firstNameValue, setFirstNameValue] = React.useState('');

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState('');

    const schoolYears = {
        primaria: [
            ['1', 'Primer Año'],
            ['2', 'Segundo Año'],
            ['3', 'Tercer Año'],
            ['4', 'Cuarto Año'],
            ['5', 'Quinto Año'],
            ['6', 'Sexto Año']
        ],
        secundaria: [
            ['1', 'Primer Año'],
            ['2', 'Segundo Año'],
            ['3', 'Tercer Año']
        ],
        preparatoria: [
            ['1', 'Primer Semestre'],
            ['2', 'Segundo Semestre'],
            ['3', 'Tercer Semestre'],
            ['4', 'Cuarto Semestre'],
            ['5', 'Quinto Semestre'],
            ['6', 'Sexto Semestre']
        ]
    };

    let currentSchoolYears = [];
    if (schoolLevel) {
        currentSchoolYears = schoolYears[schoolLevel].map((year) => <MenuItem value={year[0]}>{year[1]}</MenuItem>);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleChangeSchoolLevel = (event) => {
        const schoolLevelSelected = event.target.value;
        const firstSchoolGradeKey = schoolYears[schoolLevelSelected][0][0];
        setSchoolLevel(schoolLevelSelected);
        setSchoolGrade(firstSchoolGradeKey);
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    first_name: Yup.string().max(255).required('Nombre requerido'),
                    email: Yup.string().email('Debe ser un correo válido').max(255).required('Correo requerido'),
                    password: Yup.string().max(255).required('Contraseña Requerida')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    console.log(values);
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <Divider className={classes.signDivider} orientation="horizontal" />
                                <Typography variant="h4" paddingLeft="10px" paddingRight="10px" fontSize="0.75rem">
                                    Datos Personales
                                </Typography>
                                <Divider className={classes.signDivider} orientation="horizontal" />
                            </Box>
                        </Grid>

                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nombre(s)"
                                    margin="normal"
                                    name="first_name"
                                    type="text"
                                    value={firstNameValue}
                                    onChange={(event) => setFirstNameValue(event.target.value)}
                                    className={classes.loginInput}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Apellidos"
                                    margin="normal"
                                    name="last_name"
                                    type="text"
                                    className={classes.loginInput}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth className={classes.selectInput}>
                                    <InputLabel htmlFor="outlined-adornment-password-register">Género</InputLabel>
                                    <Select value="" labelId="gender" id="gender-select" name="gender" type="text">
                                        <MenuItem value="F">Femenino</MenuItem>
                                        <MenuItem value="M">Masculino</MenuItem>
                                        <MenuItem value="O">Otro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.email && errors.email)} className={classes.loginInput}>
                                    <InputLabel htmlFor="outlined-adornment-email-register">Correo Electrónico</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email-register"
                                        type="email"
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{
                                            classes: {
                                                notchedOutline: classes.notchedOutline
                                            }
                                        }}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {' '}
                                            {errors.email}{' '}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                                    <InputLabel htmlFor="outlined-adornment-password-register">Contraseña</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password-register"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        label="Password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        inputProps={{
                                            classes: {
                                                notchedOutline: classes.notchedOutline
                                            }
                                        }}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-register">
                                            {' '}
                                            {errors.password}{' '}
                                        </FormHelperText>
                                    )}
                                    {strength !== 0 && (
                                        <FormControl fullWidth>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <Box
                                                        backgroundColor={level.color}
                                                        sx={{
                                                            width: 85,
                                                            height: 8,
                                                            borderRadius: '7px'
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                                        {level.label}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefono celular"
                                    margin="normal"
                                    name="phone_number"
                                    type="text"
                                    className={classes.loginInput}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Fecha de nacimiento"
                                        name="birthday"
                                        inputFormat="dd/MM/yyyy"
                                        value={birthdayValue}
                                        onChange={(newValue) => {
                                            setBirthdayValue(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                margin="normal"
                                                name="birthday"
                                                type="text"
                                                className={classes.loginInput}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <Divider className={classes.signDivider} orientation="horizontal" />
                                <Typography variant="h4" paddingLeft="10px" paddingRight="10px" fontSize="0.75rem">
                                    Datos Académicos
                                </Typography>
                                <Divider className={classes.signDivider} orientation="horizontal" />
                            </Box>
                        </Grid>

                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nombre de Escuela"
                                    margin="normal"
                                    name="school_name"
                                    type="text"
                                    className={classes.loginInput}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth className={classes.selectInput}>
                                    <InputLabel htmlFor="school_level-label"> Nivel Educativo </InputLabel>
                                    <Select
                                        labelId="school_level"
                                        id="school_level-select"
                                        name="school_level"
                                        type="text"
                                        value={schoolLevel}
                                        onChange={handleChangeSchoolLevel}
                                    >
                                        <MenuItem value="primaria">Primaria</MenuItem>
                                        <MenuItem value="secundaria">Secundaria</MenuItem>
                                        <MenuItem value="preparatoria">Preparatoria</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth className={classes.selectInput}>
                                    <InputLabel shrink={schoolGrade != null} htmlFor="outlined-adornment-password-register">
                                        Año o Semestre
                                    </InputLabel>
                                    <Select
                                        labelId="school_grade"
                                        id="school_grade-select"
                                        name="school_grade"
                                        type="text"
                                        value={schoolGrade}
                                        onChange={(event) => {
                                            setSchoolGrade(event.target.value);
                                        }}
                                    >
                                        {currentSchoolYears}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Acepto los &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Térmimos y condiciones.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box
                                sx={{
                                    mt: 3
                                }}
                            >
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box
                            sx={{
                                mt: 2
                            }}
                        >
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Registrarme
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
