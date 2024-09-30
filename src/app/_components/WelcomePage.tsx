import { Card } from "@/components/ui/card";

export function WelcomePage() {
  return (
    <div className="absolute z-10 h-full w-full p-24">
      <Card className="p-4">
        <div>
          <p className="text-4xl font-bold text-center mt-4">
            Welcome to TaskFlow!
          </p>
          <p className="text-2xl text-center">
            Please log in to access your tasks and calendar.
          </p>
        </div>
      </Card>
    </div>
  );
}
