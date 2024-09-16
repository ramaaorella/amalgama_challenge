import LoginForm from "@/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginScreen = () => {
  return (
    <div className="bg-gray-50 h-full content-center">
      <Card className="max-w-[400px] h-fit m-auto">
        <CardHeader className="space-y-0">
          <CardTitle className="text-lg">Inicie sesión</CardTitle>
          <CardDescription>
            Ingresá tu email y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
