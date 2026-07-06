'use client';

import { useId, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import Link from 'next/link';

import { register, RegisterRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast';
import { registerValidationSchema } from '@/lib/validation/registerValidationSchema';

import css from './RegisterForm.module.css';
import Loader from '@/components/Loader/Loader';

type RegisterFormValues = RegisterRequest & {
  confirmPassword: string;
};

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterForm() {
  const fieldId = useId();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      const res = await register(registerData);

      if (res) {
        setUser(res);

        showSuccessToast('Successfully registered!');

        router.push('/');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const backendError =
          error.response?.data?.response?.message ||
          error.response?.data?.message ||
          error.message;

        showErrorToast(backendError);
      } else {
        showErrorToast((error as Error).message || 'Internal Server Error');
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values }) => (
        <Form className={css.form}>
          <h1 className={css.formTitle}>Register</h1>

          <div className={css.formComponent}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-name`}>Enter your name</label>

              <Field
                id={`${fieldId}-name`}
                type="text"
                name="name"
                placeholder="John"
                className={`${css.input} ${
                  touched.name && errors.name ? css.inputError : ''
                }`}
              />

              <ErrorMessage
                name="name"
                component="span"
                className={css.error}
              />
            </div>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-email`}>
                Enter your email address
              </label>

              <Field
                id={`${fieldId}-email`}
                type="email"
                name="email"
                placeholder="email@gmail.com"
                className={`${css.input} ${
                  touched.email && errors.email ? css.inputError : ''
                }`}
              />

              <ErrorMessage
                name="email"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-password`}>
                Create a strong password
              </label>

              <div className={css.passwordWrapper}>
                <Field
                  id={`${fieldId}-password`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="********"
                  className={`${css.input} ${
                    touched.password && errors.password ? css.inputError : ''
                  }`}
                />

                <button
                  type="button"
                  className={`${css.eyeButton} 
                    ${values.password.length > 0 ? css.eyeHasText : ''} ${
                      touched.password && errors.password
                        ? css.eyeButtonError
                        : ''
                    }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className={css.eyeIcon} width="24" height="24">
                    <use
                      href={
                        showPassword
                          ? '/icons/eye.svg'
                          : '/icons/eye-crossed.svg'
                      }
                    />
                  </svg>
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="span"
                className={css.error}
              />
            </div>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-confirmPassword`}>
                Confirm your password
              </label>

              <Field
                id={`${fieldId}-confirmPassword`}
                type="password"
                name="confirmPassword"
                placeholder="********"
                className={`${css.input} ${
                  touched.confirmPassword && errors.confirmPassword
                    ? css.inputError
                    : ''
                }`}
              />

              <ErrorMessage
                name="confirmPassword"
                component="span"
                className={css.error}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={css.actionsButton}
            >
              {isSubmitting ? <Loader variant="button" size="small" /> : 'Register'}
            </button>
          </div>

          <p className={css.footerText}>
            Already have an account?{' '}
            <Link href="/auth/login" className={css.registerLink}>
              Login
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
