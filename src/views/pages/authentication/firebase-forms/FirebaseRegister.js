import React from 'react';
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
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { registerUser } from 'api/user';

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
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [showPassword, setShowPassword] = React.useState(false);
    const [schoolLevel, setSchoolLevel] = React.useState('');
    const [schoolGrade, setSchoolGrade] = React.useState('');

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

    return (
        <>
            <Formik
                initialValues={{
                    first_name: '',
                    last_name: '',
                    email: '',
                    birthday: null,
                    password: '',
                    gender: '',
                    phone_number: '',
                    school_name: '',
                    school_level: '',
                    school_grade: '',
                    terms_checked: false,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    first_name: Yup.string().max(255).required('Nombre requerido'),
                    last_name: Yup.string().max(255).required('Apellidos requerido'),
                    gender: Yup.string().required('Género requerido'),
                    email: Yup.string().email('Debe ser un correo válido').max(255).required('Correo requerido'),
                    password: Yup.string().max(255).required('Contraseña Requerida'),
                    phone_number: Yup.string().required('Celular requerido'),
                    school_name: Yup.string().required('Nombre de escuela requerido'),
                    school_level: Yup.string().required('Nivel educativo requerido'),
                    school_grade: Yup.string().required('Año o semestre requerido'),
                    terms_checked: Yup.bool().oneOf([true], 'Para continuar debes aceptar los términos y condiciones.'),
                    birthday: Yup.string().required('Fecha de nacimiento requerido').nullable()
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        const response = await registerUser(values);
                        if (response.status === 200) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        } else {
                            setStatus({ success: false });
                            setErrors({ submit: 'Error desconocido, contacta al administrador.' });
                            setSubmitting(false);
                        }
                    } catch (error) {
                        const errorMessage = error.response.data.data[0].messages[0].message;
                        setStatus({ success: false });
                        setErrors({ submit: errorMessage });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, status }) => {
                    const notSubmitted = !status || !status.success;
                    if (notSubmitted) {
                        return (
                            <form noValidate onSubmit={handleSubmit} {...others}>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
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
                                            onChange={handleChange}
                                            className={classes.loginInput}
                                        />
                                        {touched.first_name && errors.first_name && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.first_name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Apellidos"
                                            margin="normal"
                                            name="last_name"
                                            type="text"
                                            onChange={handleChange}
                                            className={classes.loginInput}
                                        />
                                        {touched.last_name && errors.last_name && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.last_name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth className={classes.selectInput}>
                                            <InputLabel htmlFor="outlined-adornment-password-register">Género</InputLabel>
                                            <Select
                                                value={values.gender}
                                                labelId="gender"
                                                id="gender-select"
                                                name="gender"
                                                type="text"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="F">Femenino</MenuItem>
                                                <MenuItem value="M">Masculino</MenuItem>
                                                <MenuItem value="O">Otro</MenuItem>
                                            </Select>
                                            {touched.gender && errors.gender && (
                                                <FormHelperText error id="standard-weight-helper-text--register">
                                                    {errors.gender}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={matchDownSM ? 0 : 2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                            className={classes.loginInput}
                                        >
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
                                                    {errors.email}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            className={classes.loginInput}
                                        >
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
                                                    {errors.password}
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
                                            value={values.phone_number}
                                            onChange={handleChange}
                                            className={classes.loginInput}
                                        />
                                        {touched.phone_number && errors.phone_number && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.phone_number}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Fecha de nacimiento"
                                                name="birthday"
                                                inputFormat="dd/MM/yyyy"
                                                value={values.birthday}
                                                onChange={(v) => {
                                                    handleChange({ target: { name: 'birthday', value: v } });
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
                                        {touched.birthday && errors.birthday && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.birthday}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
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
                                            value={values.school_name}
                                            onChange={handleChange}
                                            className={classes.loginInput}
                                        />
                                        {touched.school_name && errors.school_name && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.school_name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth className={classes.selectInput}>
                                            <InputLabel htmlFor="school_level-label"> Nivel Educativo </InputLabel>
                                            <Select
                                                labelId="school_level"
                                                id="school_level-select"
                                                name="school_level"
                                                type="text"
                                                value={values.school_level}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleChangeSchoolLevel(e);
                                                }}
                                            >
                                                <MenuItem value="primaria">Primaria</MenuItem>
                                                <MenuItem value="secundaria">Secundaria</MenuItem>
                                                <MenuItem value="preparatoria">Preparatoria</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {touched.school_level && errors.school_level && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.school_level}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth className={classes.selectInput}>
                                            <InputLabel shrink={schoolGrade !== ''} htmlFor="outlined-adornment-password-register">
                                                Año o Semestre
                                            </InputLabel>
                                            <Select
                                                labelId="school_grade"
                                                id="school_grade-select"
                                                name="school_grade"
                                                type="text"
                                                value={values.school_grade}
                                                onChange={handleChange}
                                            >
                                                {currentSchoolYears}
                                            </Select>
                                        </FormControl>
                                        {touched.school_grade && errors.school_grade && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.school_grade}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>

                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={values.checked}
                                                    checked={values.checked}
                                                    onChange={handleChange}
                                                    name="terms_checked"
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
                                        {touched.terms_checked && errors.terms_checked && (
                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                {errors.terms_checked}
                                            </FormHelperText>
                                        )}
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
                        );
                    }
                    return (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <Divider className={classes.signDivider} orientation="horizontal" />
                                <Typography variant="h4" paddingLeft="10px" paddingRight="10px" fontSize="0.75rem">
                                    Registro correcto
                                </Typography>
                                <Divider className={classes.signDivider} orientation="horizontal" />
                            </Box>

                            <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : ''}>
                                Gracias por completar tu registro en la olimpiada, favor de regresar el 1 de diciembre a la pagina para
                                hacer tu examen de diagnostico, adicionalmente se te enviará un correo electrónico a finales de este mes con
                                las fechas importantes que debes tener en cuenta, así como el cuando comenzarán las clases y el link de la
                                reunión.
                            </Typography>

                            <Box
                                sx={{
                                    mt: 2
                                }}
                            >
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        color="secondary"
                                        href="https://omioaxaca.org/"
                                    >
                                        Ir al inicio
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    );
                }}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
