import RegisterForm from '@/components/RegisterForm/RegisterForm';
import css from './RegisterPage.module.css';

export default function LoginPage() {
  return (
    <div className={css.mainContent}>
      <RegisterForm />
    </div>
  );
}
