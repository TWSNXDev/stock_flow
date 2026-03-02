import LoginForm from '@/components/layout/LoginForm'

function LoginPage() {
  return (
    <div className='flex min-h-screen'>
        <div className="flex-3/4 bg-neutral-50"></div>
        <div className="flex-1/4 flex items-center justify-center bg-neutral-100">
            <div className="w-full px-10">
                <h1 className="text-3xl font-bold pb-4">Login</h1>
                <LoginForm />
            </div>
        </div>
    </div>
  )
}

export default LoginPage