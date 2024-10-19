import { Card } from "@/components/ui/card";

export function WelcomePage() {
  return (
    <div className="absolute z-10 h-full w-full p-24">
      <Card className="p-4">
        <div>
          <p className="mt-4 text-center text-4xl font-bold">
            Welcome to TaskFlow!
          </p>
          <p className="text-center text-2xl">
            Please log in to access your tasks and calendar.
          </p>
        </div>
      </Card>
    </div>
  );
}
