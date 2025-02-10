import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="flex-1 flex justify-center">
      <LoginForm className="mt-16 w-max" />
    </div>
  )
}
// <form>
// <label htmlFor="email">Email:</label>
// <input id="email" name="email" type="email" required />
// <button formAction={auth}>Log in</button>
// </form>