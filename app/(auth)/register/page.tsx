import RegisterForm from "./_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="hidden lg:block lg:flex-3/4 bg-neutral-50"></div>
            <div className="flex-1 lg:flex-1/4 flex items-center justify-center bg-neutral-100 min-h-screen lg:min-h-0">
                <div className="w-full max-w-md px-6 sm:px-10 py-8">
                    <h1 className="text-2xl sm:text-3xl font-bold pb-4">Register</h1>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}