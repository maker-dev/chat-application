import * as yup from 'yup';

const loginSchema = yup.object().shape({
    password: yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(10, "Password cannot exceed 10 characters"),
    email: yup.string()
        .required("Email is required")
        .email("Invalid email address"),
});

export default loginSchema;