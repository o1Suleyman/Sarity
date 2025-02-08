import { auth } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <button formAction={auth}>Log in</button>
    </form>
  )
}