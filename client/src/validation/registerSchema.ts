import * as yup from 'yup';

const registerSchema = yup.object().shape({
    pic: yup.string()
        .optional(),
    confirmPassword: yup.string()
        .required("Confirm Password is required")
        .oneOf([yup.ref('password')], 'Passwords must match'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(10, 'Password cannot exceed 10 characters'),
    email: yup.string()
        .required("Email is required")
        .email("Invalid Email address"),
    name: yup.string()
        .required("Name is required"),
})

export default registerSchema;