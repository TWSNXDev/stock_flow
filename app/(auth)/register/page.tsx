import RegisterForm from "./_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen">
            <div className="flex-3/4 bg-neutral-50"></div>
            <div className="flex-1/4 flex items-center justify-center bg-neutral-100">
                <div className="w-full px-10">
                    <h1 className="text-3xl font-bold pb-4">Register</h1>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}