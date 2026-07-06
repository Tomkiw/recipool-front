'use client';

import { useId, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/components/Loader/Loader';
import css from './LoginForm.module.css';
import { isAxiosError } from 'axios';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast';
import Link from 'next/link';
import Image from 'next/image';

type LoginFormValues = LoginRequest;

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .max(128, 'Maximum 128 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(128, 'Maximum 128 characters')
    .required('Password is required'),
});

export default function LoginForm() {
  const fieldId = useId();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const res = await login(values);

      if (res) {
        setUser(res);

        showSuccessToast('Successfully logged in!');

        router.push('/');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const backendError =
          error.response?.data?.response?.message || error.message;
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
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values }) => (
        <Form className={css.form}>
          <h1 className={css.formTitle}>Login</h1>
          <div className={css.formComponent}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-email`}>
                Enter your email address
              </label>
              <Field
                type="email"
                name="email"
                id={`${fieldId}-email`}
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id={`${fieldId}-password`}
                  placeholder="*********"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg className={css.eyeIcon} height={24} width={24}>
                    <use
                      href={
                        showPassword
                          ? '/icons/eye.svg'
                          : '/icons/eye-crossed.svg'
                      }
                    />
                  </svg>
                  {/* <Image
                    src={
                      showPassword ? '/icons/eye.svg' : '/icons/eye-crossed.svg'
                    }
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                  /> */}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="span"
                className={css.error}
              />
            </div>

            <button
              type="submit"
              className={css.actionsButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader variant="button" size="small" /> : 'Login'}
            </button>
          </div>
          <p className={css.footerText}>
            Don`t have an account?{' '}
            <Link href="/auth/register" className={css.registerLink}>
              Register
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
